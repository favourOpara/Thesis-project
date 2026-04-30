import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import { useSellerCtx, ac, BASE } from "../components/SellerLayout";

const PAYSTACK_PUBLIC_KEY = "pk_test_27446758f70fd23b21f8fc39f3c5356c629443da";
const PREMIUM_AMOUNT_KOBO = 1000000; // ₦10,000

/* ── Load Paystack script once ── */
const loadPaystack = () =>
  new Promise((resolve) => {
    if (window.PaystackPop) return resolve();
    const script = document.createElement("script");
    script.src = "https://js.paystack.co/v1/inline.js";
    script.onload = resolve;
    document.head.appendChild(script);
  });

/* ── Feature list shown on upgrade page ── */
const FEATURES = [
  { icon: "🎬", title: "Promo Video", desc: "Embed a YouTube or Vimeo video right on your storefront." },
  { icon: "✍️", title: "Editorial Text Blocks", desc: "Place custom text between products — tell your brand story." },
  { icon: "⭐", title: "Premium Badge", desc: "Stand out with a verified premium seller badge on your store." },
  { icon: "📈", title: "Priority Visibility", desc: "Your store gets boosted in browse & recommendation sections." },
];

/* ══════════════════════════════════════════
   UPGRADE PAGE (not yet premium)
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
          // Verify with backend
          try {
            const res = await axios.post(
              `${BASE}/api/shops/upgrade-premium/`,
              { reference: transaction.reference },
              ac()
            );
            onSuccess(res.data);
          } catch (e) {
            setErr(e.response?.data?.error || "Verification failed. Contact support.");
          } finally {
            setPaying(false);
          }
        },
        onCancel: () => {
          setPaying(false);
        },
      });
      handler.openIframe();
    } catch {
      setErr("Could not load payment. Check your connection and try again.");
      setPaying(false);
    }
  };

  return (
    <div style={{ maxWidth: "640px", margin: "0 auto" }}>
      {/* Hero */}
      <div style={{
        background: "linear-gradient(135deg, #1e1b4b 0%, #312e81 50%, #4c1d95 100%)",
        borderRadius: "20px", padding: "40px 32px", textAlign: "center",
        marginBottom: "28px", position: "relative", overflow: "hidden",
      }}>
        {/* Decorative circles */}
        <div style={{
          position: "absolute", top: "-40px", right: "-40px",
          width: "160px", height: "160px", borderRadius: "50%",
          background: "rgba(245,158,11,0.12)",
        }} />
        <div style={{
          position: "absolute", bottom: "-30px", left: "-30px",
          width: "120px", height: "120px", borderRadius: "50%",
          background: "rgba(139,92,246,0.15)",
        }} />
        <div style={{ fontSize: "48px", marginBottom: "12px" }}>👑</div>
        <h2 style={{
          color: "#fff", fontWeight: 800, fontSize: "26px",
          margin: "0 0 8px", letterSpacing: "-0.02em",
        }}>
          Unlock Premium Store
        </h2>
        <p style={{ color: "#c4b5fd", fontSize: "15px", margin: "0 0 24px", lineHeight: 1.6 }}>
          Give your store a personality. Add videos, text, and creative flair
          that makes buyers remember you.
        </p>
        <div style={{
          display: "inline-flex", alignItems: "baseline", gap: "4px",
          background: "rgba(255,255,255,0.1)", borderRadius: "12px",
          padding: "10px 24px", border: "1px solid rgba(255,255,255,0.2)",
        }}>
          <span style={{ fontSize: "13px", color: "#a5b4fc" }}>₦</span>
          <span style={{ fontSize: "36px", fontWeight: 900, color: "#fff" }}>10,000</span>
          <span style={{ fontSize: "13px", color: "#a5b4fc" }}>/month</span>
        </div>
      </div>

      {/* Features */}
      <div style={{
        display: "grid", gridTemplateColumns: "1fr 1fr",
        gap: "14px", marginBottom: "28px",
      }} className="premium-feature-grid">
        {FEATURES.map(f => (
          <div key={f.title} style={{
            background: "#fff", border: "1px solid #e2e8f0",
            borderRadius: "12px", padding: "18px 16px",
          }}>
            <div style={{ fontSize: "24px", marginBottom: "8px" }}>{f.icon}</div>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#0f172a", marginBottom: "4px" }}>{f.title}</div>
            <div style={{ fontSize: "13px", color: "#64748b", lineHeight: 1.5 }}>{f.desc}</div>
          </div>
        ))}
      </div>

      {/* Error */}
      {err && (
        <div style={{
          background: "#fef2f2", border: "1.5px solid #fca5a5",
          borderRadius: "10px", padding: "12px 16px", marginBottom: "16px",
          fontSize: "13.5px", color: "#b91c1c",
        }}>
          {err}
        </div>
      )}

      {/* CTA */}
      <button
        onClick={handleUpgrade}
        disabled={paying}
        style={{
          width: "100%", padding: "16px",
          background: paying
            ? "#6b7280"
            : "linear-gradient(135deg, #f59e0b 0%, #ef4444 100%)",
          color: "#fff", border: "none", borderRadius: "12px",
          fontWeight: 800, fontSize: "16px", cursor: paying ? "not-allowed" : "pointer",
          boxShadow: paying ? "none" : "0 4px 20px rgba(245,158,11,0.35)",
          transition: "all 0.2s",
        }}
      >
        {paying ? "Processing…" : "Upgrade to Premium — ₦10,000/mo"}
      </button>
      <p style={{
        textAlign: "center", fontSize: "12px", color: "#94a3b8",
        marginTop: "10px",
      }}>
        Secure payment via Paystack · Cancel any time
      </p>

      <style>{`
        @media (max-width: 480px) {
          .premium-feature-grid { grid-template-columns: 1fr !important; }
        }
      `}</style>
    </div>
  );
};

/* ══════════════════════════════════════════
   MANAGE PAGE (already premium)
══════════════════════════════════════════ */
const ManagePage = ({ shop, onShopUpdate }) => {
  const [videoUrl, setVideoUrl] = useState(shop.store_video_url || "");
  const [videoSaving, setVideoSaving] = useState(false);
  const [videoMsg, setVideoMsg] = useState("");

  const [blocks, setBlocks] = useState(shop.text_blocks || []);
  const [blockForm, setBlockForm] = useState({ title: "", content: "", insert_after: 0 });
  const [editingBlock, setEditingBlock] = useState(null); // id of block being edited
  const [blockSaving, setBlockSaving] = useState(false);
  const [blockErr, setBlockErr] = useState("");

  const saveVideo = async () => {
    setVideoSaving(true);
    setVideoMsg("");
    try {
      await axios.patch(`${BASE}/api/shops/${shop.slug}/update-video/`, { store_video_url: videoUrl }, ac());
      setVideoMsg("Saved!");
      onShopUpdate({ ...shop, store_video_url: videoUrl });
    } catch {
      setVideoMsg("Save failed. Try again.");
    } finally {
      setVideoSaving(false);
      setTimeout(() => setVideoMsg(""), 3000);
    }
  };

  const startEdit = (block) => {
    setEditingBlock(block.id);
    setBlockForm({ title: block.title || "", content: block.content, insert_after: block.insert_after });
    setBlockErr("");
  };

  const cancelEdit = () => {
    setEditingBlock(null);
    setBlockForm({ title: "", content: "", insert_after: 0 });
    setBlockErr("");
  };

  const saveBlock = async () => {
    if (!blockForm.content.trim()) {
      setBlockErr("Content is required.");
      return;
    }
    setBlockSaving(true);
    setBlockErr("");
    try {
      if (editingBlock) {
        const res = await axios.patch(
          `${BASE}/api/shops/${shop.slug}/text-blocks/${editingBlock}/`,
          blockForm, ac()
        );
        setBlocks(prev => prev.map(b => b.id === editingBlock ? res.data : b));
      } else {
        const res = await axios.post(
          `${BASE}/api/shops/${shop.slug}/text-blocks/`,
          blockForm, ac()
        );
        setBlocks(prev => [...prev, res.data]);
      }
      cancelEdit();
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
      setBlocks(prev => prev.filter(b => b.id !== id));
    } catch {
      alert("Delete failed.");
    }
  };

  return (
    <div style={{ maxWidth: "680px", margin: "0 auto" }}>
      {/* Premium badge */}
      <div style={{
        display: "flex", alignItems: "center", gap: "10px",
        background: "linear-gradient(135deg,#f0fdf4,#dcfce7)",
        border: "1.5px solid #86efac", borderRadius: "12px",
        padding: "14px 18px", marginBottom: "28px",
      }}>
        <span style={{ fontSize: "24px" }}>👑</span>
        <div>
          <div style={{ fontWeight: 700, fontSize: "14px", color: "#15803d" }}>Premium Store Active</div>
          <div style={{ fontSize: "12px", color: "#16a34a" }}>
            Since {new Date(shop.premium_since).toLocaleDateString("en-GB", { day: "2-digit", month: "short", year: "numeric" })}
          </div>
        </div>
      </div>

      {/* Video URL section */}
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0",
        borderRadius: "12px", padding: "20px", marginBottom: "20px",
      }}>
        <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a", margin: "0 0 6px" }}>
          🎬 Promo Video
        </h3>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 14px" }}>
          Paste a YouTube or Vimeo URL. It will appear on your store page right after your profile section.
        </p>
        <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
          <input
            type="url"
            value={videoUrl}
            onChange={e => setVideoUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            className="sd-input"
            style={{ flex: 1 }}
          />
          <button
            onClick={saveVideo}
            disabled={videoSaving}
            style={{
              padding: "9px 18px", background: "#2563eb", color: "#fff",
              border: "none", borderRadius: "8px", fontWeight: 600,
              fontSize: "13px", cursor: videoSaving ? "not-allowed" : "pointer",
              whiteSpace: "nowrap", opacity: videoSaving ? 0.7 : 1,
            }}
          >
            {videoSaving ? "Saving…" : "Save"}
          </button>
        </div>
        {videoMsg && (
          <div style={{
            marginTop: "8px", fontSize: "13px",
            color: videoMsg === "Saved!" ? "#15803d" : "#b91c1c",
            fontWeight: 600,
          }}>
            {videoMsg}
          </div>
        )}
        {videoUrl && (
          <div style={{ marginTop: "10px", fontSize: "12px", color: "#94a3b8" }}>
            Preview on your{" "}
            <a href={`/shop/${shop.slug}`} target="_blank" rel="noreferrer"
              style={{ color: "#2563eb" }}>
              store page →
            </a>
          </div>
        )}
      </div>

      {/* Text blocks section */}
      <div style={{
        background: "#fff", border: "1px solid #e2e8f0",
        borderRadius: "12px", padding: "20px",
      }}>
        <h3 style={{ fontWeight: 700, fontSize: "15px", color: "#0f172a", margin: "0 0 6px" }}>
          ✍️ Text Blocks
        </h3>
        <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 18px" }}>
          Add editorial text that appears between your products. Use the "Show after product #" field
          to choose placement (0 = before all products).
        </p>

        {/* Existing blocks */}
        {blocks.length > 0 && (
          <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginBottom: "20px" }}>
            {[...blocks].sort((a, b) => a.insert_after - b.insert_after || a.id - b.id).map(block => (
              <div key={block.id}>
                {editingBlock === block.id ? (
                  <BlockForm
                    form={blockForm}
                    setForm={setBlockForm}
                    onSave={saveBlock}
                    onCancel={cancelEdit}
                    saving={blockSaving}
                    err={blockErr}
                    isEdit
                  />
                ) : (
                  <div style={{
                    background: "#fefce8", border: "1px solid #fde68a",
                    borderLeft: "4px solid #f59e0b", borderRadius: "8px", padding: "12px 14px",
                  }}>
                    <div style={{ display: "flex", alignItems: "flex-start", justifyContent: "space-between", gap: "10px" }}>
                      <div style={{ flex: 1, minWidth: 0 }}>
                        {block.title && (
                          <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#92400e", marginBottom: "3px" }}>
                            {block.title}
                          </div>
                        )}
                        <div style={{ fontSize: "13px", color: "#78350f", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
                          {block.content.length > 120 ? block.content.slice(0, 120) + "…" : block.content}
                        </div>
                        <div style={{ fontSize: "11.5px", color: "#a16207", marginTop: "6px" }}>
                          Shows after product #{block.insert_after}
                          {block.insert_after === 0 ? " (before all products)" : ""}
                        </div>
                      </div>
                      <div style={{ display: "flex", gap: "6px", flexShrink: 0 }}>
                        <button
                          onClick={() => startEdit(block)}
                          style={{
                            padding: "5px 10px", background: "#eff6ff", color: "#2563eb",
                            border: "none", borderRadius: "6px", fontSize: "12px",
                            fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => deleteBlock(block.id)}
                          style={{
                            padding: "5px 10px", background: "#fef2f2", color: "#ef4444",
                            border: "none", borderRadius: "6px", fontSize: "12px",
                            fontWeight: 600, cursor: "pointer",
                          }}
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            ))}
          </div>
        )}

        {/* New block form */}
        {!editingBlock && (
          <BlockForm
            form={blockForm}
            setForm={setBlockForm}
            onSave={saveBlock}
            onCancel={() => setBlockForm({ title: "", content: "", insert_after: 0 })}
            saving={blockSaving}
            err={blockErr}
          />
        )}
      </div>
    </div>
  );
};

/* ── Shared block form ── */
const BlockForm = ({ form, setForm, onSave, onCancel, saving, err, isEdit }) => (
  <div style={{
    background: "#f8fafc", border: "1.5px dashed #cbd5e1",
    borderRadius: "10px", padding: "16px",
  }}>
    <div style={{ fontWeight: 600, fontSize: "13px", color: "#475569", marginBottom: "12px" }}>
      {isEdit ? "Edit Text Block" : "Add New Text Block"}
    </div>
    <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
      <div>
        <label className="sd-label">Title (optional)</label>
        <input
          className="sd-input"
          value={form.title}
          onChange={e => setForm(f => ({ ...f, title: e.target.value }))}
          placeholder="e.g. Our Story, Sale Alert, New Arrivals…"
        />
      </div>
      <div>
        <label className="sd-label">Content *</label>
        <textarea
          className="sd-input"
          value={form.content}
          onChange={e => setForm(f => ({ ...f, content: e.target.value }))}
          placeholder="Write something about your brand, a promotion, or any note for shoppers…"
          rows={4}
          style={{ resize: "vertical" }}
        />
      </div>
      <div>
        <label className="sd-label">Show after product #</label>
        <input
          type="number"
          min={0}
          className="sd-input"
          value={form.insert_after}
          onChange={e => setForm(f => ({ ...f, insert_after: parseInt(e.target.value) || 0 }))}
          style={{ width: "120px" }}
        />
        <span style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "10px" }}>
          0 = before all products
        </span>
      </div>
    </div>
    {err && (
      <div style={{ marginTop: "10px", fontSize: "13px", color: "#b91c1c" }}>{err}</div>
    )}
    <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
      <button
        onClick={onSave}
        disabled={saving}
        style={{
          padding: "8px 20px", background: "#2563eb", color: "#fff",
          border: "none", borderRadius: "7px", fontWeight: 600,
          fontSize: "13px", cursor: saving ? "not-allowed" : "pointer",
          opacity: saving ? 0.7 : 1,
        }}
      >
        {saving ? "Saving…" : isEdit ? "Update Block" : "Add Block"}
      </button>
      {isEdit && (
        <button
          onClick={onCancel}
          style={{
            padding: "8px 16px", background: "#f1f5f9", color: "#64748b",
            border: "none", borderRadius: "7px", fontWeight: 600,
            fontSize: "13px", cursor: "pointer",
          }}
        >
          Cancel
        </button>
      )}
    </div>
  </div>
);

/* ══════════════════════════════════════════
   MAIN EXPORT
══════════════════════════════════════════ */
const SellerPremium = () => {
  const { shop, shopLoading, refreshShop, setPageTitle } = useSellerCtx();
  const [localShop, setLocalShop] = useState(null);

  useEffect(() => {
    setPageTitle("Premium Store");
  }, []);

  useEffect(() => {
    if (shop) setLocalShop(shop);
  }, [shop]);

  const handleSuccess = (updatedShop) => {
    setLocalShop(updatedShop);
    refreshShop();
  };

  if (shopLoading || !localShop) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "80px 0" }}>
      <div className="spinner-border" style={{ color: "#3b7bf8", width: "2rem", height: "2rem" }} />
    </div>
  );

  return localShop.is_premium
    ? <ManagePage shop={localShop} onShopUpdate={setLocalShop} />
    : <UpgradePage onSuccess={handleSuccess} />;
};

export default SellerPremium;
