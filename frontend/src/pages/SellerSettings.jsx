import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSellerCtx, ac, BASE, IconExternal } from "../components/SellerLayout";

/* ── Custom styled dropdown ── */
const SortDropdown = ({ value, onChange }) => {
  const [open, setOpen] = useState(false);
  const ref = useRef();

  const options = [
    { value: "newest",     label: "Newest First",        icon: "✦" },
    { value: "price_asc",  label: "Price: Low to High",  icon: "↑" },
    { value: "price_desc", label: "Price: High to Low",  icon: "↓" },
  ];

  const selected = options.find(o => o.value === value) || options[0];

  useEffect(() => {
    const handler = e => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative" }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between",
          padding: "10px 14px", borderRadius: "10px",
          border: `1.5px solid ${open ? "#2563eb" : "#e2e8f0"}`,
          background: "#fff", cursor: "pointer",
          fontSize: "13.5px", color: "#0f172a", fontWeight: 500,
          transition: "border-color 0.15s",
        }}
      >
        <span style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: 700, width: "14px" }}>{selected.icon}</span>
          {selected.label}
        </span>
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#94a3b8" strokeWidth="2.5"
          style={{ transform: open ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.2s", flexShrink: 0 }}>
          <polyline points="6 9 12 15 18 9"/>
        </svg>
      </button>

      {open && (
        <div style={{
          position: "absolute", top: "calc(100% + 6px)", left: 0, right: 0, zIndex: 50,
          background: "#fff", borderRadius: "12px",
          border: "1.5px solid #e2e8f0",
          boxShadow: "0 8px 24px rgba(0,0,0,0.1)",
          overflow: "hidden",
        }}>
          {options.map(opt => (
            <button
              key={opt.value}
              type="button"
              onClick={() => { onChange(opt.value); setOpen(false); }}
              style={{
                width: "100%", display: "flex", alignItems: "center", gap: "10px",
                padding: "11px 14px", background: opt.value === value ? "#eff6ff" : "#fff",
                border: "none", cursor: "pointer", fontSize: "13.5px",
                color: opt.value === value ? "#2563eb" : "#374151",
                fontWeight: opt.value === value ? 600 : 400,
                textAlign: "left", transition: "background 0.12s",
              }}
              onMouseEnter={e => { if (opt.value !== value) e.currentTarget.style.background = "#f8fafc"; }}
              onMouseLeave={e => { if (opt.value !== value) e.currentTarget.style.background = "#fff"; }}
            >
              <span style={{ fontSize: "12px", color: "#2563eb", fontWeight: 700, width: "14px" }}>{opt.icon}</span>
              {opt.label}
              {opt.value === value && (
                <svg style={{ marginLeft: "auto" }} width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#2563eb" strokeWidth="2.5">
                  <polyline points="20 6 9 17 4 12"/>
                </svg>
              )}
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

/* ── Lock icon for private fields ── */
const LockIcon = () => (
  <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
    <rect x="3" y="11" width="18" height="11" rx="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/>
  </svg>
);

const SellerSettings = () => {
  const { shop, refreshShop, setPageTitle, setTopbarActions } = useSellerCtx();

  const [form, setForm] = useState({
    name:                 shop?.name                 || "",
    description:          shop?.description          || "",
    tagline:              shop?.tagline              || "",
    whatsapp:             shop?.whatsapp             || "",
    instagram:            shop?.instagram            || "",
    website:              shop?.website              || "",
    layout_mode:          shop?.layout_mode          || "all",
    sort_order:           shop?.sort_order           || "newest",
    store_status:         shop?.store_status         || "open",
    store_status_message: shop?.store_status_message || "",
    phone_number:         "",
    address:              "",
  });
  const [logo,   setLogo]   = useState(null);
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const [status, setStatus] = useState(null);
  const logoRef   = useRef();
  const bannerRef = useRef();
  const isNew = !shop;

  useEffect(() => {
    setPageTitle("Store Settings");
    setTopbarActions(
      shop
        ? <Link to={`/shop/${shop.slug}`} target="_blank" className="sd-btn-primary">
            <IconExternal /> Preview Store
          </Link>
        : null
    );
    return () => setTopbarActions(null);
  }, [shop]);

  // Sync shop fields when shop loads
  useEffect(() => {
    if (shop) {
      setForm(f => ({
        ...f,
        name:                 shop.name                 || "",
        description:          shop.description          || "",
        tagline:              shop.tagline              || "",
        whatsapp:             shop.whatsapp             || "",
        instagram:            shop.instagram            || "",
        website:              shop.website              || "",
        layout_mode:          shop.layout_mode          || "all",
        sort_order:           shop.sort_order           || "newest",
        store_status:         shop.store_status         || "open",
        store_status_message: shop.store_status_message || "",
      }));
    }
  }, [shop]);

  // Load private user fields (phone + address)
  useEffect(() => {
    axios.get(`${BASE}/api/user-info/`, ac())
      .then(r => setForm(f => ({
        ...f,
        phone_number: r.data.phone_number || "",
        address:      r.data.address      || "",
      })))
      .catch(() => {});
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);

    const fd = new FormData();
    const userFields = ["phone_number", "address"];
    Object.entries(form).forEach(([k, v]) => {
      if (userFields.includes(k)) return; // handled separately
      if (v) fd.append(k, v);
    });
    if (logo)   fd.append("logo", logo);
    if (banner) fd.append("banner_image", banner);

    try {
      // Save shop data
      if (isNew) {
        await axios.post(`${BASE}/api/shops/`, fd, ac());
      } else {
        await axios.patch(`${BASE}/api/shops/${shop.slug}/`, fd, ac());
      }

      // Save private user fields
      await axios.put(`${BASE}/api/update-profile/`, {
        phone_number: form.phone_number,
        address:      form.address,
      }, ac());

      setStatus({ ok: true, msg: isNew ? "Store created successfully." : "Changes saved." });
      refreshShop();
    } catch (err) {
      const d = err.response?.data;
      setStatus({ ok: false, msg: typeof d === "object" ? JSON.stringify(d) : "Something went wrong." });
    } finally {
      setSaving(false);
    }
  };

  const PreviewImage = ({ file, existing, style }) => {
    if (file) return <img src={URL.createObjectURL(file)} alt="preview" style={{ ...style, objectFit: "cover", display: "block" }} />;
    if (existing) return <img src={existing} alt="current" style={{ ...style, objectFit: "cover", display: "block" }} />;
    return <span style={{ color: "#94a3b8", fontSize: "12.5px" }}>Click to upload</span>;
  };

  return (
    <div>
      <h2 style={{ fontWeight: 800, fontSize: "20px", color: "#0f172a", margin: "0 0 20px" }}>
        {isNew ? "Create Your Store" : "Store Settings"}
      </h2>

      {status && (
        <div className={`sd-alert ${status.ok ? "success" : "error"}`} style={{ marginBottom: "16px" }}>
          <span style={{ fontSize: "13.5px", fontWeight: 500 }}>{status.msg}</span>
        </div>
      )}

      <form onSubmit={handleSubmit}>
        <div className="sd-form-grid">
          <div className="sd-form-full">
            <label className="sd-label">Store Name *</label>
            <input className="sd-input-line" name="name" value={form.name}
              onChange={handleChange} placeholder="e.g. Ade Fashion House" required />
          </div>
          <div className="sd-form-full">
            <label className="sd-label">Description</label>
            <textarea className="sd-input" name="description" value={form.description}
              onChange={handleChange} placeholder="Describe what you sell..."
              rows={3} style={{ resize: "vertical" }} />
          </div>
        </div>

        <hr className="sd-divider" />
        <p className="sd-section-label">Branding</p>

        <div className="sd-form-grid" style={{ marginBottom: "0" }}>
          <div>
            <label className="sd-label">Store Logo</label>
            <div className="sd-upload-zone" onClick={() => logoRef.current.click()}
              style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PreviewImage file={logo} existing={shop?.logo_url} style={{ height: "60px", borderRadius: "6px" }} />
            </div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => setLogo(e.target.files[0])} />
          </div>
          <div>
            <label className="sd-label">Banner Image</label>
            <div className="sd-upload-zone" onClick={() => bannerRef.current.click()}
              style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <PreviewImage file={banner} existing={shop?.banner_url}
                style={{ height: "60px", width: "100%", borderRadius: "6px" }} />
            </div>
            <input ref={bannerRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => setBanner(e.target.files[0])} />
          </div>
        </div>

        <hr className="sd-divider" />
        <p className="sd-section-label">Contact & Social</p>

        <div className="sd-form-grid">
          <div>
            <label className="sd-label">WhatsApp Number</label>
            <input className="sd-input-line" name="whatsapp" value={form.whatsapp}
              onChange={handleChange} placeholder="+2348012345678" />
          </div>
          <div>
            <label className="sd-label">Instagram Handle</label>
            <input className="sd-input-line" name="instagram" value={form.instagram}
              onChange={handleChange} placeholder="yourhandle (no @)" />
          </div>
          <div className="sd-form-full">
            <label className="sd-label">Website</label>
            <input className="sd-input-line" name="website" value={form.website}
              onChange={handleChange} placeholder="https://yourwebsite.com" />
          </div>
        </div>

        {/* Private delivery info */}
        <div style={{
          background: "#f8fafc", borderRadius: "12px",
          border: "1px solid #e2e8f0", padding: "16px 20px",
          marginTop: "8px",
        }}>
          <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "4px" }}>
            <LockIcon />
            <span style={{ fontSize: "12px", fontWeight: 700, color: "#475569", letterSpacing: "0.3px" }}>
              PRIVATE — NOT VISIBLE TO BUYERS
            </span>
          </div>
          <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 16px", lineHeight: 1.5 }}>
            Used internally for package delivery only. Buyers will never see this information.
          </p>
          <div className="sd-form-grid" style={{ margin: 0 }}>
            <div>
              <label className="sd-label">Phone Number</label>
              <input className="sd-input-line" name="phone_number" value={form.phone_number}
                onChange={handleChange} placeholder="+2348012345678" />
            </div>
            <div>
              <label className="sd-label">Delivery Address</label>
              <input className="sd-input-line" name="address" value={form.address}
                onChange={handleChange} placeholder="Your address for deliveries" />
            </div>
          </div>
        </div>

        <hr className="sd-divider" />
        <p className="sd-section-label">Storefront Controls</p>

        <div className="sd-form-grid">
          <div className="sd-form-full">
            <label className="sd-label">Store Tagline</label>
            <input className="sd-input-line" name="tagline" value={form.tagline}
              onChange={handleChange} placeholder="e.g. Quality fashion, delivered fast" maxLength={120} />
            <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
              Shows under your store name on your public page. Max 120 characters.
            </span>
          </div>

          <div>
            <label className="sd-label">Product Layout</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
              {[
                { value: "all",        label: "All Products", desc: "Show every product in a single grid" },
                { value: "categories", label: "By Category",  desc: "Group products under category tabs" },
              ].map(opt => (
                <label key={opt.value} style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                  <input type="radio" name="layout_mode" value={opt.value}
                    checked={form.layout_mode === opt.value} onChange={handleChange}
                    style={{ marginTop: "3px", accentColor: "#2563eb" }} />
                  <span>
                    <span style={{ fontWeight: 400, fontSize: "13.5px", color: "#374151" }}>{opt.label}</span>
                    <span style={{ display: "block", fontSize: "12px", color: "#94a3b8" }}>{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          <div>
            <label className="sd-label" style={{ marginBottom: "8px", display: "block" }}>Default Sort Order</label>
            <SortDropdown
              value={form.sort_order}
              onChange={val => setForm(f => ({ ...f, sort_order: val }))}
            />
          </div>
        </div>

        <hr className="sd-divider" />
        <p className="sd-section-label">Store Status</p>

        <div className="sd-form-grid">
          <div>
            <label className="sd-label">Store Status</label>
            <div style={{ display: "flex", gap: "16px", marginTop: "6px" }}>
              {[
                { value: "open",   label: "Open",               color: "#16a34a" },
                { value: "closed", label: "Temporarily Closed", color: "#dc2626" },
              ].map(opt => (
                <label key={opt.value} style={{ display: "flex", alignItems: "center", gap: "8px", cursor: "pointer" }}>
                  <input type="radio" name="store_status" value={opt.value}
                    checked={form.store_status === opt.value} onChange={handleChange}
                    style={{ accentColor: opt.color }} />
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: opt.color }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {form.store_status === "closed" && (
            <div className="sd-form-full">
              <label className="sd-label">Closed Message</label>
              <input className="sd-input" name="store_status_message" value={form.store_status_message}
                onChange={handleChange} placeholder="e.g. Back on Monday — orders are paused for now."
                maxLength={200} />
              <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                Shown to buyers as a banner on your store page.
              </span>
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <button type="submit" className="sd-btn-primary" disabled={saving}
            style={{
              width: "100%", justifyContent: "center",
              padding: "11px", fontSize: "14px",
              opacity: saving ? 0.7 : 1,
              cursor: saving ? "not-allowed" : "pointer",
            }}
          >
            {saving ? "Saving…" : isNew ? "Create Store" : "Save Changes"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default SellerSettings;
