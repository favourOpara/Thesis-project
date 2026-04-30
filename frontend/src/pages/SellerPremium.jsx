import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSellerCtx, ac, BASE } from "../components/SellerLayout";

const PAYSTACK_PUBLIC_KEY = "pk_test_27446758f70fd23b21f8fc39f3c5356c629443da";
const PREMIUM_AMOUNT_KOBO = 1000000; // ₦10,000

/* ── Load Paystack inline script ── */
const loadPaystack = () =>
  new Promise((resolve) => {
    if (window.PaystackPop) return resolve();
    const s = document.createElement("script");
    s.src = "https://js.paystack.co/v1/inline.js";
    s.onload = resolve;
    document.head.appendChild(s);
  });

/* ══════════════════════════════════════════
   SVG ICONS
══════════════════════════════════════════ */
const CrownIcon = ({ size = 28 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round">
    <path d="M2 20h20M4 16l2-10 6 5 6-5 2 10"/>
  </svg>
);
const VideoIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="5" width="14" height="14" rx="2"/>
    <path d="M16 10l5-3v10l-5-3V10z"/>
  </svg>
);
const TextIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <line x1="17" y1="10" x2="3" y2="10"/>
    <line x1="21" y1="6" x2="3" y2="6"/>
    <line x1="21" y1="14" x2="3" y2="14"/>
    <line x1="17" y1="18" x2="3" y2="18"/>
  </svg>
);
const BadgeIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="8" r="6"/>
    <path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/>
  </svg>
);
const TrendIcon = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/>
    <polyline points="16 7 22 7 22 13"/>
  </svg>
);
const CheckIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 6 9 17 4 12"/>
  </svg>
);
const LockIcon = () => (
  <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
    <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);
const GripIcon = () => (
  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="9" cy="12" r="1"/><circle cx="9" cy="5" r="1"/><circle cx="9" cy="19" r="1"/>
    <circle cx="15" cy="12" r="1"/><circle cx="15" cy="5" r="1"/><circle cx="15" cy="19" r="1"/>
  </svg>
);

const FEATURES = [
  { Icon: VideoIcon,  title: "Promo Video",            desc: "Embed a YouTube or Vimeo video that plays right on your storefront." },
  { Icon: TextIcon,   title: "Editorial Text Blocks",  desc: "Insert custom messages between products — tell your story or highlight a deal." },
  { Icon: BadgeIcon,  title: "Verified Premium Badge", desc: "A trust signal that sets your store apart and increases buyer confidence." },
  { Icon: TrendIcon,  title: "Boosted Visibility",     desc: "Your store is featured higher in browse and recommendation placements." },
];

/* ══════════════════════════════════════════
   UPGRADE PAGE
══════════════════════════════════════════ */
const UpgradePage = ({ onSuccess }) => {
  const { user } = useAuth();
  const [paying, setPaying] = useState(false);
  const [err, setErr] = useState("");

  const handleUpgrade = async () => {
    setErr("");
    setPaying(true);
    try {
      await loadPaystack();
      const ref = `premium_${Date.now()}_${Math.random().toString(36).slice(2)}`;
      const handler = window.PaystackPop.setup({
        key: PAYSTACK_PUBLIC_KEY,
        email: user.email,
        amount: PREMIUM_AMOUNT_KOBO,
        currency: "NGN",
        ref,
        metadata: { type: "premium_upgrade" },
        onSuccess: async (transaction) => {
          try {
            const res = await axios.post(
              `${BASE}/api/shops/upgrade-premium/`,
              { reference: transaction.reference },
              ac()
            );
            onSuccess(res.data);
          } catch (e) {
            setErr(e.response?.data?.error || "Payment verified but activation failed. Contact support.");
            setPaying(false);
          }
        },
        onCancel: () => setPaying(false),
      });
      handler.openIframe();
    } catch {
      setErr("Could not load payment gateway. Check your connection and try again.");
      setPaying(false);
    }
  };

  return (
    <div style={{ maxWidth: "560px", margin: "0 auto", fontFamily: "inherit" }}>

      {/* Hero card */}
      <div style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderTop: "3px solid #d97706",
        borderRadius: "14px",
        padding: "36px 32px 28px",
        textAlign: "center",
        marginBottom: "20px",
      }}>
        <div style={{
          display: "inline-flex", alignItems: "center", justifyContent: "center",
          width: "56px", height: "56px", borderRadius: "14px",
          background: "#fefce8", border: "1.5px solid #fde68a",
          color: "#d97706", marginBottom: "18px",
        }}>
          <CrownIcon size={26} />
        </div>

        <h2 style={{
          fontWeight: 800, fontSize: "22px", color: "#0f172a",
          margin: "0 0 8px", letterSpacing: "-0.02em",
        }}>
          Premium Store
        </h2>
        <p style={{
          fontSize: "14px", color: "#64748b", margin: "0 0 24px",
          lineHeight: 1.65, maxWidth: "380px", marginLeft: "auto", marginRight: "auto",
        }}>
          Give your store a personality that buyers remember. Add a promo video,
          editorial text, and unlock features that set you apart.
        </p>

        {/* Price */}
        <div style={{
          display: "inline-flex", flexDirection: "column",
          alignItems: "center", gap: "2px",
          background: "#f8fafc",
          border: "1px solid #e2e8f0",
          borderRadius: "12px",
          padding: "14px 32px",
        }}>
          <div style={{ display: "flex", alignItems: "baseline", gap: "3px" }}>
            <span style={{ fontSize: "15px", fontWeight: 600, color: "#64748b" }}>₦</span>
            <span style={{ fontSize: "40px", fontWeight: 900, color: "#0f172a", lineHeight: 1, letterSpacing: "-0.03em" }}>10,000</span>
          </div>
          <span style={{ fontSize: "12.5px", color: "#94a3b8", fontWeight: 500 }}>per month</span>
        </div>
      </div>

      {/* What's included */}
      <div style={{
        background: "#fff",
        border: "1px solid #e2e8f0",
        borderRadius: "14px",
        padding: "22px 24px",
        marginBottom: "20px",
      }}>
        <div style={{
          fontSize: "11px", fontWeight: 700, color: "#94a3b8",
          letterSpacing: "0.08em", textTransform: "uppercase",
          marginBottom: "16px",
        }}>
          What's included
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          {FEATURES.map(({ Icon, title, desc }) => (
            <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
              <div style={{
                width: "32px", height: "32px", borderRadius: "8px",
                background: "#f8fafc", border: "1px solid #e2e8f0",
                display: "flex", alignItems: "center", justifyContent: "center",
                flexShrink: 0, color: "#475569", marginTop: "1px",
              }}>
                <Icon />
              </div>
              <div>
                <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a", marginBottom: "2px" }}>{title}</div>
                <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.55 }}>{desc}</div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Error */}
      {err && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca",
          borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
          fontSize: "13.5px", color: "#b91c1c", lineHeight: 1.5,
        }}>
          {err}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleUpgrade}
        disabled={paying}
        style={{
          width: "100%", padding: "15px",
          background: paying ? "#94a3b8" : "#0f172a",
          color: "#fff", border: "none", borderRadius: "10px",
          fontWeight: 700, fontSize: "15px",
          cursor: paying ? "not-allowed" : "pointer",
          letterSpacing: "-0.01em",
          transition: "background 0.15s",
        }}
        onMouseEnter={e => { if (!paying) e.currentTarget.style.background = "#1e293b"; }}
        onMouseLeave={e => { if (!paying) e.currentTarget.style.background = "#0f172a"; }}
      >
        {paying ? "Processing payment…" : "Activate Premium — ₦10,000 / mo"}
      </button>

      <div style={{
        display: "flex", alignItems: "center", justifyContent: "center",
        gap: "5px", marginTop: "10px",
        fontSize: "12px", color: "#94a3b8",
      }}>
        <LockIcon />
        Secure checkout by Paystack · Cancel anytime
      </div>

      <style>{`
        @media (max-width: 480px) {
          .prem-hero-card { padding: 24px 18px 22px !important; }
        }
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════
   MANAGE PAGE (premium active)
══════════════════════════════════════════ */
const ManagePage = ({ shop, onShopUpdate }) => {
  const [videoUrl, setVideoUrl]       = useState(shop.store_video_url || "");
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoMsg, setVideoMsg]       = useState(null); // { type: "ok"|"err", text }

  const [blocks, setBlocks]           = useState(
    [...(shop.text_blocks || [])].sort((a, b) => a.insert_after - b.insert_after || a.id - b.id)
  );
  const [editingId, setEditingId]     = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const EMPTY_FORM = { title: "", content: "", insert_after: 0 };
  const [blockForm, setBlockForm]     = useState(EMPTY_FORM);
  const [blockSaving, setBlockSaving] = useState(false);
  const [blockErr, setBlockErr]       = useState("");

  /* ── Video ── */
  const saveVideo = async () => {
    setVideoSaving(true);
    setVideoMsg(null);
    try {
      await axios.patch(`${BASE}/api/shops/${shop.slug}/update-video/`, { store_video_url: videoUrl }, ac());
      setVideoMsg({ type: "ok", text: "Video URL saved." });
      onShopUpdate({ ...shop, store_video_url: videoUrl });
    } catch {
      setVideoMsg({ type: "err", text: "Could not save. Please try again." });
    } finally {
      setVideoSaving(false);
      setTimeout(() => setVideoMsg(null), 4000);
    }
  };

  /* ── Blocks ── */
  const openEdit = (b) => {
    setEditingId(b.id);
    setBlockForm({ title: b.title || "", content: b.content, insert_after: b.insert_after });
    setShowNewForm(false);
    setBlockErr("");
  };
  const openNew = () => {
    setEditingId(null);
    setBlockForm(EMPTY_FORM);
    setShowNewForm(true);
    setBlockErr("");
  };
  const closeForm = () => { setEditingId(null); setShowNewForm(false); setBlockErr(""); };

  const saveBlock = async () => {
    if (!blockForm.content.trim()) { setBlockErr("Content is required."); return; }
    setBlockSaving(true);
    setBlockErr("");
    try {
      if (editingId) {
        const res = await axios.patch(`${BASE}/api/shops/${shop.slug}/text-blocks/${editingId}/`, blockForm, ac());
        setBlocks(prev => [...prev.filter(b => b.id !== editingId), res.data].sort((a, b) => a.insert_after - b.insert_after || a.id - b.id));
      } else {
        const res = await axios.post(`${BASE}/api/shops/${shop.slug}/text-blocks/`, blockForm, ac());
        setBlocks(prev => [...prev, res.data].sort((a, b) => a.insert_after - b.insert_after || a.id - b.id));
      }
      closeForm();
    } catch (e) {
      setBlockErr(e.response?.data?.content?.[0] || "Save failed. Try again.");
    } finally {
      setBlockSaving(false);
    }
  };

  const deleteBlock = async (id) => {
    if (!window.confirm("Delete this text block? This cannot be undone.")) return;
    try {
      await axios.delete(`${BASE}/api/shops/${shop.slug}/text-blocks/${id}/`, ac());
      setBlocks(prev => prev.filter(b => b.id !== id));
    } catch { alert("Could not delete. Please try again."); }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto", fontFamily: "inherit" }}>

      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        padding: "12px 16px", marginBottom: "24px",
        background: "#fff", border: "1px solid #e2e8f0",
        borderLeft: "3px solid #d97706", borderRadius: "10px",
      }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "8px",
          background: "#fefce8", border: "1px solid #fde68a",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#d97706", flexShrink: 0,
        }}>
          <CrownIcon size={16} />
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "13px", color: "#0f172a" }}>Premium Store — Active</div>
          <div style={{ fontSize: "12px", color: "#94a3b8" }}>
            Member since {new Date(shop.premium_since).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* ── VIDEO SECTION ── */}
      <Section
        icon={<VideoIcon />}
        title="Promo Video"
        description="Your video will appear on your store page, right below your profile. Paste a YouTube or Vimeo link."
        mb
      >
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=…"
            className="sd-input"
            style={{ flex: 1 }}
          />
          <button
            onClick={saveVideo}
            disabled={videoSaving}
            style={{
              padding: "9px 20px",
              background: videoSaving ? "#94a3b8" : "#0f172a",
              color: "#fff", border: "none", borderRadius: "8px",
              fontWeight: 600, fontSize: "13px",
              cursor: videoSaving ? "not-allowed" : "pointer",
              whiteSpace: "nowrap", transition: "background 0.15s",
            }}
          >
            {videoSaving ? "Saving…" : "Save"}
          </button>
        </div>
        {videoMsg && (
          <div style={{
            marginTop: "8px", fontSize: "13px", fontWeight: 500,
            color: videoMsg.type === "ok" ? "#15803d" : "#b91c1c",
          }}>
            {videoMsg.text}
          </div>
        )}
        {shop.store_video_url && (
          <div style={{ marginTop: "8px", fontSize: "12.5px", color: "#94a3b8" }}>
            Live on your{" "}
            <a href={`/shop/${shop.slug}`} target="_blank" rel="noreferrer"
              style={{ color: "#2563eb", textDecoration: "none", fontWeight: 500 }}>
              store page →
            </a>
          </div>
        )}
      </Section>

      {/* ── TEXT BLOCKS SECTION ── */}
      <Section
        icon={<TextIcon />}
        title="Text Blocks"
        description={`Place editorial messages between your products. The "Position" field controls placement — 0 means before the first product.`}
        action={!showNewForm && !editingId && (
          <button
            onClick={openNew}
            style={{
              display: "inline-flex", alignItems: "center", gap: "6px",
              padding: "7px 14px",
              background: "#0f172a", color: "#fff",
              border: "none", borderRadius: "7px",
              fontWeight: 600, fontSize: "12.5px", cursor: "pointer",
            }}
          >
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
              <line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/>
            </svg>
            New Block
          </button>
        )}
      >
        {/* Existing blocks */}
        {blocks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: showNewForm ? "16px" : "0" }}>
            {blocks.map(block => (
              <div key={block.id}>
                {editingId === block.id ? (
                  <BlockForm
                    form={blockForm} setForm={setBlockForm}
                    onSave={saveBlock} onCancel={closeForm}
                    saving={blockSaving} err={blockErr} isEdit
                  />
                ) : (
                  <div style={{
                    background: "#f8fafc",
                    border: "1px solid #e2e8f0",
                    borderRadius: "10px",
                    padding: "12px 14px",
                    transition: "border-color 0.15s",
                  }}
                    onMouseEnter={e => e.currentTarget.style.borderColor = "#cbd5e1"}
                    onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}
                  >
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                          {block.title && (
                            <span style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a" }}>
                              {block.title}
                            </span>
                          )}
                          <span style={{
                            fontSize: "11px", fontWeight: 600, color: "#64748b",
                            background: "#e2e8f0", borderRadius: "999px",
                            padding: "1px 8px", whiteSpace: "nowrap",
                          }}>
                            After product #{block.insert_after}
                            {block.insert_after === 0 ? " (top)" : ""}
                          </span>
                        </div>
                        <div style={{
                          fontSize: "13px", color: "#64748b", lineHeight: 1.6,
                          overflow: "hidden", display: "-webkit-box",
                          WebkitLineClamp: 2, WebkitBoxOrient: "vertical",
                        }}>
                          {block.content}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                        <button onClick={() => openEdit(block)} style={smallBtn("#eff6ff", "#2563eb")}>Edit</button>
                        <button onClick={() => deleteBlock(block.id)} style={smallBtn("#fef2f2", "#ef4444")}>Delete</button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {blocks.length === 0 && !showNewForm && (
          <div style={{
            textAlign: "center", padding: "28px 20px",
            border: "1.5px dashed #e2e8f0", borderRadius: "10px",
          }}>
            <div style={{ fontSize: "13.5px", color: "#94a3b8" }}>
              No text blocks yet. Add your first one to start customising your store.
            </div>
          </div>
        )}

        {/* New block form */}
        {showNewForm && (
          <BlockForm
            form={blockForm} setForm={setBlockForm}
            onSave={saveBlock} onCancel={closeForm}
            saving={blockSaving} err={blockErr}
          />
        )}
      </Section>
    </div>
  );
};

/* ── Small button helper ── */
const smallBtn = (bg, color) => ({
  padding: "5px 11px", background: bg, color,
  border: "none", borderRadius: "6px",
  fontSize: "12px", fontWeight: 600, cursor: "pointer",
});

/* ── Section wrapper ── */
const Section = ({ icon, title, description, children, action, mb }) => (
  <div style={{
    background: "#fff", border: "1px solid #e2e8f0",
    borderRadius: "12px", overflow: "hidden",
    marginBottom: mb ? "16px" : 0,
  }}>
    <div style={{
      display: "flex", alignItems: "center", justifyContent: "space-between",
      padding: "16px 20px", borderBottom: "1px solid #f1f5f9", gap: "10px",
    }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <div style={{
          width: "30px", height: "30px", borderRadius: "7px",
          background: "#f8fafc", border: "1px solid #e2e8f0",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#475569", flexShrink: 0,
        }}>
          {icon}
        </div>
        <div style={{ minWidth: 0 }}>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>{title}</div>
          {description && (
            <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "1px", lineHeight: 1.5 }}>
              {description}
            </div>
          )}
        </div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
    <div style={{ padding: "18px 20px" }}>
      {children}
    </div>
  </div>
);

/* ── Block form ── */
const BlockForm = ({ form, setForm, onSave, onCancel, saving, err, isEdit }) => (
  <div style={{
    background: "#f8fafc", border: "1px solid #e2e8f0",
    borderRadius: "10px", padding: "16px",
  }}>
    <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a", marginBottom: "14px" }}>
      {isEdit ? "Edit block" : "New text block"}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <label className="sd-label">Title <span style={{ color: "#cbd5e1", fontWeight: 400 }}>(optional)</span></label>
        <input
          className="sd-input"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="e.g. New Arrivals, Our Story, Flash Sale…"
        />
      </div>
      <div>
        <label className="sd-label">Content</label>
        <textarea
          className="sd-input"
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder="Write your message here…"
          rows={3}
          style={{ resize: "vertical", lineHeight: 1.6 }}
        />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div>
          <label className="sd-label">Position — show after product #</label>
          <input
            type="number" min={0}
            className="sd-input"
            value={form.insert_after}
            onChange={e => setForm(f => ({ ...f, insert_after: Math.max(0, parseInt(e.target.value) || 0) }))}
            style={{ width: "100px" }}
          />
        </div>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "18px" }}>
          0 = before all products
        </div>
      </div>
    </div>
    {err && (
      <div style={{ marginTop: "10px", fontSize: "13px", color: "#b91c1c", fontWeight: 500 }}>{err}</div>
    )}
    <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
      <button
        onClick={onSave} disabled={saving}
        style={{
          padding: "8px 20px",
          background: saving ? "#94a3b8" : "#0f172a",
          color: "#fff", border: "none", borderRadius: "7px",
          fontWeight: 600, fontSize: "13px",
          cursor: saving ? "not-allowed" : "pointer",
          transition: "background 0.15s",
        }}
      >
        {saving ? "Saving…" : isEdit ? "Save changes" : "Add block"}
      </button>
      <button
        onClick={onCancel}
        style={{
          padding: "8px 16px",
          background: "transparent", color: "#64748b",
          border: "1px solid #e2e8f0", borderRadius: "7px",
          fontWeight: 500, fontSize: "13px", cursor: "pointer",
        }}
      >
        Cancel
      </button>
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
const SellerPremium = () => {
  const { shop, shopLoading, refreshShop, setPageTitle } = useSellerCtx();
  const [localShop, setLocalShop] = useState(null);

  useEffect(() => { setPageTitle("Premium Store"); }, []);
  useEffect(() => { if (shop) setLocalShop(shop); }, [shop]);

  const handleSuccess = (updatedShop) => {
    setLocalShop(updatedShop);
    refreshShop();
  };

  if (shopLoading || !localShop) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
      <div className="spinner-border" style={{ color: "#3b7bf8", width: "1.75rem", height: "1.75rem" }} />
    </div>
  );

  return localShop.is_premium
    ? <ManagePage shop={localShop} onShopUpdate={setLocalShop} />
    : <UpgradePage onSuccess={handleSuccess} />;
};

export default SellerPremium;
