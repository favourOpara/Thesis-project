import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSellerCtx, ac, BASE, IconExternal } from "../components/SellerLayout";

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

  // Sync form when shop loads
  useEffect(() => {
    if (shop) {
      setForm({
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
      });
    }
  }, [shop]);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();
    setSaving(true);
    setStatus(null);
    const fd = new FormData();
    Object.entries(form).forEach(([k, v]) => { if (v) fd.append(k, v); });
    if (logo)   fd.append("logo", logo);
    if (banner) fd.append("banner_image", banner);

    try {
      if (isNew) {
        await axios.post(`${BASE}/api/shops/`, fd, ac());
        setStatus({ ok: true, msg: "Store created successfully." });
      } else {
        await axios.patch(`${BASE}/api/shops/${shop.slug}/`, fd, ac());
        setStatus({ ok: true, msg: "Changes saved." });
      }
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
            <input
              className="sd-input"
              name="name"
              value={form.name}
              onChange={handleChange}
              placeholder="e.g. Ade Fashion House"
              required
            />
          </div>
          <div className="sd-form-full">
            <label className="sd-label">Description</label>
            <textarea
              className="sd-input"
              name="description"
              value={form.description}
              onChange={handleChange}
              placeholder="Describe what you sell..."
              rows={3}
              style={{ resize: "vertical" }}
            />
          </div>
        </div>

        <hr className="sd-divider" />
        <p className="sd-section-label">Branding</p>

        <div className="sd-form-grid" style={{ marginBottom: "0" }}>
          <div>
            <label className="sd-label">Store Logo</label>
            <div
              className="sd-upload-zone"
              onClick={() => logoRef.current.click()}
              style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
              <PreviewImage file={logo} existing={shop?.logo_url} style={{ height: "60px", borderRadius: "6px" }} />
            </div>
            <input ref={logoRef} type="file" accept="image/*" style={{ display: "none" }}
              onChange={e => setLogo(e.target.files[0])} />
          </div>
          <div>
            <label className="sd-label">Banner Image</label>
            <div
              className="sd-upload-zone"
              onClick={() => bannerRef.current.click()}
              style={{ minHeight: "80px", display: "flex", alignItems: "center", justifyContent: "center" }}
            >
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
            <input className="sd-input" name="whatsapp" value={form.whatsapp}
              onChange={handleChange} placeholder="+2348012345678" />
          </div>
          <div>
            <label className="sd-label">Instagram Handle</label>
            <input className="sd-input" name="instagram" value={form.instagram}
              onChange={handleChange} placeholder="yourhandle (no @)" />
          </div>
          <div className="sd-form-full">
            <label className="sd-label">Website</label>
            <input className="sd-input" name="website" value={form.website}
              onChange={handleChange} placeholder="https://yourwebsite.com" />
          </div>
        </div>

        <hr className="sd-divider" />
        <p className="sd-section-label">Storefront Controls</p>

        <div className="sd-form-grid">
          {/* Tagline */}
          <div className="sd-form-full">
            <label className="sd-label">Store Tagline</label>
            <input
              className="sd-input"
              name="tagline"
              value={form.tagline}
              onChange={handleChange}
              placeholder="e.g. Quality fashion, delivered fast"
              maxLength={120}
            />
            <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
              Shows under your store name on your public page. Max 120 characters.
            </span>
          </div>

          {/* Layout mode */}
          <div>
            <label className="sd-label">Product Layout</label>
            <div style={{ display: "flex", flexDirection: "column", gap: "10px", marginTop: "6px" }}>
              {[
                { value: "all", label: "All Products", desc: "Show every product in a single grid" },
                { value: "categories", label: "By Category", desc: "Group products under category tabs" },
              ].map(opt => (
                <label key={opt.value} style={{ display: "flex", alignItems: "flex-start", gap: "10px", cursor: "pointer" }}>
                  <input
                    type="radio"
                    name="layout_mode"
                    value={opt.value}
                    checked={form.layout_mode === opt.value}
                    onChange={handleChange}
                    style={{ marginTop: "3px", accentColor: "#2563eb" }}
                  />
                  <span>
                    <span style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a" }}>{opt.label}</span>
                    <span style={{ display: "block", fontSize: "12px", color: "#64748b" }}>{opt.desc}</span>
                  </span>
                </label>
              ))}
            </div>
          </div>

          {/* Sort order */}
          <div>
            <label className="sd-label">Default Sort Order</label>
            <select
              className="sd-input"
              name="sort_order"
              value={form.sort_order}
              onChange={handleChange}
            >
              <option value="newest">Newest First</option>
              <option value="price_asc">Price: Low to High</option>
              <option value="price_desc">Price: High to Low</option>
            </select>
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
                  <input
                    type="radio"
                    name="store_status"
                    value={opt.value}
                    checked={form.store_status === opt.value}
                    onChange={handleChange}
                    style={{ accentColor: opt.color }}
                  />
                  <span style={{ fontSize: "13.5px", fontWeight: 600, color: opt.color }}>{opt.label}</span>
                </label>
              ))}
            </div>
          </div>

          {form.store_status === "closed" && (
            <div className="sd-form-full">
              <label className="sd-label">Closed Message</label>
              <input
                className="sd-input"
                name="store_status_message"
                value={form.store_status_message}
                onChange={handleChange}
                placeholder="e.g. Back on Monday — orders are paused for now."
                maxLength={200}
              />
              <span style={{ fontSize: "11.5px", color: "#94a3b8" }}>
                Shown to buyers as a banner on your store page.
              </span>
            </div>
          )}
        </div>

        <div style={{ marginTop: "20px" }}>
          <button
            type="submit"
            className="sd-btn-primary"
            disabled={saving}
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
