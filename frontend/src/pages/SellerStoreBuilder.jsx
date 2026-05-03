import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSellerCtx, ac, BASE, IconExternal } from "../components/SellerLayout";

/* ─────────────────────────────────────────────────────────
   BLOCK TYPE METADATA  (label, description, accent colour)
───────────────────────────────────────────────────────── */
const BLOCK_TYPE_META = {
  products: {
    label: "Products Grid", desc: "Your full product catalogue",
    accent: "#2563eb", bg: "#eff6ff",
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="7" height="7"/><rect x="14" y="3" width="7" height="7"/><rect x="14" y="14" width="7" height="7"/><rect x="3" y="14" width="7" height="7"/></svg>),
  },
  text: {
    label: "Text Block", desc: "Heading, story, or announcement",
    accent: "#7c3aed", bg: "#f5f3ff",
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>),
  },
  image_grid: {
    label: "Image Grid", desc: "Multi-image layout with category links",
    accent: "#0891b2", bg: "#ecfeff",
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="3" width="18" height="18" rx="2"/><circle cx="8.5" cy="8.5" r="1.5"/><polyline points="21 15 16 10 5 21"/></svg>),
  },
  banner: {
    label: "Banner", desc: "Full-width hero image with headline",
    accent: "#db2777", bg: "#fdf2f8",
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="5" width="18" height="14" rx="2"/><polyline points="3 10 12 15 21 10"/></svg>),
  },
  announcement: {
    label: "Announcement", desc: "Promo strip, sale alert, or notice",
    accent: "#d97706", bg: "#fffbeb",
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 12h-4l-3 9L9 3l-3 9H2"/></svg>),
  },
  video: {
    label: "Video", desc: "YouTube or video link",
    accent: "#dc2626", bg: "#fef2f2",
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>),
  },
  divider: {
    label: "Divider", desc: "Visual separator or spacer",
    accent: "#64748b", bg: "#f8fafc",
    icon: (<svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="3" y1="12" x2="21" y2="12"/><line x1="3" y1="6" x2="21" y2="6"/><line x1="3" y1="18" x2="21" y2="18"/></svg>),
  },
};

/* ─────────────────────────────────────────────────────────
   DEFAULT STYLE CONFIG
───────────────────────────────────────────────────────── */
const DEFAULT_STYLE = {
  padding_top: 0, padding_bottom: 0, padding_x: 0,
  full_width: false,
  bg_color: "", text_color: "",
  font_family: "", font_size: 0, font_weight: "",
  letter_spacing: 0, line_height: 0,
  border_radius: 0,
  visibility: "all",   // "all" | "desktop" | "mobile"
  condition: "always", // "always" | "draft"
};

/* ─────────────────────────────────────────────────────────
   STYLE PANEL  (per-block deep customisation)
   Controlled component — all state lives in parent.
───────────────────────────────────────────────────────── */
const StylePanel = ({ blockType, styleConfig, onUpdate }) => {
  const sc = { ...DEFAULT_STYLE, ...(styleConfig || {}) };
  const upd = (key, val) => onUpdate({ ...sc, [key]: val });
  const showTypo = !["divider", "image_grid", "banner"].includes(blockType);

  const SH = ({ label, first }) => (
    <div style={{ fontSize: "10px", fontWeight: 700, color: "#2563eb", textTransform: "uppercase", letterSpacing: "0.08em", marginBottom: "10px", marginTop: first ? "0" : "16px", paddingTop: first ? "0" : "14px", borderTop: first ? "none" : "1px solid #dbeafe" }}>
      {label}
    </div>
  );

  const Row = ({ label, children }) => (
    <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
      <label style={{ fontSize: "11.5px", color: "#475569", fontWeight: 500, flexShrink: 0, width: "104px" }}>{label}</label>
      <div style={{ flex: 1, display: "flex", alignItems: "center", gap: "8px" }}>{children}</div>
    </div>
  );

  const Slider = ({ k, min, max, step, unit = "px", zeroLabel }) => (
    <>
      <input type="range" min={min} max={max} step={step} value={sc[k]}
        onChange={e => upd(k, step < 1 ? parseFloat(e.target.value) : parseInt(e.target.value, 10))}
        style={{ flex: 1, accentColor: "#2563eb", cursor: "pointer", height: "4px" }} />
      <span style={{ fontSize: "11px", fontWeight: 700, color: "#374151", minWidth: "38px", textAlign: "right" }}>
        {(sc[k] === 0 && zeroLabel) ? zeroLabel : `${sc[k]}${unit}`}
      </span>
    </>
  );

  const Swatch = ({ k }) => (
    <>
      <input type="color" value={sc[k] || "#ffffff"} onChange={e => upd(k, e.target.value)}
        style={{ width: "30px", height: "26px", borderRadius: "6px", border: "1.5px solid #e2e8f0", cursor: "pointer", padding: "1px 2px", flexShrink: 0 }} />
      <input type="text" value={sc[k]} onChange={e => upd(k, e.target.value)} placeholder="none"
        style={{ flex: 1, fontSize: "11.5px", padding: "4px 8px", border: "1.5px solid #e2e8f0", borderRadius: "6px", color: "#374151", outline: "none", background: "#fff" }} />
      {sc[k] && <button type="button" onClick={() => upd(k, "")} style={{ fontSize: "11px", color: "#94a3b8", background: "none", border: "none", cursor: "pointer", padding: "0 2px", lineHeight: 1 }}>✕</button>}
    </>
  );

  const Toggle = ({ k }) => (
    <button type="button" onClick={() => upd(k, !sc[k])}
      style={{ width: "38px", height: "22px", borderRadius: "11px", background: sc[k] ? "#2563eb" : "#e2e8f0", border: "none", cursor: "pointer", position: "relative", transition: "background 0.18s", flexShrink: 0 }}>
      <span style={{ position: "absolute", top: "2px", left: sc[k] ? "18px" : "2px", width: "18px", height: "18px", borderRadius: "50%", background: "#fff", transition: "left 0.18s", boxShadow: "0 1px 3px rgba(0,0,0,0.25)", display: "block" }} />
    </button>
  );

  const Sel = ({ k, opts }) => (
    <select value={sc[k]} onChange={e => upd(k, e.target.value)}
      style={{ flex: 1, fontSize: "11.5px", padding: "5px 8px", border: "1.5px solid #e2e8f0", borderRadius: "6px", color: "#374151", background: "#fff", cursor: "pointer", outline: "none" }}>
      {opts.map(o => <option key={o.v} value={o.v}>{o.l}</option>)}
    </select>
  );

  const Chips = ({ k, opts }) => (
    <div style={{ display: "flex", gap: "5px", flexWrap: "wrap" }}>
      {opts.map(o => (
        <button key={o.v} type="button" onClick={() => upd(k, o.v)}
          style={{ padding: "4px 10px", borderRadius: "6px", border: `1.5px solid ${sc[k] === o.v ? "#2563eb" : "#e2e8f0"}`, background: sc[k] === o.v ? "#eff6ff" : "#fff", color: sc[k] === o.v ? "#2563eb" : "#64748b", fontSize: "11.5px", fontWeight: sc[k] === o.v ? 700 : 500, cursor: "pointer", transition: "all 0.1s" }}>
          {o.l}
        </button>
      ))}
    </div>
  );

  const hasCustomStyles = Object.keys(styleConfig || {}).length > 0;

  return (
    <div style={{ borderTop: "1px solid #dbeafe", background: "linear-gradient(to bottom, #eff6ff 0%, #f8fafc 100%)", padding: "16px 15px 20px" }}>

      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "16px" }}>
        <div>
          <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#1d4ed8" }}>Block Style</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Changes save automatically</div>
        </div>
        {hasCustomStyles && (
          <button type="button" onClick={() => onUpdate({})}
            style={{ fontSize: "11px", color: "#64748b", background: "#fff", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", cursor: "pointer" }}>
            Reset
          </button>
        )}
      </div>

      {/* ── SPACING ── */}
      <SH label="Spacing" first />
      <Row label="Top padding"><Slider k="padding_top" min={0} max={80} step={4} /></Row>
      <Row label="Bottom padding"><Slider k="padding_bottom" min={0} max={80} step={4} /></Row>
      <Row label="Side padding"><Slider k="padding_x" min={0} max={60} step={4} /></Row>
      <Row label="Full width"><Toggle k="full_width" /><span style={{ fontSize: "11px", color: "#94a3b8" }}>Stretch edge-to-edge</span></Row>

      {/* ── TYPOGRAPHY ── */}
      {showTypo && (
        <>
          <SH label="Typography" />
          <Row label="Font family">
            <Sel k="font_family" opts={[
              { v: "",           l: "Default (store font)" },
              { v: "sans-serif", l: "Sans-serif" },
              { v: "serif",      l: "Serif" },
              { v: "monospace",  l: "Monospace" },
            ]} />
          </Row>
          <Row label="Font size"><Slider k="font_size" min={0} max={64} step={1} zeroLabel="auto" /></Row>
          <Row label="Font weight">
            <Sel k="font_weight" opts={[
              { v: "",    l: "Default" },
              { v: "300", l: "Light (300)" },
              { v: "400", l: "Regular (400)" },
              { v: "500", l: "Medium (500)" },
              { v: "600", l: "Semi-bold (600)" },
              { v: "700", l: "Bold (700)" },
              { v: "800", l: "Extra bold (800)" },
            ]} />
          </Row>
          <Row label="Line height"><Slider k="line_height" min={0} max={3} step={0.1} unit="" zeroLabel="auto" /></Row>
          <Row label="Letter spacing"><Slider k="letter_spacing" min={-2} max={8} step={0.5} /></Row>
          <Row label="Text colour"><Swatch k="text_color" /></Row>
        </>
      )}

      {/* ── APPEARANCE ── */}
      <SH label="Appearance" />
      <Row label="Background"><Swatch k="bg_color" /></Row>
      <Row label="Corner radius"><Slider k="border_radius" min={0} max={32} step={2} /></Row>

      {/* ── VISIBILITY ── */}
      <SH label="Visibility" />
      <Row label="Show on">
        <Chips k="visibility" opts={[{ v: "all", l: "All" }, { v: "desktop", l: "Desktop only" }, { v: "mobile", l: "Mobile only" }]} />
      </Row>
      <Row label="Status">
        <Chips k="condition" opts={[{ v: "always", l: "Live" }, { v: "draft", l: "Draft (hidden)" }]} />
      </Row>
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   LAYOUT PICKER  (SVG column previews)
───────────────────────────────────────────────────────── */
const LayoutPicker = ({ value, onChange }) => {
  const opts = [
    { value: "1col", cols: [1], label: "Full" },
    { value: "2col", cols: [1, 1], label: "2 col" },
    { value: "3col", cols: [1, 1, 1], label: "3 col" },
    { value: "2-1",  cols: [2, 1], label: "L · S" },
    { value: "1-2",  cols: [1, 2], label: "S · L" },
  ];
  return (
    <div style={{ display: "flex", gap: "7px", flexWrap: "wrap", marginBottom: "16px" }}>
      {opts.map(opt => {
        const total = opt.cols.reduce((s, c) => s + c, 0);
        const sel = value === opt.value;
        return (
          <button key={opt.value} type="button" onClick={() => onChange(opt.value)}
            style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "5px", padding: "8px 10px", borderRadius: "10px", border: `2px solid ${sel ? "#2563eb" : "#e2e8f0"}`, background: sel ? "#eff6ff" : "#fafafa", cursor: "pointer", transition: "all 0.12s" }}
            onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.background = "#f0f9ff"; } }}
            onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fafafa"; } }}
          >
            <svg width="44" height="24" style={{ display: "block" }}>
              {opt.cols.map((span, i) => {
                const GAP = 3, av = 44 - GAP * (opt.cols.length - 1);
                let x = 0;
                for (let j = 0; j < i; j++) x += Math.round((opt.cols[j] / total) * av) + GAP;
                return <rect key={i} x={x} y={0} width={Math.round((span / total) * av)} height={24} rx={3} fill={sel ? "#2563eb" : "#cbd5e1"} />;
              })}
            </svg>
            <span style={{ fontSize: "10px", fontWeight: sel ? 700 : 500, color: sel ? "#2563eb" : "#64748b", whiteSpace: "nowrap" }}>{opt.label}</span>
          </button>
        );
      })}
    </div>
  );
};

/* ─────────────────────────────────────────────────────────
   BLOCK ADD FORM
───────────────────────────────────────────────────────── */
const BlockAddForm = ({ blockType, draft, setDraft, imgRef, onSave, onCancel, blockSaving, shopCategories, onImageAdd }) => {
  const meta = BLOCK_TYPE_META[blockType] || BLOCK_TYPE_META.text;
  return (
    <div style={{ background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "14px", padding: "20px", marginTop: "14px", boxShadow: "0 4px 20px rgba(0,0,0,0.07)" }}>
      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "18px", paddingBottom: "14px", borderBottom: "1px solid #f1f5f9" }}>
        <div style={{ width: "34px", height: "34px", borderRadius: "9px", background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", color: meta.accent, flexShrink: 0 }}>
          {meta.icon}
        </div>
        <div>
          <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a" }}>New {meta.label}</div>
          <div style={{ fontSize: "11.5px", color: "#94a3b8" }}>{meta.desc}</div>
        </div>
      </div>

      {/* ── text ── */}
      {blockType === "text" && (
        <>
          <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Title <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
          <input className="sd-input-line" value={draft.text_title}
            onChange={e => setDraft(s => ({ ...s, text_title: e.target.value }))}
            placeholder="e.g. Our Story" style={{ marginBottom: "16px" }} />
          <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Content <span style={{ color: "#ef4444" }}>*</span></label>
          <textarea className="sd-input" rows={4} value={draft.text_content}
            onChange={e => setDraft(s => ({ ...s, text_content: e.target.value }))}
            placeholder="Write something about your store, products, values…"
            style={{ resize: "vertical" }} />
        </>
      )}

      {/* ── image_grid ── */}
      {blockType === "image_grid" && (
        <>
          <label className="sd-label" style={{ display: "block", marginBottom: "10px" }}>Grid Layout</label>
          <LayoutPicker value={draft.layout} onChange={v => setDraft(s => ({ ...s, layout: v }))} />
          <label className="sd-label" style={{ display: "block", marginBottom: "8px" }}>
            Images <span style={{ fontWeight: 400, color: "#94a3b8" }}>— link to a category to make them clickable</span>
          </label>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "8px", marginBottom: "10px" }}>
            {draft.images.map((slot, idx) => (
              <div key={idx} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                <img src={slot.url} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                <button type="button" onClick={() => setDraft(s => ({ ...s, images: s.images.filter((_, i) => i !== idx) }))}
                  style={{ position: "absolute", top: "4px", right: "4px", background: "rgba(0,0,0,0.6)", color: "#fff", border: "none", borderRadius: "50%", width: "20px", height: "20px", cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                <div style={{ padding: "5px 6px" }}>
                  <select value={slot.linked_category}
                    onChange={e => setDraft(s => { const imgs = [...s.images]; imgs[idx] = { ...imgs[idx], linked_category: e.target.value }; return { ...s, images: imgs }; })}
                    style={{ width: "100%", padding: "3px 5px", fontSize: "10px", border: "1px solid #e2e8f0", borderRadius: "5px", background: "#fff" }}>
                    <option value="">No link</option>
                    {(shopCategories || []).map(cat => <option key={cat} value={cat}>{cat}</option>)}
                  </select>
                </div>
              </div>
            ))}
            <div onClick={() => imgRef.current.click()}
              style={{ aspectRatio: "16/9", border: "2px dashed #cbd5e1", borderRadius: "8px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", gap: "3px", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#2563eb"; e.currentTarget.style.color = "#2563eb"; e.currentTarget.style.background = "#f0f9ff"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span style={{ fontSize: "10px", fontWeight: 600 }}>Add image</span>
            </div>
          </div>
        </>
      )}

      {/* ── banner ── */}
      {blockType === "banner" && (
        <>
          <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Headline <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional overlay text)</span></label>
          <input className="sd-input-line" value={draft.text_title}
            onChange={e => setDraft(s => ({ ...s, text_title: e.target.value }))}
            placeholder="e.g. New Collection — Shop Now" style={{ marginBottom: "12px" }} />
          <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Subheadline <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
          <input className="sd-input-line" value={draft.text_content}
            onChange={e => setDraft(s => ({ ...s, text_content: e.target.value }))}
            placeholder="e.g. Free shipping on orders over ₦10,000" style={{ marginBottom: "16px" }} />
          <label className="sd-label" style={{ display: "block", marginBottom: "8px" }}>Banner Image <span style={{ color: "#ef4444" }}>*</span></label>
          {draft.images[0] ? (
            <div style={{ position: "relative", borderRadius: "10px", overflow: "hidden", border: "1px solid #e2e8f0", marginBottom: "8px" }}>
              <img src={draft.images[0].url} alt="" style={{ width: "100%", aspectRatio: "3/1", objectFit: "cover", display: "block" }} />
              <button type="button" onClick={() => setDraft(s => ({ ...s, images: [] }))}
                style={{ position: "absolute", top: "8px", right: "8px", background: "rgba(0,0,0,0.65)", color: "#fff", border: "none", borderRadius: "50%", width: "24px", height: "24px", cursor: "pointer", fontSize: "11px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
            </div>
          ) : (
            <div onClick={() => imgRef.current.click()}
              style={{ aspectRatio: "3/1", border: "2px dashed #cbd5e1", borderRadius: "10px", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", gap: "4px", transition: "all 0.15s", marginBottom: "8px" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#db2777"; e.currentTarget.style.color = "#db2777"; e.currentTarget.style.background = "#fdf2f8"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#cbd5e1"; e.currentTarget.style.color = "#94a3b8"; e.currentTarget.style.background = "transparent"; }}
            >
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              <span style={{ fontSize: "11px", fontWeight: 600 }}>Upload banner image</span>
              <span style={{ fontSize: "10px", color: "#cbd5e1" }}>Recommended: wide/landscape (3:1)</span>
            </div>
          )}
        </>
      )}

      {/* ── announcement ── */}
      {blockType === "announcement" && (
        <>
          <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Message <span style={{ color: "#ef4444" }}>*</span></label>
          <input className="sd-input-line" value={draft.text_content}
            onChange={e => setDraft(s => ({ ...s, text_content: e.target.value }))}
            placeholder="e.g. 🎉 50% OFF everything this weekend only!" style={{ marginBottom: "16px" }} />
          <label className="sd-label" style={{ display: "block", marginBottom: "10px" }}>Colour Style</label>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {[
              { value: "promo",   label: "Promo",   bg: "linear-gradient(90deg,#7c3aed,#db2777)", color: "#fff" },
              { value: "sale",    label: "Sale",    bg: "#fee2e2", color: "#b91c1c" },
              { value: "info",    label: "Info",    bg: "#eff6ff", color: "#1d4ed8" },
              { value: "neutral", label: "Neutral", bg: "#f1f5f9", color: "#475569" },
            ].map(opt => {
              const sel = (draft.layout || "promo") === opt.value;
              return (
                <button key={opt.value} type="button" onClick={() => setDraft(s => ({ ...s, layout: opt.value }))}
                  style={{ padding: "7px 16px", borderRadius: "8px", border: `2px solid ${sel ? "#0f172a" : "transparent"}`, background: opt.bg, color: opt.color, fontWeight: 700, fontSize: "12px", cursor: "pointer", boxShadow: sel ? "0 0 0 1px #0f172a" : "none" }}>
                  {opt.label}
                </button>
              );
            })}
          </div>
          {draft.text_content && (
            <div style={{ marginTop: "14px", borderRadius: "8px", padding: "10px 16px", background: draft.layout === "sale" ? "#fee2e2" : draft.layout === "info" ? "#eff6ff" : draft.layout === "neutral" ? "#f1f5f9" : "linear-gradient(90deg,#7c3aed,#db2777)", color: draft.layout === "sale" ? "#b91c1c" : draft.layout === "info" ? "#1d4ed8" : draft.layout === "neutral" ? "#475569" : "#fff", fontSize: "13px", fontWeight: 600, textAlign: "center" }}>
              {draft.text_content}
            </div>
          )}
        </>
      )}

      {/* ── video ── */}
      {blockType === "video" && (
        <>
          <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Video URL <span style={{ color: "#ef4444" }}>*</span></label>
          <input className="sd-input-line" value={draft.text_content}
            onChange={e => setDraft(s => ({ ...s, text_content: e.target.value }))}
            placeholder="https://youtube.com/watch?v=..." style={{ marginBottom: "12px" }} />
          <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Caption <span style={{ fontWeight: 400, color: "#94a3b8" }}>(optional)</span></label>
          <input className="sd-input-line" value={draft.text_title}
            onChange={e => setDraft(s => ({ ...s, text_title: e.target.value }))}
            placeholder="e.g. Watch how we make our products" />
        </>
      )}

      {/* ── divider ── */}
      {blockType === "divider" && (
        <>
          <label className="sd-label" style={{ display: "block", marginBottom: "10px" }}>Style</label>
          <div style={{ display: "flex", gap: "8px" }}>
            {[
              { value: "line",  label: "Line",   preview: <div style={{ height: "2px", background: "#e2e8f0", width: "60px", borderRadius: "1px" }} /> },
              { value: "dots",  label: "Dots",   preview: <div style={{ display: "flex", gap: "4px" }}>{[0,1,2,3,4].map(i => <div key={i} style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#e2e8f0" }} />)}</div> },
              { value: "space", label: "Spacer", preview: <div style={{ height: "20px", width: "60px", background: "#f8fafc", borderRadius: "4px", border: "1.5px dashed #e2e8f0" }} /> },
            ].map(opt => {
              const sel = (draft.layout || "line") === opt.value;
              return (
                <button key={opt.value} type="button" onClick={() => setDraft(s => ({ ...s, layout: opt.value }))}
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", padding: "12px 16px", borderRadius: "10px", border: `2px solid ${sel ? "#64748b" : "#e2e8f0"}`, background: sel ? "#f8fafc" : "#fff", cursor: "pointer" }}>
                  {opt.preview}
                  <span style={{ fontSize: "11px", fontWeight: sel ? 700 : 500, color: sel ? "#475569" : "#94a3b8" }}>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </>
      )}

      {/* hidden file input for image_grid + banner */}
      {(blockType === "image_grid" || blockType === "banner") && (
        <input ref={imgRef} type="file" accept="image/*" multiple style={{ display: "none" }}
          onChange={e => onImageAdd(e, setDraft)} />
      )}

      <div style={{ display: "flex", gap: "10px", marginTop: "20px", paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
        <button type="button" onClick={onSave} disabled={blockSaving}
          style={{ flex: 1, padding: "10px 18px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "9px", fontWeight: 700, fontSize: "13px", cursor: blockSaving ? "not-allowed" : "pointer", opacity: blockSaving ? 0.7 : 1, transition: "background 0.15s" }}
          onMouseEnter={e => { if (!blockSaving) e.currentTarget.style.background = "#1e293b"; }}
          onMouseLeave={e => { e.currentTarget.style.background = "#0f172a"; }}
        >
          {blockSaving ? "Saving…" : `Add ${meta.label}`}
        </button>
        <button type="button" onClick={onCancel}
          style={{ padding: "10px 16px", background: "#fff", color: "#64748b", border: "1.5px solid #e2e8f0", borderRadius: "9px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
          Cancel
        </button>
      </div>
    </div>
  );
};

/* ═══════════════════════════════════════════════════════════
   SELLER STORE BUILDER  — main page component
═══════════════════════════════════════════════════════════ */
const SellerStoreBuilder = () => {
  const { shop, refreshShop, setPageTitle, setTopbarActions } = useSellerCtx();

  const shopCategories = shop?.categories || [];

  // ── Store Blocks state ──
  const [storeBlocks,       setStoreBlocks]       = useState([]);
  const [catPages,          setCatPages]           = useState([]);
  const [blockSaving,       setBlockSaving]        = useState(false);
  const [addingBlock,       setAddingBlock]        = useState(null);
  const [expandedCat,       setExpandedCat]        = useState(null);
  const [addingCatBlock,    setAddingCatBlock]     = useState(null);
  const [configuringBlockId, setConfiguringBlockId] = useState(null);
  const [newBlock,    setNewBlock]    = useState({ text_title: "", text_content: "", layout: "2col", images: [] });
  const [newCatBlock, setNewCatBlock] = useState({ text_title: "", text_content: "", layout: "2col", images: [] });
  const blockImgRef    = useRef();
  const catBlockImgRef = useRef();

  // ── Page title + topbar ──
  useEffect(() => {
    setPageTitle("Store Builder");
    setTopbarActions(
      shop
        ? <Link to={`/shop/${shop.slug}`} target="_blank" className="sd-btn-primary">
            <IconExternal /> Preview Store
          </Link>
        : null
    );
    return () => setTopbarActions(null);
  }, [shop]);

  // ── Load blocks + category pages ──
  useEffect(() => {
    if (!shop) return;
    Promise.all([
      axios.get(`${BASE}/api/shops/${shop.slug}/store-blocks/`, ac()),
      axios.get(`${BASE}/api/shops/${shop.slug}/category-pages/`, ac()),
    ]).then(([blocksRes, pagesRes]) => {
      const raw = blocksRes.data;
      let seenProducts = false;
      const deduped = raw.filter(b => {
        if (b.block_type === "products") {
          if (seenProducts) return false;
          seenProducts = true;
        }
        return true;
      });
      setCatPages(pagesRes.data);
      if (deduped.length === 0) {
        axios.post(`${BASE}/api/shops/${shop.slug}/store-blocks/`, { block_type: "products", order: 0 }, ac())
          .then(r => setStoreBlocks([r.data]))
          .catch(() => setStoreBlocks([]));
      } else {
        setStoreBlocks(deduped);
      }
    }).catch(() => {});
  }, [shop]);

  // ── Block handlers ──
  const reorderBlocks = async (newOrder) => {
    setStoreBlocks(newOrder);
    try {
      const res = await axios.post(`${BASE}/api/shops/${shop.slug}/store-blocks/reorder/`,
        { order: newOrder.map(b => b.id) }, ac());
      setStoreBlocks(res.data);
    } catch { toast.error("Could not reorder."); }
  };

  const moveBlock = (idx, dir) => {
    const arr = [...storeBlocks];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    reorderBlocks(arr);
  };

  const deleteBlock = async (blockId) => {
    try {
      await axios.delete(`${BASE}/api/shops/${shop.slug}/store-blocks/${blockId}/`, ac());
      setStoreBlocks(prev => prev.filter(b => b.id !== blockId));
    } catch { toast.error("Could not remove block."); }
  };

  const patchBlockLayout = async (blockId, layout) => {
    setStoreBlocks(prev => prev.map(b => b.id === blockId ? { ...b, layout } : b));
    try {
      const r = await axios.patch(`${BASE}/api/shops/${shop.slug}/store-blocks/${blockId}/`, { layout }, ac());
      setStoreBlocks(prev => prev.map(b => b.id === blockId ? r.data : b));
    } catch { toast.error("Could not save layout."); }
  };

  const buildBlockImages = (draft) => {
    const fd = new FormData();
    draft.images.forEach(s => fd.append("images", s.file));
    draft.images.forEach(s => fd.append("linked_categories", s.linked_category || ""));
    return fd;
  };

  const serializeBlock = (type, draft, order, fd) => {
    fd.append("block_type", type);
    fd.append("order", order);
    if (type === "text")         { fd.append("text_title", draft.text_title || ""); fd.append("text_content", draft.text_content || ""); }
    else if (type === "image_grid")   { fd.append("layout", draft.layout || "2col"); }
    else if (type === "banner")       { fd.append("text_title", draft.text_title || ""); fd.append("text_content", draft.text_content || ""); }
    else if (type === "announcement") { fd.append("text_content", draft.text_content || ""); fd.append("layout", draft.layout || "promo"); }
    else if (type === "video")        { fd.append("text_content", draft.text_content || ""); fd.append("text_title", draft.text_title || ""); }
    else if (type === "divider")      { fd.append("layout", draft.layout || "line"); }
  };

  const handleAddBlock = async () => {
    if (addingBlock === "image_grid"   && !newBlock.images.length)        { toast.error("Upload at least one image."); return; }
    if (addingBlock === "banner"       && !newBlock.images.length)        { toast.error("Upload a banner image."); return; }
    if (addingBlock === "announcement" && !newBlock.text_content.trim())  { toast.error("Enter an announcement message."); return; }
    if (addingBlock === "video"        && !newBlock.text_content.trim())  { toast.error("Enter a video URL."); return; }
    setBlockSaving(true);
    try {
      const fd = buildBlockImages(newBlock);
      serializeBlock(addingBlock, newBlock, storeBlocks.length, fd);
      const r = await axios.post(`${BASE}/api/shops/${shop.slug}/store-blocks/`, fd, ac());
      setStoreBlocks(prev => [...prev, r.data]);
      setNewBlock({ text_title: "", text_content: "", layout: "2col", images: [] });
      setAddingBlock(null);
      toast.success("Block added.");
    } catch { toast.error("Could not save block."); }
    finally { setBlockSaving(false); }
  };

  // ── Category page handlers ──
  const getOrCreateCatPage = async (catName) => {
    const existing = catPages.find(p => p.category_name === catName);
    if (existing) return existing;
    const r = await axios.post(`${BASE}/api/shops/${shop.slug}/category-pages/`, { category_name: catName }, ac());
    setCatPages(prev => [...prev, r.data]);
    return r.data;
  };

  const handleAddCatBlock = async (catName) => {
    if (addingCatBlock === "image_grid"   && !newCatBlock.images.length)       { toast.error("Upload at least one image."); return; }
    if (addingCatBlock === "banner"       && !newCatBlock.images.length)       { toast.error("Upload a banner image."); return; }
    if (addingCatBlock === "announcement" && !newCatBlock.text_content.trim()) { toast.error("Enter an announcement message."); return; }
    if (addingCatBlock === "video"        && !newCatBlock.text_content.trim()) { toast.error("Enter a video URL."); return; }
    setBlockSaving(true);
    try {
      const page = await getOrCreateCatPage(catName);
      const fd = buildBlockImages(newCatBlock);
      serializeBlock(addingCatBlock, newCatBlock, (page.blocks || []).length, fd);
      const r = await axios.post(`${BASE}/api/shops/${shop.slug}/category-pages/${page.id}/blocks/`, fd, ac());
      setCatPages(prev => prev.map(p => p.id === page.id ? { ...p, blocks: [...p.blocks, r.data] } : p));
      setNewCatBlock({ text_title: "", text_content: "", layout: "2col", images: [] });
      setAddingCatBlock(null);
      toast.success("Block added.");
    } catch { toast.error("Could not save block."); }
    finally { setBlockSaving(false); }
  };

  const deleteCatBlock = async (pageId, blockId) => {
    try {
      await axios.delete(`${BASE}/api/shops/${shop.slug}/category-pages/${pageId}/blocks/${blockId}/`, ac());
      setCatPages(prev => prev.map(p => p.id === pageId ? { ...p, blocks: p.blocks.filter(b => b.id !== blockId) } : p));
    } catch { toast.error("Could not remove block."); }
  };

  const reorderCatBlocks = async (pageId, newOrder) => {
    setCatPages(prev => prev.map(p => p.id === pageId ? { ...p, blocks: newOrder } : p));
    try {
      await axios.post(`${BASE}/api/shops/${shop.slug}/category-pages/${pageId}/blocks/reorder/`,
        { order: newOrder.map(b => b.id) }, ac());
    } catch { toast.error("Could not reorder."); }
  };

  const moveCatBlock = (pageId, idx, dir) => {
    const page = catPages.find(p => p.id === pageId);
    if (!page) return;
    const arr = [...page.blocks];
    const swapIdx = idx + dir;
    if (swapIdx < 0 || swapIdx >= arr.length) return;
    [arr[idx], arr[swapIdx]] = [arr[swapIdx], arr[idx]];
    reorderCatBlocks(pageId, arr);
  };

  const handleBlockImageAdd = (e, setter) => {
    const files = Array.from(e.target.files);
    const slots = files.map(f => ({ file: f, url: URL.createObjectURL(f), linked_category: "" }));
    setter(s => ({ ...s, images: [...s.images, ...slots] }));
  };

  // ── No shop yet ──
  if (!shop) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <div style={{ fontSize: "14px", color: "#94a3b8" }}>Create your store in Store Settings first.</div>
    </div>
  );

  const ADDABLE_TYPES = ["text", "image_grid", "banner", "announcement", "video", "divider"];

  /* ── helper: block card ── */
  const BlockCard = ({ block, idx, total, onMoveUp, onMoveDown, onDelete, configPanel }) => {
    const meta = BLOCK_TYPE_META[block.block_type] || BLOCK_TYPE_META.text;
    const isFirst = idx === 0, isLast = idx === total - 1;
    const isConfiguring = configuringBlockId === block.id;
    return (
      <div style={{ border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "8px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.05)", overflow: "hidden", transition: "box-shadow 0.15s" }}
        onMouseEnter={e => { e.currentTarget.style.boxShadow = "0 4px 14px rgba(0,0,0,0.09)"; }}
        onMouseLeave={e => { e.currentTarget.style.boxShadow = "0 1px 3px rgba(0,0,0,0.05)"; }}
      >
        <div style={{ display: "flex", alignItems: "stretch" }}>
          <div style={{ width: "4px", background: meta.accent, flexShrink: 0 }} />
          <div style={{ flex: 1, padding: "13px 15px", display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
            <div style={{ width: "38px", height: "38px", borderRadius: "10px", background: meta.bg, display: "flex", alignItems: "center", justifyContent: "center", color: meta.accent, flexShrink: 0 }}>
              {meta.icon}
            </div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div style={{ fontSize: "13.5px", fontWeight: 700, color: "#0f172a", marginBottom: "2px" }}>{meta.label}</div>
              <div style={{ fontSize: "12px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {block.block_type === "text"         && (block.text_title || block.text_content?.slice(0, 45) || meta.desc)}
                {block.block_type === "image_grid"   && (block.images?.length ? `${block.images.length} image${block.images.length !== 1 ? "s" : ""} · ${block.layout}` : meta.desc)}
                {block.block_type === "products"     && (block.layout ? `${block.layout === "1col" ? "1 column" : block.layout === "2col" ? "2 columns" : block.layout === "3col" ? "3 columns" : "auto"} grid` : "Auto grid")}
                {block.block_type === "announcement" && (block.text_content?.slice(0, 45) || meta.desc)}
                {block.block_type === "banner"       && (block.text_title || meta.desc)}
                {block.block_type === "video"        && (block.text_content?.slice(0, 45) || meta.desc)}
                {block.block_type === "divider"      && (block.layout || "line")}
              </div>
            </div>
            {block.block_type === "image_grid" && block.images?.length > 0 && (
              <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                {block.images.slice(0, 3).map(img => (
                  <img key={img.id} src={img.image_url} alt="" style={{ width: "40px", height: "28px", objectFit: "cover", borderRadius: "5px", border: "1px solid #e2e8f0" }} />
                ))}
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
              {block.block_type === "products" && (
                <button type="button" title="Configure grid"
                  onClick={() => setConfiguringBlockId(isConfiguring ? null : block.id)}
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "7px", border: `1.5px solid ${isConfiguring ? "#2563eb" : "#e2e8f0"}`, background: isConfiguring ? "#eff6ff" : "#fff", cursor: "pointer", color: isConfiguring ? "#2563eb" : "#64748b", transition: "all 0.12s" }}>
                  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06-.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>
                </button>
              )}
              <button type="button" onClick={onMoveUp} disabled={isFirst} title="Move up"
                style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "7px", border: "1.5px solid #e2e8f0", background: isFirst ? "#f8fafc" : "#fff", cursor: isFirst ? "default" : "pointer", color: isFirst ? "#d1d5db" : "#374151", transition: "all 0.12s" }}
                onMouseEnter={e => { if (!isFirst) { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0f172a"; } }}
                onMouseLeave={e => { e.currentTarget.style.background = isFirst ? "#f8fafc" : "#fff"; e.currentTarget.style.color = isFirst ? "#d1d5db" : "#374151"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
              </button>
              <button type="button" onClick={onMoveDown} disabled={isLast} title="Move down"
                style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "7px", border: "1.5px solid #e2e8f0", background: isLast ? "#f8fafc" : "#fff", cursor: isLast ? "default" : "pointer", color: isLast ? "#d1d5db" : "#374151", transition: "all 0.12s" }}
                onMouseEnter={e => { if (!isLast) { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0f172a"; } }}
                onMouseLeave={e => { e.currentTarget.style.background = isLast ? "#f8fafc" : "#fff"; e.currentTarget.style.color = isLast ? "#d1d5db" : "#374151"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
              </button>
              {block.block_type !== "products" && (
                <button type="button" onClick={onDelete} title="Remove"
                  style={{ width: "28px", height: "28px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "7px", border: "1.5px solid #fecaca", background: "#fff5f5", cursor: "pointer", color: "#ef4444", marginLeft: "4px", transition: "all 0.12s" }}
                  onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#ef4444"; }}
                  onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fecaca"; }}>
                  <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                </button>
              )}
            </div>
          </div>
        </div>
        {/* Inline grid config for products block */}
        {block.block_type === "products" && isConfiguring && (
          <div style={{ borderTop: "1px solid #f1f5f9", padding: "14px 15px 14px 19px", background: "#fafcff" }}>
            <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.06em" }}>Product Grid Columns</p>
            <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
              {[
                { value: null,    label: "Auto",  hint: "Fills to width" },
                { value: "1col",  label: "1 col", hint: "Full-width list" },
                { value: "2col",  label: "2 col", hint: "Side by side" },
                { value: "3col",  label: "3 col", hint: "Compact grid" },
              ].map(opt => {
                const sel = (block.layout || null) === opt.value;
                return (
                  <button key={String(opt.value)} type="button"
                    onClick={() => patchBlockLayout(block.id, opt.value)}
                    style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "4px", padding: "8px 14px", borderRadius: "9px", border: `2px solid ${sel ? "#2563eb" : "#e2e8f0"}`, background: sel ? "#eff6ff" : "#fff", cursor: "pointer", transition: "all 0.12s" }}
                    onMouseEnter={e => { if (!sel) { e.currentTarget.style.borderColor = "#93c5fd"; e.currentTarget.style.background = "#f0f9ff"; } }}
                    onMouseLeave={e => { if (!sel) { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; } }}
                  >
                    <span style={{ fontSize: "12.5px", fontWeight: sel ? 700 : 600, color: sel ? "#2563eb" : "#374151" }}>{opt.label}</span>
                    <span style={{ fontSize: "10px", color: sel ? "#3b82f6" : "#94a3b8" }}>{opt.hint}</span>
                  </button>
                );
              })}
            </div>
          </div>
        )}
        {configPanel}
      </div>
    );
  };

  return (
    <div>
      <ToastContainer position="bottom-center" />

      {/* ── Page header ── */}
      <div style={{ marginBottom: "28px" }}>
        <h2 style={{ fontWeight: 800, fontSize: "20px", color: "#0f172a", margin: "0 0 6px" }}>Store Builder</h2>
        <p style={{ margin: 0, fontSize: "13.5px", color: "#64748b", lineHeight: 1.6 }}>
          Design exactly how your storefront looks. Add sections, drag them into position, and customise each category page independently.
        </p>
      </div>

      {/* ══════════════════════════
          STORE LAYOUT SECTIONS
      ══════════════════════════ */}
      <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px", marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
          <div>
            <p style={{ margin: "0 0 3px", fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Store Sections</p>
            <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>Move sections up or down to reorder how they appear on your store.</p>
          </div>
          <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", flexShrink: 0 }}>
            {storeBlocks.length} section{storeBlocks.length !== 1 ? "s" : ""}
          </span>
        </div>

        {storeBlocks.map((block, idx) => (
          <BlockCard key={block.id} block={block} idx={idx} total={storeBlocks.length}
            onMoveUp={() => moveBlock(idx, -1)}
            onMoveDown={() => moveBlock(idx, 1)}
            onDelete={() => deleteBlock(block.id)}
          />
        ))}

        {/* Add section picker */}
        {!addingBlock ? (
          <div style={{ marginTop: "16px" }}>
            <p style={{ margin: "0 0 10px", fontSize: "11px", fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.07em" }}>Add a section</p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {ADDABLE_TYPES.map(type => {
                const m = BLOCK_TYPE_META[type];
                return (
                  <button key={type} type="button"
                    onClick={() => { setAddingBlock(type); setNewBlock({ text_title: "", text_content: "", layout: type === "announcement" ? "promo" : type === "divider" ? "line" : "2col", images: [] }); }}
                    style={{ padding: "12px 14px", borderRadius: "11px", border: "2px dashed #e2e8f0", background: "#fff", display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                    onMouseEnter={e => { e.currentTarget.style.borderColor = m.accent; e.currentTarget.style.background = m.bg; e.currentTarget.style.borderStyle = "solid"; }}
                    onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderStyle = "dashed"; }}
                  >
                    <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: m.bg, display: "flex", alignItems: "center", justifyContent: "center", color: m.accent, flexShrink: 0 }}>{m.icon}</div>
                    <div>
                      <div style={{ fontSize: "12px", fontWeight: 700, color: "#0f172a" }}>{m.label}</div>
                      <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "1px" }}>{m.desc}</div>
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        ) : (
          <BlockAddForm blockType={addingBlock} draft={newBlock} setDraft={setNewBlock} imgRef={blockImgRef}
            onSave={handleAddBlock}
            onCancel={() => { setAddingBlock(null); setNewBlock({ text_title: "", text_content: "", layout: "2col", images: [] }); }}
            blockSaving={blockSaving} shopCategories={shopCategories} onImageAdd={handleBlockImageAdd}
          />
        )}
        <input ref={blockImgRef} type="file" accept="image/*" multiple style={{ display: "none" }}
          onChange={e => handleBlockImageAdd(e, setNewBlock)} />
      </div>

      {/* ══════════════════════════
          CATEGORY PAGES
      ══════════════════════════ */}
      {shop.layout_mode === "categories" && (
        <div style={{ background: "#fff", borderRadius: "16px", border: "1px solid #e2e8f0", padding: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "20px" }}>
            <div>
              <p style={{ margin: "0 0 3px", fontSize: "14px", fontWeight: 700, color: "#0f172a" }}>Category Pages</p>
              <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>Customise what buyers see when they tap a category tab.</p>
            </div>
            <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", background: "#f1f5f9", border: "1px solid #e2e8f0", borderRadius: "6px", padding: "4px 10px", flexShrink: 0 }}>
              {shopCategories.length} categor{shopCategories.length !== 1 ? "ies" : "y"}
            </span>
          </div>

          {shopCategories.length === 0 && (
            <div style={{ textAlign: "center", padding: "24px", background: "#f8fafc", borderRadius: "12px", color: "#94a3b8", fontSize: "13px", border: "1.5px dashed #e2e8f0" }}>
              Add products first — categories appear here once your shop has products.
            </div>
          )}

          {shopCategories.map(catName => {
            const page = catPages.find(p => p.category_name === catName);
            const isOpen = expandedCat === catName;
            return (
              <div key={catName} style={{ border: "1px solid #e2e8f0", borderRadius: "12px", marginBottom: "8px", overflow: "hidden", boxShadow: "0 1px 3px rgba(0,0,0,0.04)" }}>
                <button type="button" onClick={() => setExpandedCat(isOpen ? null : catName)}
                  style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "13px 18px", background: isOpen ? "#eff6ff" : "#fff", border: "none", cursor: "pointer", transition: "background 0.12s" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: isOpen ? "#2563eb" : "#cbd5e1", transition: "background 0.12s" }} />
                    <span style={{ fontSize: "13.5px", fontWeight: 700, color: isOpen ? "#2563eb" : "#0f172a" }}>{catName}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "11.5px", color: isOpen ? "#3b82f6" : "#94a3b8", fontWeight: page?.blocks?.length ? 600 : 400 }}>
                      {page?.blocks?.length ? `${page.blocks.length} block${page.blocks.length > 1 ? "s" : ""}` : "No content yet"}
                    </span>
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke={isOpen ? "#2563eb" : "#94a3b8"} strokeWidth="2.5" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}>
                      <polyline points="6 9 12 15 18 9"/>
                    </svg>
                  </div>
                </button>

                {isOpen && (
                  <div style={{ padding: "16px 18px", borderTop: "1px solid #e2e8f0", background: "#fafcff" }}>
                    {page?.blocks?.map((block, bIdx) => {
                      const bm = BLOCK_TYPE_META[block.block_type] || BLOCK_TYPE_META.text;
                      const bFirst = bIdx === 0, bLast = bIdx === page.blocks.length - 1;
                      return (
                        <div key={block.id} style={{ display: "flex", alignItems: "stretch", border: "1px solid #e2e8f0", borderRadius: "10px", marginBottom: "8px", background: "#fff", boxShadow: "0 1px 3px rgba(0,0,0,0.04)", overflow: "hidden" }}>
                          <div style={{ width: "3px", background: bm.accent, flexShrink: 0 }} />
                          <div style={{ flex: 1, padding: "10px 13px", display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
                            <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: bm.bg, display: "flex", alignItems: "center", justifyContent: "center", color: bm.accent, flexShrink: 0 }}>{bm.icon}</div>
                            <div style={{ flex: 1, minWidth: 0 }}>
                              <div style={{ fontSize: "12.5px", fontWeight: 700, color: "#0f172a" }}>{bm.label}</div>
                              <div style={{ fontSize: "11.5px", color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                                {block.block_type === "text" ? (block.text_title || block.text_content?.slice(0, 40) || "—") : (block.images?.length ? `${block.images.length} image${block.images.length !== 1 ? "s" : ""} · ${block.layout}` : bm.desc)}
                              </div>
                            </div>
                            {block.block_type === "image_grid" && block.images?.length > 0 && (
                              <div style={{ display: "flex", gap: "3px" }}>
                                {block.images.slice(0, 2).map(img => <img key={img.id} src={img.image_url} alt="" style={{ width: "34px", height: "24px", objectFit: "cover", borderRadius: "4px" }} />)}
                              </div>
                            )}
                            <div style={{ display: "flex", alignItems: "center", gap: "4px", flexShrink: 0 }}>
                              <button type="button" onClick={() => moveCatBlock(page.id, bIdx, -1)} disabled={bFirst}
                                style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1.5px solid #e2e8f0", background: bFirst ? "#f8fafc" : "#fff", cursor: bFirst ? "default" : "pointer", color: bFirst ? "#d1d5db" : "#374151", transition: "all 0.12s" }}
                                onMouseEnter={e => { if (!bFirst) { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0f172a"; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = bFirst ? "#f8fafc" : "#fff"; e.currentTarget.style.color = bFirst ? "#d1d5db" : "#374151"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="18 15 12 9 6 15"/></svg>
                              </button>
                              <button type="button" onClick={() => moveCatBlock(page.id, bIdx, 1)} disabled={bLast}
                                style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1.5px solid #e2e8f0", background: bLast ? "#f8fafc" : "#fff", cursor: bLast ? "default" : "pointer", color: bLast ? "#d1d5db" : "#374151", transition: "all 0.12s" }}
                                onMouseEnter={e => { if (!bLast) { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#0f172a"; } }}
                                onMouseLeave={e => { e.currentTarget.style.background = bLast ? "#f8fafc" : "#fff"; e.currentTarget.style.color = bLast ? "#d1d5db" : "#374151"; e.currentTarget.style.borderColor = "#e2e8f0"; }}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="6 9 12 15 18 9"/></svg>
                              </button>
                              <button type="button" onClick={() => deleteCatBlock(page.id, block.id)}
                                style={{ width: "26px", height: "26px", display: "flex", alignItems: "center", justifyContent: "center", borderRadius: "6px", border: "1.5px solid #fecaca", background: "#fff5f5", cursor: "pointer", color: "#ef4444", marginLeft: "3px", transition: "all 0.12s" }}
                                onMouseEnter={e => { e.currentTarget.style.background = "#ef4444"; e.currentTarget.style.color = "#fff"; e.currentTarget.style.borderColor = "#ef4444"; }}
                                onMouseLeave={e => { e.currentTarget.style.background = "#fff5f5"; e.currentTarget.style.color = "#ef4444"; e.currentTarget.style.borderColor = "#fecaca"; }}>
                                <svg width="9" height="9" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
                              </button>
                            </div>
                          </div>
                        </div>
                      );
                    })}

                    {!addingCatBlock ? (
                      <div style={{ marginTop: page?.blocks?.length ? "12px" : "0" }}>
                        <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
                          {ADDABLE_TYPES.map(type => {
                            const bm = BLOCK_TYPE_META[type];
                            return (
                              <button key={type} type="button"
                                onClick={() => { setAddingCatBlock(type); setNewCatBlock({ text_title: "", text_content: "", layout: type === "announcement" ? "promo" : type === "divider" ? "line" : "2col", images: [] }); }}
                                style={{ padding: "10px 12px", borderRadius: "9px", border: "2px dashed #e2e8f0", background: "#fff", display: "flex", alignItems: "center", gap: "8px", cursor: "pointer", textAlign: "left", transition: "all 0.15s" }}
                                onMouseEnter={e => { e.currentTarget.style.borderColor = bm.accent; e.currentTarget.style.background = bm.bg; e.currentTarget.style.borderStyle = "solid"; }}
                                onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.background = "#fff"; e.currentTarget.style.borderStyle = "dashed"; }}
                              >
                                <div style={{ width: "26px", height: "26px", borderRadius: "6px", background: bm.bg, display: "flex", alignItems: "center", justifyContent: "center", color: bm.accent, flexShrink: 0 }}>{bm.icon}</div>
                                <div style={{ fontSize: "11.5px", fontWeight: 700, color: "#0f172a" }}>{bm.label}</div>
                              </button>
                            );
                          })}
                        </div>
                      </div>
                    ) : (
                      <BlockAddForm blockType={addingCatBlock} draft={newCatBlock} setDraft={setNewCatBlock} imgRef={catBlockImgRef}
                        onSave={() => handleAddCatBlock(catName)}
                        onCancel={() => { setAddingCatBlock(null); setNewCatBlock({ text_title: "", text_content: "", layout: "2col", images: [] }); }}
                        blockSaving={blockSaving} shopCategories={shopCategories} onImageAdd={handleBlockImageAdd}
                      />
                    )}
                    <input ref={catBlockImgRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                      onChange={e => handleBlockImageAdd(e, setNewCatBlock)} />
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {shop.layout_mode !== "categories" && (
        <div style={{ background: "#f8fafc", border: "1.5px dashed #e2e8f0", borderRadius: "12px", padding: "20px 24px", marginTop: "8px" }}>
          <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 600, color: "#475569" }}>Category Pages are hidden</p>
          <p style={{ margin: 0, fontSize: "12.5px", color: "#94a3b8" }}>
            Switch your store layout to <strong>By Category</strong> in Store Settings to unlock per-category page designs.
          </p>
        </div>
      )}
    </div>
  );
};

export default SellerStoreBuilder;
