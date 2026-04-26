import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link } from "react-router-dom";
import { useSellerCtx, ac, BASE, IconExternal } from "../components/SellerLayout";

const SellerSettings = () => {
  const { shop, refreshShop, setPageTitle, setTopbarActions } = useSellerCtx();

  const [form, setForm] = useState({
    name:        shop?.name        || "",
    description: shop?.description || "",
    whatsapp:    shop?.whatsapp    || "",
    instagram:   shop?.instagram   || "",
    website:     shop?.website     || "",
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
        name:        shop.name        || "",
        description: shop.description || "",
        whatsapp:    shop.whatsapp    || "",
        instagram:   shop.instagram   || "",
        website:     shop.website     || "",
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
