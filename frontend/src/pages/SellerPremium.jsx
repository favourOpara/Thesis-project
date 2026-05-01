import React, { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSellerCtx, ac, BASE } from "../components/SellerLayout";
import { useLocation, useNavigate } from "react-router-dom";

/* ac() with explicit JSON content type — avoids 415 errors */
const acJson = () => {
  const base = ac();
  return { ...base, headers: { ...base.headers, 'Content-Type': 'application/json' } };
};

/* ══════════════════════════════════════════
   ICONS
══════════════════════════════════════════ */
const Ico = ({ d, size = 18, extra = "" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor"
    strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round">
    <path d={extra} /><path d={d} />
  </svg>
);
const CrownIcon   = ({ size = 24 }) => <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round"><path d="M2 20h20M4 16l2-10 6 5 6-5 2 10"/></svg>;
const LockIcon    = () => <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>;
const CheckCircle = () => <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#15803d" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>;
const SpinIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ animation: "spin 0.9s linear infinite" }}><path d="M21 12a9 9 0 1 1-6.219-8.56"/></svg>;
const VideoIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="2" y="5" width="14" height="14" rx="2"/><path d="M16 10l5-3v10l-5-3V10z"/></svg>;
const TextIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="17" y1="10" x2="3" y2="10"/><line x1="21" y1="6" x2="3" y2="6"/><line x1="21" y1="14" x2="3" y2="14"/><line x1="17" y1="18" x2="3" y2="18"/></svg>;
const BadgeIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="8" r="6"/><path d="M15.477 12.89L17 22l-5-3-5 3 1.523-9.11"/></svg>;
const TrendIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polyline points="22 7 13.5 15.5 8.5 10.5 2 17"/><polyline points="16 7 22 7 22 13"/></svg>;
const BoxIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z"/><polyline points="3.27 6.96 12 12.01 20.73 6.96"/><line x1="12" y1="22.08" x2="12" y2="12"/></svg>;
const TruckIcon   = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><rect x="1" y="3" width="15" height="13" rx="1"/><path d="M16 8h4l3 5v3h-7V8z"/><circle cx="5.5" cy="18.5" r="2.5"/><circle cx="18.5" cy="18.5" r="2.5"/></svg>;
const HeadsetIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M3 18v-6a9 9 0 0 1 18 0v6"/><path d="M21 19a2 2 0 0 1-2 2h-1a2 2 0 0 1-2-2v-3a2 2 0 0 1 2-2h3zM3 19a2 2 0 0 0 2 2h1a2 2 0 0 0 2-2v-3a2 2 0 0 0-2-2H3z"/></svg>;
const BarChartIcon= () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/><line x1="2" y1="20" x2="22" y2="20"/></svg>;
const StarIcon    = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>;
const TagIcon     = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M20.59 13.41l-7.17 7.17a2 2 0 0 1-2.83 0L2 12V2h10l8.59 8.59a2 2 0 0 1 0 2.82z"/><line x1="7" y1="7" x2="7.01" y2="7"/></svg>;

/* ── Feature groups ── */
const PERK_GROUPS = [
  {
    label: "Store Experience",
    color: "#2563eb",
    bg: "#eff6ff",
    perks: [
      { Icon: VideoIcon,  title: "Promo Video",            desc: "Embed a YouTube or Vimeo video directly on your storefront to showcase your products." },
      { Icon: TextIcon,   title: "Editorial Text Blocks",  desc: "Place custom messages and brand copy between your products for a unique, editorial feel." },
      { Icon: BadgeIcon,  title: "Verified Premium Badge", desc: "A visible trust signal on your store page that builds buyer confidence." },
    ],
  },
  {
    label: "Growth & Visibility",
    color: "#7c3aed",
    bg: "#f5f3ff",
    perks: [
      { Icon: TrendIcon,   title: "Boosted Store Ranking",   desc: "Your store appears higher in browse and search results across the platform." },
      { Icon: StarIcon,    title: "Homepage Featured Section", desc: "Your store gets rotated in the 'Featured Stores' section seen by every visitor." },
      { Icon: BarChartIcon,title: "Advanced Analytics",      desc: "Detailed insights on visits, product views, cart adds, and buyer behaviour." },
    ],
  },
  {
    label: "Operations & Support",
    color: "#d97706",
    bg: "#fffbeb",
    perks: [
      { Icon: BoxIcon,    title: "Warehousing Service",    desc: "Store your inventory at an Abatrades partner warehouse — we handle stock management." },
      { Icon: TruckIcon,  title: "Logistics & Delivery",   desc: "We coordinate order pickup and last-mile delivery to buyers nationwide." },
      { Icon: HeadsetIcon,title: "Priority Seller Support",desc: "Dedicated support line with faster response times for any seller issues." },
      { Icon: TagIcon,    title: "Reduced Platform Fees",  desc: "Enjoy lower transaction fees on every sale as a premium member." },
    ],
  },
];

/* ══════════════════════════════════════════
   UPGRADE PAGE
══════════════════════════════════════════ */
const UpgradePage = ({ onSuccess }) => {
  const [loading, setLoading] = useState(false);
  const [err,     setErr]     = useState("");

  const handleUpgrade = async () => {
    setErr("");
    setLoading(true);
    try {
      const res = await axios.post(`${BASE}/api/shops/init-premium-payment/`, {}, acJson());
      if (res.data.already_premium) {
        onSuccess(res.data.shop);
        return;
      }
      // Redirect to Paystack — no iframe, no Permission-Policy issues
      window.location.href = res.data.authorization_url;
    } catch (e) {
      console.error("Init payment error:", e.response?.status, e.response?.data);
      setErr(e.response?.data?.error || "Could not start payment. Check your connection and try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ fontFamily: "inherit" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>

      {/* ── Error banner ── */}
      {err && (
        <div style={{
          background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px",
          padding: "14px 18px", marginBottom: "20px",
          display: "flex", alignItems: "flex-start", gap: "10px",
        }}>
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#b91c1c" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
            <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
          </svg>
          <div style={{ fontSize: "13.5px", color: "#b91c1c", lineHeight: 1.6 }}>{err}</div>
          <button onClick={() => setErr("")} style={{ marginLeft: "auto", background: "none", border: "none", cursor: "pointer", color: "#b91c1c", fontSize: "16px", lineHeight: 1, padding: 0, flexShrink: 0 }}>×</button>
        </div>
      )}

      {/* ── Hero banner ── */}
      <div style={{
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "16px", padding: "48px 40px", marginBottom: "24px",
        display: "flex", alignItems: "center", justifyContent: "space-between",
        gap: "32px", flexWrap: "wrap",
      }}>
        <div style={{ flex: "1 1 340px" }}>
          <div style={{
            display: "inline-flex", alignItems: "center", gap: "8px",
            background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.35)",
            borderRadius: "999px", padding: "5px 14px", marginBottom: "18px",
          }}>
            <CrownIcon size={14} />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#fbbf24", letterSpacing: "0.05em", textTransform: "uppercase" }}>Premium Store</span>
          </div>
          <h2 style={{ fontWeight: 800, fontSize: "28px", color: "#fff", margin: "0 0 12px", lineHeight: 1.2, letterSpacing: "-0.02em" }}>
            Everything you need to grow your store
          </h2>
          <p style={{ fontSize: "14.5px", color: "#94a3b8", margin: 0, lineHeight: 1.7, maxWidth: "480px" }}>
            Custom storefronts, featured placements, warehousing, logistics, and more — all in one plan.
          </p>
        </div>
        <div style={{ flexShrink: 0, textAlign: "center" }}>
          <div style={{
            background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)",
            borderRadius: "16px", padding: "24px 40px",
          }}>
            <div style={{ display: "flex", alignItems: "baseline", gap: "4px", justifyContent: "center" }}>
              <span style={{ fontSize: "16px", fontWeight: 600, color: "#94a3b8" }}>₦</span>
              <span style={{ fontSize: "46px", fontWeight: 900, color: "#fff", lineHeight: 1, letterSpacing: "-0.04em" }}>10,000</span>
            </div>
            <div style={{ fontSize: "13px", color: "#64748b", fontWeight: 500, marginTop: "6px" }}>billed monthly · card saved automatically</div>
          </div>
          <button
            onClick={handleUpgrade}
            disabled={loading}
            style={{
              marginTop: "14px", padding: "14px 40px",
              background: loading ? "#64748b" : "#d97706",
              color: "#fff", border: "none", borderRadius: "10px",
              fontWeight: 700, fontSize: "15px", width: "100%",
              cursor: loading ? "not-allowed" : "pointer",
              letterSpacing: "-0.01em", transition: "background 0.15s",
              display: "flex", alignItems: "center", justifyContent: "center", gap: "8px",
            }}
            onMouseEnter={e => { if (!loading) e.currentTarget.style.background = "#b45309"; }}
            onMouseLeave={e => { if (!loading) e.currentTarget.style.background = "#d97706"; }}
          >
            {loading ? <><SpinIcon /> Redirecting to Paystack…</> : "Activate Premium — ₦10,000 / mo"}
          </button>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", marginTop: "8px", fontSize: "11.5px", color: "#475569" }}>
            <LockIcon /> Secure checkout by Paystack
          </div>
        </div>
      </div>

      {/* ── Perk groups — 3-column grid ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: "16px" }}>
        {PERK_GROUPS.map(group => (
          <div key={group.label} style={{
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: "14px", overflow: "hidden",
          }}>
            {/* Group header */}
            <div style={{
              display: "flex", alignItems: "center", gap: "8px",
              padding: "13px 18px",
              background: group.bg,
              borderBottom: "1px solid #e2e8f0",
            }}>
              <div style={{ width: "7px", height: "7px", borderRadius: "50%", background: group.color, flexShrink: 0 }} />
              <span style={{ fontSize: "11.5px", fontWeight: 700, color: group.color, letterSpacing: "0.06em", textTransform: "uppercase" }}>
                {group.label}
              </span>
            </div>

            {/* Perks */}
            <div style={{ padding: "16px 18px", display: "flex", flexDirection: "column", gap: "16px" }}>
              {group.perks.map(({ Icon, title, desc }) => (
                <div key={title} style={{ display: "flex", alignItems: "flex-start", gap: "12px" }}>
                  <div style={{
                    width: "32px", height: "32px", borderRadius: "8px",
                    background: group.bg, border: `1px solid ${group.color}22`,
                    display: "flex", alignItems: "center", justifyContent: "center",
                    flexShrink: 0, color: group.color,
                  }}>
                    <Icon />
                  </div>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a", marginBottom: "3px" }}>{title}</div>
                    <div style={{ fontSize: "12.5px", color: "#64748b", lineHeight: 1.6 }}>{desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

/* ══════════════════════════════════════════
   MANAGE PAGE (premium active)
══════════════════════════════════════════ */
const SubscriptionIcon = () => <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2C6.477 2 2 6.477 2 12s4.477 10 10 10 10-4.477 10-10S17.523 2 12 2z"/><polyline points="12 6 12 12 16 14"/></svg>;

const ManagePage = ({ shop, onShopUpdate }) => {
  // video state
  const [videoTab,    setVideoTab]    = useState(shop.store_video_file_url ? "upload" : "url");
  const [videoUrl,    setVideoUrl]    = useState(shop.store_video_url || "");
  const [videoFile,   setVideoFile]   = useState(null);
  const [videoPreview,setVideoPreview]= useState(shop.store_video_file_url || null);
  const [uploadPct,   setUploadPct]   = useState(0);
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoMsg,    setVideoMsg]    = useState(null);
  const fileInputRef = useRef(null);

  // subscription management state
  const [subStatus,       setSubStatus]       = useState(null);   // { has_subscription, status, next_payment_date }
  const [subLoading,      setSubLoading]       = useState(true);
  const [cancelling,      setCancelling]       = useState(false);
  const [reactivating,    setReactivating]     = useState(false);
  const [subMsg,          setSubMsg]           = useState(null);   // { ok, text }
  const [showCancelConfirm, setShowCancelConfirm] = useState(false);

  useEffect(() => {
    axios.get(`${BASE}/api/shops/subscription-status/`, ac())
      .then(res => setSubStatus(res.data))
      .catch(() => setSubStatus({ has_subscription: false }))
      .finally(() => setSubLoading(false));
  }, []);

  const handleCancelSubscription = async () => {
    setShowCancelConfirm(false);
    setCancelling(true);
    setSubMsg(null);
    try {
      const res = await axios.post(`${BASE}/api/shops/cancel-premium/`, {}, acJson());
      onShopUpdate(res.data);
      const expiresAt = res.data.premium_expires_at;
      const dateStr = expiresAt
        ? new Date(expiresAt).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })
        : null;
      setSubMsg({ ok: true, text: dateStr
        ? `Subscription cancelled. Your premium features remain active until ${dateStr}.`
        : "Subscription cancelled. Auto-renewal has been turned off."
      });
      setSubStatus(prev => ({ ...prev, status: "cancelled" }));
    } catch (e) {
      setSubMsg({ ok: false, text: e.response?.data?.error || "Could not cancel. Please try again." });
    } finally {
      setCancelling(false);
    }
  };

  const handleReactivate = async () => {
    setReactivating(true);
    setSubMsg(null);
    try {
      const res = await axios.post(`${BASE}/api/shops/reactivate-premium/`, {}, acJson());
      onShopUpdate(res.data);
      setSubMsg({ ok: true, text: "Subscription reactivated! Your premium features are active again." });
      setSubStatus(prev => ({ ...prev, status: "active" }));
    } catch (e) {
      setSubMsg({ ok: false, text: e.response?.data?.error || "Could not reactivate. Please try again." });
    } finally {
      setReactivating(false);
    }
  };

  const [blocks, setBlocks]           = useState(
    [...(shop.text_blocks || [])].sort((a, b) => a.insert_after - b.insert_after || a.id - b.id)
  );
  const [editingId, setEditingId]     = useState(null);
  const [showNewForm, setShowNewForm] = useState(false);
  const EMPTY = { title: "", content: "", insert_after: 0 };
  const [blockForm, setBlockForm]     = useState(EMPTY);
  const [blockSaving, setBlockSaving] = useState(false);
  const [blockErr, setBlockErr]       = useState("");

  const saveVideo = async () => {
    setVideoSaving(true); setVideoMsg(null); setUploadPct(0);
    try {
      const token = localStorage.getItem("access_token");
      const authHeader = token ? { Authorization: `Bearer ${token}` } : {};

      if (videoTab === "upload" && videoFile) {
        const form = new FormData();
        form.append("store_video_file", videoFile);
        const res = await axios.patch(`${BASE}/api/shops/${shop.slug}/update-video/`, form, {
          withCredentials: true,
          headers: { ...authHeader },   // let browser set multipart boundary
          onUploadProgress: e => setUploadPct(Math.round((e.loaded / e.total) * 100)),
        });
        setVideoPreview(res.data.store_video_file_url);
        setVideoFile(null);
        onShopUpdate({ ...shop, store_video_url: "", store_video_file_url: res.data.store_video_file_url });
        setVideoMsg({ ok: true, text: "Video uploaded and live on your store." });
      } else {
        const res = await axios.patch(
          `${BASE}/api/shops/${shop.slug}/update-video/`,
          { store_video_url: videoUrl },
          acJson()
        );
        setVideoPreview(null);
        onShopUpdate({ ...shop, store_video_url: videoUrl, store_video_file_url: null });
        setVideoMsg({ ok: true, text: "Video URL saved." });
      }
    } catch {
      setVideoMsg({ ok: false, text: "Could not save. Please try again." });
    } finally {
      setVideoSaving(false);
      setUploadPct(0);
      setTimeout(() => setVideoMsg(null), 5000);
    }
  };

  const handleFileChange = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    setVideoFile(f);
    setVideoPreview(URL.createObjectURL(f));
  };

  const openEdit = (b) => { setEditingId(b.id); setBlockForm({ title: b.title || "", content: b.content, insert_after: b.insert_after }); setShowNewForm(false); setBlockErr(""); };
  const openNew  = () => { setEditingId(null); setBlockForm(EMPTY); setShowNewForm(true); setBlockErr(""); };
  const closeForm= () => { setEditingId(null); setShowNewForm(false); setBlockErr(""); };

  const saveBlock = async () => {
    if (!blockForm.content.trim()) { setBlockErr("Content is required."); return; }
    setBlockSaving(true); setBlockErr("");
    try {
      if (editingId) {
        const res = await axios.patch(`${BASE}/api/shops/${shop.slug}/text-blocks/${editingId}/`, blockForm, acJson());
        setBlocks(prev => [...prev.filter(b => b.id !== editingId), res.data].sort((a,b) => a.insert_after - b.insert_after || a.id - b.id));
      } else {
        const res = await axios.post(`${BASE}/api/shops/${shop.slug}/text-blocks/`, blockForm, acJson());
        setBlocks(prev => [...prev, res.data].sort((a,b) => a.insert_after - b.insert_after || a.id - b.id));
      }
      closeForm();
    } catch (e) {
      setBlockErr(e.response?.data?.content?.[0] || "Save failed. Try again.");
    } finally {
      setBlockSaving(false);
    }
  };

  const deleteBlock = async (id) => {
    if (!window.confirm("Delete this text block?")) return;
    try {
      await axios.delete(`${BASE}/api/shops/${shop.slug}/text-blocks/${id}/`, ac());
      setBlocks(p => p.filter(b => b.id !== id));
    } catch { alert("Could not delete."); }
  };

  return (
    <div style={{ fontFamily: "inherit" }}>

      {/* Status bar */}
      <div style={{
        display: "flex", alignItems: "center", gap: "12px",
        padding: "16px 20px", marginBottom: "24px",
        background: "linear-gradient(135deg, #0f172a 0%, #1e293b 100%)",
        borderRadius: "12px",
      }}>
        <div style={{
          width: "36px", height: "36px", borderRadius: "10px",
          background: "rgba(217,119,6,0.2)", border: "1px solid rgba(217,119,6,0.4)",
          display: "flex", alignItems: "center", justifyContent: "center",
          color: "#fbbf24", flexShrink: 0,
        }}>
          <CrownIcon size={18} />
        </div>
        <div style={{ flex: 1 }}>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#fff" }}>
            Premium Store — {shop.premium_expires_at ? "Cancelling" : "Active"}
          </div>
          {shop.premium_expires_at ? (
            <div style={{ fontSize: "12px", color: "#fbbf24" }}>
              Access until {new Date(shop.premium_expires_at).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })} · Auto-renewal off
            </div>
          ) : (
            <div style={{ fontSize: "12px", color: "#64748b" }}>
              Member since {new Date(shop.premium_since).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
            </div>
          )}
        </div>
        <a href={`/shop/${shop.slug}`} target="_blank" rel="noreferrer" style={{ fontSize: "12.5px", color: "#fbbf24", fontWeight: 600, textDecoration: "none", background: "rgba(217,119,6,0.15)", border: "1px solid rgba(217,119,6,0.3)", borderRadius: "7px", padding: "6px 14px", whiteSpace: "nowrap" }}>
          View store →
        </a>
      </div>

      {/* Two-column grid on desktop */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))", gap: "16px", alignItems: "start" }}>

        {/* Video */}
        <Section icon={<VideoIcon />} title="Promo Video" description="Upload a video file or paste a YouTube / Vimeo link — it appears on your store page.">

          {/* Tabs */}
          <div style={{ display: "flex", gap: "6px", marginBottom: "14px" }}>
            {[{ key: "upload", label: "Upload file" }, { key: "url", label: "Paste URL" }].map(t => (
              <button key={t.key} onClick={() => setVideoTab(t.key)} style={{
                padding: "6px 14px", borderRadius: "7px", border: "1.5px solid",
                borderColor: videoTab === t.key ? "#0f172a" : "#e2e8f0",
                background: videoTab === t.key ? "#0f172a" : "#fff",
                color: videoTab === t.key ? "#fff" : "#64748b",
                fontWeight: 600, fontSize: "12.5px", cursor: "pointer",
              }}>{t.label}</button>
            ))}
          </div>

          {videoTab === "upload" ? (
            <div>
              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                onDragOver={e => { e.preventDefault(); e.currentTarget.style.borderColor = "#0f172a"; }}
                onDragLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; }}
                onDrop={e => {
                  e.preventDefault();
                  e.currentTarget.style.borderColor = "#e2e8f0";
                  const f = e.dataTransfer.files[0];
                  if (f && f.type.startsWith("video/")) { setVideoFile(f); setVideoPreview(URL.createObjectURL(f)); }
                }}
                style={{
                  border: "2px dashed #e2e8f0", borderRadius: "10px",
                  padding: "28px 16px", textAlign: "center", cursor: "pointer",
                  background: "#f8fafc", transition: "border-color 0.15s",
                  marginBottom: "12px",
                }}
              >
                <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" style={{ margin: "0 auto 10px", display: "block" }}>
                  <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/>
                  <polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/>
                </svg>
                <div style={{ fontSize: "13.5px", fontWeight: 600, color: "#0f172a", marginBottom: "4px" }}>
                  {videoFile ? videoFile.name : "Click or drag a video here"}
                </div>
                <div style={{ fontSize: "12px", color: "#94a3b8" }}>MP4, MOV, WebM — max 200 MB</div>
              </div>
              <input ref={fileInputRef} type="file" accept="video/*" style={{ display: "none" }} onChange={handleFileChange} />

              {/* Preview */}
              {videoPreview && (
                <video src={videoPreview} controls style={{ width: "100%", borderRadius: "8px", marginBottom: "12px", maxHeight: "200px", background: "#000" }} />
              )}

              {/* Upload progress */}
              {videoSaving && uploadPct > 0 && (
                <div style={{ marginBottom: "10px" }}>
                  <div style={{ height: "4px", background: "#e2e8f0", borderRadius: "999px", overflow: "hidden" }}>
                    <div style={{ height: "100%", width: `${uploadPct}%`, background: "#0f172a", transition: "width 0.2s" }} />
                  </div>
                  <div style={{ fontSize: "12px", color: "#64748b", marginTop: "4px", textAlign: "right" }}>{uploadPct}%</div>
                </div>
              )}
            </div>
          ) : (
            <div style={{ marginBottom: "12px" }}>
              <input type="url" value={videoUrl} onChange={e => setVideoUrl(e.target.value)}
                placeholder="https://www.youtube.com/watch?v=… or https://vimeo.com/…"
                className="sd-input" />
            </div>
          )}

          <button onClick={saveVideo} disabled={videoSaving || (videoTab === "upload" && !videoFile && !videoPreview)}
            style={btnStyle(videoSaving || (videoTab === "upload" && !videoFile && !videoPreview))}>
            {videoSaving ? (videoTab === "upload" ? `Uploading… ${uploadPct}%` : "Saving…") : "Save Video"}
          </button>

          {videoMsg && (
            <div style={{ marginTop: "10px", fontSize: "13px", fontWeight: 500, color: videoMsg.ok ? "#15803d" : "#b91c1c" }}>
              {videoMsg.text}
            </div>
          )}
        </Section>

        {/* Text blocks */}
        <Section
        icon={<TextIcon />}
        title="Text Blocks"
        description='Place editorial messages between products. "Position" controls placement — 0 means before the first product.'
        action={!showNewForm && !editingId && (
          <button onClick={openNew} style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "7px 14px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "7px", fontWeight: 600, fontSize: "12.5px", cursor: "pointer" }}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
            New Block
          </button>
        )}
      >
        {blocks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: showNewForm ? "16px" : 0 }}>
            {blocks.map(b => (
              <div key={b.id}>
                {editingId === b.id
                  ? <BlockForm form={blockForm} setForm={setBlockForm} onSave={saveBlock} onCancel={closeForm} saving={blockSaving} err={blockErr} isEdit />
                  : (
                    <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "12px 14px" }}
                      onMouseEnter={e => e.currentTarget.style.borderColor = "#cbd5e1"}
                      onMouseLeave={e => e.currentTarget.style.borderColor = "#e2e8f0"}>
                      <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "12px" }}>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px", flexWrap: "wrap" }}>
                            {b.title && <span style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a" }}>{b.title}</span>}
                            <span style={{ fontSize: "11px", fontWeight: 600, color: "#64748b", background: "#e2e8f0", borderRadius: "999px", padding: "1px 8px", whiteSpace: "nowrap" }}>
                              After product #{b.insert_after}{b.insert_after === 0 ? " (top)" : ""}
                            </span>
                          </div>
                          <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.6, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                            {b.content}
                          </div>
                        </div>
                        <div style={{ display: "flex", gap: "5px", flexShrink: 0 }}>
                          <button onClick={() => openEdit(b)} style={smallBtn("#eff6ff", "#2563eb")}>Edit</button>
                          <button onClick={() => deleteBlock(b.id)} style={smallBtn("#fef2f2", "#ef4444")}>Delete</button>
                        </div>
                      </div>
                    </div>
                  )
                }
              </div>
            ))}
          </div>
        )}
        {blocks.length === 0 && !showNewForm && (
          <div style={{ textAlign: "center", padding: "28px 20px", border: "1.5px dashed #e2e8f0", borderRadius: "10px" }}>
            <div style={{ fontSize: "13.5px", color: "#94a3b8" }}>No text blocks yet. Add your first one to start customising your store.</div>
          </div>
        )}
        {showNewForm && <BlockForm form={blockForm} setForm={setBlockForm} onSave={saveBlock} onCancel={closeForm} saving={blockSaving} err={blockErr} />}
      </Section>

      </div>{/* end grid */}

      {/* ── Subscription Management ── */}
      <div style={{ marginTop: "16px" }}>
        <Section icon={<SubscriptionIcon />} title="Subscription" description="Manage your monthly premium subscription and billing.">

          {/* Cancel confirmation dialog */}
          {showCancelConfirm && (
            <div style={{
              background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "10px",
              padding: "18px 20px", marginBottom: "16px",
            }}>
              <div style={{ fontWeight: 700, fontSize: "14px", color: "#b91c1c", marginBottom: "6px" }}>
                Cancel subscription?
              </div>
              <div style={{ fontSize: "13px", color: "#7f1d1d", lineHeight: 1.65, marginBottom: "14px" }}>
                Auto-renewal will be turned off. Your premium features stay active until the end of the current billing period — you won't be charged again. You can reactivate any time before then.
              </div>
              <div style={{ display: "flex", gap: "8px" }}>
                <button
                  onClick={handleCancelSubscription}
                  disabled={cancelling}
                  style={{ padding: "8px 20px", background: cancelling ? "#94a3b8" : "#b91c1c", color: "#fff", border: "none", borderRadius: "7px", fontWeight: 700, fontSize: "13px", cursor: cancelling ? "not-allowed" : "pointer", display: "flex", alignItems: "center", gap: "6px" }}
                >
                  {cancelling ? <><SpinIcon /> Cancelling…</> : "Yes, cancel subscription"}
                </button>
                <button
                  onClick={() => setShowCancelConfirm(false)}
                  style={{ padding: "8px 18px", background: "transparent", color: "#374151", border: "1px solid #d1d5db", borderRadius: "7px", fontWeight: 500, fontSize: "13px", cursor: "pointer" }}
                >
                  Keep subscription
                </button>
              </div>
            </div>
          )}

          {subLoading ? (
            <div style={{ display: "flex", alignItems: "center", gap: "10px", color: "#94a3b8", fontSize: "13px" }}>
              <SpinIcon /> Loading subscription details…
            </div>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>

              {/* Status row */}
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "12px", flexWrap: "wrap" }}>
                <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "13px", fontWeight: 600, color: "#374151" }}>Status:</span>
                    {subStatus?.status === "active" ? (
                      <span style={{ background: "#dcfce7", color: "#15803d", fontSize: "12px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px" }}>Active</span>
                    ) : subStatus?.status === "cancelled" || subStatus?.status === "non-renewing" ? (
                      <span style={{ background: "#fef3c7", color: "#92400e", fontSize: "12px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px" }}>Cancelled</span>
                    ) : subStatus?.has_subscription ? (
                      <span style={{ background: "#f1f5f9", color: "#64748b", fontSize: "12px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px" }}>{subStatus?.status || "Unknown"}</span>
                    ) : (
                      <span style={{ background: "#f1f5f9", color: "#64748b", fontSize: "12px", fontWeight: 700, padding: "2px 10px", borderRadius: "999px" }}>No recurring subscription</span>
                    )}
                  </div>
                  {subStatus?.next_payment_date && (
                    <div style={{ fontSize: "12.5px", color: "#64748b" }}>
                      Next billing: <strong style={{ color: "#374151" }}>
                        {new Date(subStatus.next_payment_date).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                      </strong>
                    </div>
                  )}
                  {shop.premium_since && (
                    <div style={{ fontSize: "12.5px", color: "#94a3b8" }}>
                      Premium since {new Date(shop.premium_since).toLocaleDateString("en-GB", { day: "2-digit", month: "long", year: "numeric" })}
                    </div>
                  )}
                </div>

                {/* Action buttons */}
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                  {subStatus?.has_subscription && (subStatus?.status === "cancelled" || subStatus?.status === "non-renewing") ? (
                    <button
                      onClick={handleReactivate}
                      disabled={reactivating}
                      style={{ display: "flex", alignItems: "center", gap: "6px", padding: "8px 18px", background: reactivating ? "#94a3b8" : "#15803d", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: reactivating ? "not-allowed" : "pointer" }}
                    >
                      {reactivating ? <><SpinIcon /> Reactivating…</> : "Reactivate Subscription"}
                    </button>
                  ) : shop.is_premium && !showCancelConfirm && (
                    <button
                      onClick={() => setShowCancelConfirm(true)}
                      style={{ padding: "8px 16px", background: "transparent", color: "#b91c1c", border: "1.5px solid #fecaca", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}
                    >
                      Cancel Subscription
                    </button>
                  )}
                </div>
              </div>

              {/* Info note */}
              {!subStatus?.has_subscription && (
                <div style={{ fontSize: "12.5px", color: "#64748b", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", padding: "10px 14px", lineHeight: 1.6 }}>
                  No recurring subscription is linked to this account. If you paid a one-time charge, contact support to set up recurring billing.
                </div>
              )}

              {/* Feedback message */}
              {subMsg && (
                <div style={{ fontSize: "13px", fontWeight: 500, color: subMsg.ok ? "#15803d" : "#b91c1c", background: subMsg.ok ? "#f0fdf4" : "#fef2f2", border: `1px solid ${subMsg.ok ? "#bbf7d0" : "#fecaca"}`, borderRadius: "8px", padding: "10px 14px" }}>
                  {subMsg.text}
                </div>
              )}

            </div>
          )}
        </Section>
      </div>

    </div>
  );
};

/* ── Helpers ── */
const btnStyle = (disabled) => ({
  padding: "9px 20px", background: disabled ? "#94a3b8" : "#0f172a", color: "#fff",
  border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "13px",
  cursor: disabled ? "not-allowed" : "pointer", whiteSpace: "nowrap", transition: "background 0.15s",
});
const smallBtn = (bg, color) => ({
  padding: "5px 11px", background: bg, color, border: "none",
  borderRadius: "6px", fontSize: "12px", fontWeight: 600, cursor: "pointer",
});

const Section = ({ icon, title, description, children, action, mb }) => (
  <div style={{ background: "#fff", border: "1px solid #e2e8f0", borderRadius: "12px", overflow: "hidden", marginBottom: mb ? "16px" : 0 }}>
    <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "16px 20px", borderBottom: "1px solid #f1f5f9", gap: "10px" }}>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", minWidth: 0 }}>
        <div style={{ width: "30px", height: "30px", borderRadius: "7px", background: "#f8fafc", border: "1px solid #e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", color: "#475569", flexShrink: 0 }}>
          {icon}
        </div>
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a" }}>{title}</div>
          {description && <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "1px", lineHeight: 1.5 }}>{description}</div>}
        </div>
      </div>
      {action && <div style={{ flexShrink: 0 }}>{action}</div>}
    </div>
    <div style={{ padding: "18px 20px" }}>{children}</div>
  </div>
);

const BlockForm = ({ form, setForm, onSave, onCancel, saving, err, isEdit }) => (
  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "16px" }}>
    <div style={{ fontWeight: 600, fontSize: "13px", color: "#0f172a", marginBottom: "14px" }}>
      {isEdit ? "Edit block" : "New text block"}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
      <div>
        <label className="sd-label">Title <span style={{ color: "#cbd5e1", fontWeight: 400 }}>(optional)</span></label>
        <input className="sd-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} placeholder="e.g. New Arrivals, Our Story, Flash Sale…" />
      </div>
      <div>
        <label className="sd-label">Content</label>
        <textarea className="sd-input" value={form.content} onChange={e => setForm(f => ({ ...f, content: e.target.value }))} placeholder="Write your message here…" rows={3} style={{ resize: "vertical", lineHeight: 1.6 }} />
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
        <div>
          <label className="sd-label">Position — show after product #</label>
          <input type="number" min={0} className="sd-input" value={form.insert_after} onChange={e => setForm(f => ({ ...f, insert_after: Math.max(0, parseInt(e.target.value) || 0) }))} style={{ width: "100px" }} />
        </div>
        <div style={{ fontSize: "12px", color: "#94a3b8", marginTop: "18px" }}>0 = before all products</div>
      </div>
    </div>
    {err && <div style={{ marginTop: "10px", fontSize: "13px", color: "#b91c1c", fontWeight: 500 }}>{err}</div>}
    <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
      <button onClick={onSave} disabled={saving} style={{ padding: "8px 20px", background: saving ? "#94a3b8" : "#0f172a", color: "#fff", border: "none", borderRadius: "7px", fontWeight: 600, fontSize: "13px", cursor: saving ? "not-allowed" : "pointer", transition: "background 0.15s" }}>
        {saving ? "Saving…" : isEdit ? "Save changes" : "Add block"}
      </button>
      <button onClick={onCancel} style={{ padding: "8px 16px", background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "7px", fontWeight: 500, fontSize: "13px", cursor: "pointer" }}>
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
  const [localShop,   setLocalShop]   = useState(null);
  const [verifying,   setVerifying]   = useState(false);
  const [verifyErr,   setVerifyErr]   = useState("");
  const location  = useLocation();
  const navigate  = useNavigate();
  const verified  = useRef(false);  // prevent double-verify

  useEffect(() => { setPageTitle("Premium Store"); }, []);
  useEffect(() => { if (shop) setLocalShop(shop); }, [shop]);

  // When Paystack redirects back, it appends ?reference=xxx&trxref=xxx
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const reference = params.get("reference") || params.get("trxref");
    if (!reference || verified.current) return;
    verified.current = true;

    // Remove query params from URL so refreshing doesn't re-trigger
    navigate("/seller/premium", { replace: true });

    setVerifying(true);
    axios.post(`${BASE}/api/shops/upgrade-premium/`, { reference }, acJson())
      .then(res => {
        setLocalShop(res.data);
        refreshShop();
      })
      .catch(e => {
        console.error("Verification error:", e.response?.status, e.response?.data);
        setVerifyErr(
          e.response?.data?.error
          || `Payment received but activation failed. Contact support with ref: ${reference}`
        );
      })
      .finally(() => setVerifying(false));
  }, [location.search]);

  const handleSuccess = (updatedShop) => {
    setLocalShop(updatedShop);
    refreshShop();
  };

  if (shopLoading || !localShop) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
      <div className="spinner-border" style={{ color: "#3b7bf8", width: "1.75rem", height: "1.75rem" }} />
    </div>
  );

  if (verifying) return (
    <div style={{ display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", padding: "80px 0", gap: "16px" }}>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
      <SpinIcon />
      <div style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a" }}>Confirming your payment…</div>
      <div style={{ fontSize: "13px", color: "#94a3b8" }}>Please wait a moment</div>
    </div>
  );

  if (verifyErr) return (
    <div style={{ maxWidth: "480px", margin: "60px auto", padding: "24px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "14px" }}>
      <div style={{ fontWeight: 700, fontSize: "15px", color: "#b91c1c", marginBottom: "8px" }}>Activation issue</div>
      <div style={{ fontSize: "13.5px", color: "#b91c1c", lineHeight: 1.65 }}>{verifyErr}</div>
      <button onClick={() => setVerifyErr("")} style={{ marginTop: "16px", background: "#0f172a", color: "#fff", border: "none", borderRadius: "8px", padding: "9px 20px", fontWeight: 600, fontSize: "13px", cursor: "pointer" }}>
        Try Again
      </button>
    </div>
  );

  return localShop.is_premium
    ? <ManagePage shop={localShop} onShopUpdate={setLocalShop} />
    : <UpgradePage onSuccess={handleSuccess} />;
};

export default SellerPremium;
