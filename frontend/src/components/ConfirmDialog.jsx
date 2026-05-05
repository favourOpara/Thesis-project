import React, { useEffect } from "react";
import { createPortal } from "react-dom";

/**
 * Custom confirm dialog — replaces window.confirm().
 *
 * Props:
 *   open          boolean
 *   title         string
 *   message       string
 *   confirmLabel  string  (default "Delete")
 *   confirmColor  string  (default "#ef4444")
 *   onConfirm     () => void
 *   onCancel      () => void
 */
const ConfirmDialog = ({ open, title, message, confirmLabel = "Delete", confirmColor = "#ef4444", onConfirm, onCancel }) => {
  useEffect(() => {
    if (!open) return;
    const handler = (e) => { if (e.key === "Escape") onCancel(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, [open, onCancel]);

  if (!open) return null;

  return createPortal(
    <div
      onClick={onCancel}
      style={{
        position: "fixed", inset: 0, zIndex: 99999,
        background: "rgba(0,0,0,0.45)",
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        backdropFilter: "blur(2px)",
      }}
    >
      <div
        onClick={e => e.stopPropagation()}
        style={{
          background: "#fff",
          borderRadius: "16px",
          padding: "28px 28px 24px",
          maxWidth: "400px",
          width: "100%",
          boxShadow: "0 20px 60px rgba(0,0,0,0.2)",
          animation: "cd-pop 0.18s cubic-bezier(0.34,1.56,0.64,1)",
        }}
      >
        <style>{`@keyframes cd-pop { from { opacity:0; transform:scale(0.92) } to { opacity:1; transform:scale(1) } }`}</style>

        {/* Icon */}
        <div style={{
          width: "44px", height: "44px", borderRadius: "12px",
          background: confirmColor === "#ef4444" ? "#fee2e2" : "#eff6ff",
          display: "flex", alignItems: "center", justifyContent: "center",
          marginBottom: "16px",
        }}>
          {confirmColor === "#ef4444"
            ? <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#ef4444" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6l-1 14a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2L5 6"/><path d="M10 11v6"/><path d="M14 11v6"/><path d="M9 6V4h6v2"/></svg>
            : <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v14a2 2 0 0 1-2 2z"/><polyline points="17 21 17 13 7 13 7 21"/><polyline points="7 3 7 8 15 8"/></svg>
          }
        </div>

        <h3 style={{ fontWeight: 700, fontSize: "16px", color: "#0f172a", margin: "0 0 8px" }}>{title}</h3>
        <p style={{ fontSize: "13.5px", color: "#64748b", margin: "0 0 24px", lineHeight: 1.6 }}>{message}</p>

        <div style={{ display: "flex", gap: "10px" }}>
          <button
            onClick={onCancel}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px",
              border: "1.5px solid #e2e8f0", background: "#fff",
              fontSize: "13.5px", fontWeight: 600, color: "#374151",
              cursor: "pointer", transition: "background 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.background = "#f8fafc"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "#fff"; }}
          >
            Cancel
          </button>
          <button
            onClick={onConfirm}
            style={{
              flex: 1, padding: "10px", borderRadius: "10px",
              border: "none", background: confirmColor,
              fontSize: "13.5px", fontWeight: 700, color: "#fff",
              cursor: "pointer", transition: "opacity 0.12s",
            }}
            onMouseEnter={e => { e.currentTarget.style.opacity = "0.88"; }}
            onMouseLeave={e => { e.currentTarget.style.opacity = "1"; }}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
};

export default ConfirmDialog;
