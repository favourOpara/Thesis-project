import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useSellerCtx, ac, BASE, IconExternal } from "../components/SellerLayout";
import { useAuth } from "../context/AuthContext";

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
  const { logout } = useAuth();
  const navigate = useNavigate();
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteInput,       setDeleteInput]       = useState("");
  const [deleting,          setDeleting]          = useState(false);

  const handleDeleteAccount = async () => {
    if (deleteInput !== "DELETE") return;
    setDeleting(true);
    try {
      await axios.delete(`${BASE}/api/delete-account/`, ac());
      await logout();
      navigate("/", { replace: true });
    } catch {
      toast.error("Could not delete account. Please try again.");
      setDeleting(false);
    }
  };

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
    products_position:    shop?.products_position    || "first",
    phone_number:         "",
    address:              "",
    first_name:           "",
    last_name:            "",
  });
  const [nameMissing, setNameMissing] = useState(false);
  const [logo,   setLogo]   = useState(null);
  const [banner, setBanner] = useState(null);
  const [saving, setSaving] = useState(false);
  const logoRef   = useRef();
  const bannerRef = useRef();
  const isNew = !shop;

  // ── Store Builder ──
  const shopCategories = shop?.categories || [];
  const [storeBlocks, setStoreBlocks]   = useState([]);
  const [catPages,    setCatPages]      = useState([]);
  const [blockSaving, setBlockSaving]   = useState(false);
  const [addingBlock, setAddingBlock]   = useState(null); // null | 'text' | 'image_grid'
  const [expandedCat, setExpandedCat]  = useState(null); // category_name of open accordion
  const [addingCatBlock, setAddingCatBlock] = useState(null); // null | 'text' | 'image_grid'
  const [newBlock, setNewBlock] = useState({ text_title: "", text_content: "", layout: "2col", images: [] });
  const [newCatBlock, setNewCatBlock] = useState({ text_title: "", text_content: "", layout: "2col", images: [] });
  const blockImgRef    = useRef();
  const catBlockImgRef = useRef();

  useEffect(() => {
    if (!shop) return;
    Promise.all([
      axios.get(`${BASE}/api/shops/${shop.slug}/store-blocks/`, ac()),
      axios.get(`${BASE}/api/shops/${shop.slug}/category-pages/`, ac()),
    ]).then(([blocksRes, pagesRes]) => {
      setStoreBlocks(blocksRes.data);
      setCatPages(pagesRes.data);
    }).catch(() => {});
  }, [shop]);

  // Ensure a Products block always exists once shop is loaded
  useEffect(() => {
    if (!shop || storeBlocks.length > 0) return;
    // Seed with a single Products block so sellers have something to move around
    axios.post(`${BASE}/api/shops/${shop.slug}/store-blocks/`, { block_type: "products", order: 0 }, ac())
      .then(r => setStoreBlocks([r.data]))
      .catch(() => {});
  }, [shop, storeBlocks.length]);

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

  const buildBlockImages = (draft) => {
    const fd = new FormData();
    draft.images.forEach(s => fd.append("images", s.file));
    draft.images.forEach(s => fd.append("linked_categories", s.linked_category || ""));
    return fd;
  };

  const handleAddBlock = async () => {
    if (addingBlock === "image_grid" && !newBlock.images.length) { toast.error("Upload at least one image."); return; }
    setBlockSaving(true);
    try {
      const fd = buildBlockImages(newBlock);
      fd.append("block_type", addingBlock);
      fd.append("order", storeBlocks.length);
      if (addingBlock === "text") { fd.append("text_title", newBlock.text_title); fd.append("text_content", newBlock.text_content); }
      if (addingBlock === "image_grid") fd.append("layout", newBlock.layout);
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
    if (addingCatBlock === "image_grid" && !newCatBlock.images.length) { toast.error("Upload at least one image."); return; }
    setBlockSaving(true);
    try {
      const page = await getOrCreateCatPage(catName);
      const fd = buildBlockImages(newCatBlock);
      fd.append("block_type", addingCatBlock);
      if (addingCatBlock === "text") { fd.append("text_title", newCatBlock.text_title); fd.append("text_content", newCatBlock.text_content); }
      if (addingCatBlock === "image_grid") fd.append("layout", newCatBlock.layout);
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
        products_position:    shop.products_position    || "first",
      }));
    }
  }, [shop]);

  // Load private user fields (phone, address, name)
  useEffect(() => {
    axios.get(`${BASE}/api/user-info/`, ac())
      .then(r => {
        const firstName = r.data.first_name || "";
        const lastName  = r.data.last_name  || "";
        setNameMissing(!firstName.trim());
        setForm(f => ({
          ...f,
          phone_number: r.data.phone_number || "",
          address:      r.data.address      || "",
          first_name:   firstName,
          last_name:    lastName,
        }));
      })
      .catch(() => {});
  }, []);

  const handleChange = e => setForm(f => ({ ...f, [e.target.name]: e.target.value }));

  const handleSubmit = async e => {
    e.preventDefault();

    if (!form.first_name.trim()) {
      toast.error("First name is required.");
      return;
    }

    setSaving(true);

    const fd = new FormData();
    const userFields = ["phone_number", "address", "first_name", "last_name"];
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

      // Save private user fields including name
      await axios.put(`${BASE}/api/update-profile/`, {
        first_name:   form.first_name.trim(),
        last_name:    form.last_name.trim(),
        phone_number: form.phone_number,
        address:      form.address,
      }, ac());

      setNameMissing(false);
      toast.success(isNew ? "Store created successfully." : "Changes saved.");
      refreshShop();
    } catch (err) {
      const d = err.response?.data;
      toast.error(typeof d === "object" ? JSON.stringify(d) : "Something went wrong.");
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

      <ToastContainer position="bottom-center" />

      {/* Missing name banner — shown to Google sign-up users */}
      {nameMissing && (
        <div style={{
          display: "flex", alignItems: "flex-start", gap: "12px",
          background: "#fffbeb", border: "1px solid #fde68a",
          borderRadius: "12px", padding: "14px 18px", marginBottom: "20px",
        }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
            <path d="M10.29 3.86L1.82 18a2 2 0 0 0 1.71 3h16.94a2 2 0 0 0 1.71-3L13.71 3.86a2 2 0 0 0-3.42 0z"/>
            <line x1="12" y1="9" x2="12" y2="13"/><line x1="12" y1="17" x2="12.01" y2="17"/>
          </svg>
          <div>
            <div style={{ fontWeight: 700, fontSize: "13.5px", color: "#92400e", marginBottom: "2px" }}>
              Your name is missing
            </div>
            <div style={{ fontSize: "12.5px", color: "#78350f", lineHeight: 1.6 }}>
              Google sign-in doesn't always share your name. Please fill in your first and last name below — it's required for your seller profile.
            </div>
          </div>
        </div>
      )}

      <form onSubmit={handleSubmit}>

        {/* Account name — mandatory, shown first so Google users can't miss it */}
        <p className="sd-section-label">Your Name</p>
        <div className="sd-form-grid" style={{ marginBottom: "0" }}>
          <div>
            <label className="sd-label">First Name *</label>
            <input
              className="sd-input-line"
              name="first_name"
              value={form.first_name}
              onChange={handleChange}
              placeholder="e.g. Amaka"
              required
              style={!form.first_name.trim() ? { borderColor: "#f97316" } : {}}
            />
          </div>
          <div>
            <label className="sd-label">Last Name</label>
            <input
              className="sd-input-line"
              name="last_name"
              value={form.last_name}
              onChange={handleChange}
              placeholder="e.g. Okafor"
            />
          </div>
        </div>
        <hr className="sd-divider" />

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
            {/* Banner guidance */}
            <div style={{
              marginTop: "8px",
              background: "#fffbeb",
              border: "1px solid #fde68a",
              borderRadius: "8px",
              padding: "10px 12px",
              display: "flex",
              gap: "9px",
              alignItems: "flex-start",
            }}>
              <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="#d97706" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" style={{ flexShrink: 0, marginTop: "1px" }}>
                <circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/>
              </svg>
              <div>
                <p style={{ margin: "0 0 5px", fontSize: "12px", fontWeight: 700, color: "#92400e" }}>
                  Use a landscape (wide) image
                </p>
                <ul style={{ margin: 0, padding: "0 0 0 14px", fontSize: "11.5px", color: "#78350f", lineHeight: 1.65 }}>
                  <li>Your banner displays as a <strong>wide, short strip</strong> — landscape photos fill it perfectly.</li>
                  <li><strong>Portrait images (taller than wide)</strong> will appear heavily cropped and look off.</li>
                  <li>Ideal dimensions: <strong>1200 × 300 px</strong> or any image at least <strong>4× wider than it is tall</strong>.</li>
                  <li>Good sources: a wide product flat-lay, a store interior shot, or a branded graphic.</li>
                </ul>
              </div>
            </div>
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

      {/* ══════════════════════════════════════════════
          STORE BUILDER
      ══════════════════════════════════════════════ */}
      {shop && (() => {
        const LAYOUTS = [
          { value: "1col", label: "1 column" },
          { value: "2col", label: "2 columns" },
          { value: "3col", label: "3 columns" },
          { value: "2-1",  label: "Large | Small" },
          { value: "1-2",  label: "Small | Large" },
        ];
        const BLOCK_LABELS = { products: "Products Grid", text: "Text Block", image_grid: "Image Section" };

        const BlockAddForm = ({ draft, setDraft, imgRef, onSave, onCancel, forCategory }) => (
          <div style={{ background: "#f8fafc", border: "1.5px solid #e2e8f0", borderRadius: "12px", padding: "18px", marginTop: "12px" }}>
            {addingBlock === "text" || forCategory === "text" ? (
              <>
                <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Title (optional)</label>
                <input className="sd-input-line" value={draft.text_title}
                  onChange={e => setDraft(s => ({ ...s, text_title: e.target.value }))}
                  placeholder="e.g. Our Story" style={{ marginBottom: "12px" }} />
                <label className="sd-label" style={{ display: "block", marginBottom: "6px" }}>Content *</label>
                <textarea className="sd-input" rows={4} value={draft.text_content}
                  onChange={e => setDraft(s => ({ ...s, text_content: e.target.value }))}
                  placeholder="Write something about your store, products, values…"
                  style={{ resize: "vertical" }} />
              </>
            ) : (
              <>
                <label className="sd-label" style={{ marginBottom: "8px", display: "block" }}>Grid Layout</label>
                <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
                  {LAYOUTS.map(opt => (
                    <button key={opt.value} type="button"
                      onClick={() => setDraft(s => ({ ...s, layout: opt.value }))}
                      style={{ padding: "5px 12px", borderRadius: "8px", fontSize: "12px", fontWeight: 600, cursor: "pointer", border: "1.5px solid", borderColor: draft.layout === opt.value ? "#2563eb" : "#e2e8f0", background: draft.layout === opt.value ? "#eff6ff" : "#fff", color: draft.layout === opt.value ? "#2563eb" : "#374151" }}>
                      {opt.label}
                    </button>
                  ))}
                </div>
                <label className="sd-label" style={{ display: "block", marginBottom: "8px" }}>Images</label>
                <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(110px, 1fr))", gap: "8px", marginBottom: "10px" }}>
                  {draft.images.map((slot, idx) => (
                    <div key={idx} style={{ position: "relative", borderRadius: "8px", overflow: "hidden", border: "1px solid #e2e8f0" }}>
                      <img src={slot.url} alt="" style={{ width: "100%", aspectRatio: "16/9", objectFit: "cover", display: "block" }} />
                      <button type="button" onClick={() => setDraft(s => ({ ...s, images: s.images.filter((_, i) => i !== idx) }))}
                        style={{ position: "absolute", top: "3px", right: "3px", background: "rgba(0,0,0,0.55)", color: "#fff", border: "none", borderRadius: "50%", width: "18px", height: "18px", cursor: "pointer", fontSize: "10px", display: "flex", alignItems: "center", justifyContent: "center" }}>✕</button>
                      <div style={{ padding: "4px 5px" }}>
                        <select value={slot.linked_category}
                          onChange={e => setDraft(s => { const imgs = [...s.images]; imgs[idx] = { ...imgs[idx], linked_category: e.target.value }; return { ...s, images: imgs }; })}
                          style={{ width: "100%", padding: "3px 5px", fontSize: "10px", border: "1px solid #e2e8f0", borderRadius: "5px", background: "#fff" }}>
                          <option value="">No link</option>
                          {shopCategories.map(cat => <option key={cat} value={cat}>{cat}</option>)}
                        </select>
                      </div>
                    </div>
                  ))}
                  <div onClick={() => imgRef.current.click()}
                    style={{ aspectRatio: "16/9", border: "2px dashed #cbd5e1", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", cursor: "pointer", color: "#94a3b8", fontSize: "22px" }}>+</div>
                </div>
                <input ref={imgRef} type="file" accept="image/*" multiple style={{ display: "none" }}
                  onChange={e => handleBlockImageAdd(e, setDraft)} />
              </>
            )}
            <div style={{ display: "flex", gap: "10px", marginTop: "12px" }}>
              <button type="button" onClick={onSave} disabled={blockSaving}
                style={{ padding: "7px 18px", background: "#2563eb", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer", opacity: blockSaving ? 0.7 : 1 }}>
                {blockSaving ? "Saving…" : "Save Block"}
              </button>
              <button type="button" onClick={onCancel}
                style={{ padding: "7px 14px", background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: 500, fontSize: "13px", cursor: "pointer" }}>
                Cancel
              </button>
            </div>
          </div>
        );

        return (
          <>
            {/* ── Store Builder ── */}
            <div style={{ marginTop: "32px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
              <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Store Builder</p>
              <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#94a3b8" }}>
                Arrange your store page. Use ▲ ▼ to reorder. The <strong>Products Grid</strong> block is always present — move it anywhere.
              </p>

              {/* Block list */}
              {storeBlocks.map((block, idx) => (
                <div key={block.id} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", marginBottom: "8px", overflow: "hidden" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 14px", background: "#f8fafc" }}>
                    {/* Reorder arrows */}
                    <div style={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
                      <button type="button" onClick={() => moveBlock(idx, -1)} disabled={idx === 0}
                        style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "4px", cursor: idx === 0 ? "default" : "pointer", padding: "1px 5px", fontSize: "10px", color: idx === 0 ? "#d1d5db" : "#374151" }}>▲</button>
                      <button type="button" onClick={() => moveBlock(idx, 1)} disabled={idx === storeBlocks.length - 1}
                        style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "4px", cursor: idx === storeBlocks.length - 1 ? "default" : "pointer", padding: "1px 5px", fontSize: "10px", color: idx === storeBlocks.length - 1 ? "#d1d5db" : "#374151" }}>▼</button>
                    </div>
                    {/* Label */}
                    <div style={{ flex: 1, minWidth: 0 }}>
                      <span style={{ fontSize: "13px", fontWeight: 600, color: "#0f172a" }}>{BLOCK_LABELS[block.block_type]}</span>
                      {block.block_type === "text" && block.text_title && (
                        <span style={{ fontSize: "12px", color: "#94a3b8", marginLeft: "8px" }}>— {block.text_title}</span>
                      )}
                      {block.block_type === "image_grid" && block.layout && (
                        <span style={{ fontSize: "11px", background: "#eff6ff", color: "#2563eb", padding: "1px 7px", borderRadius: "99px", marginLeft: "8px", fontWeight: 600 }}>{block.layout}</span>
                      )}
                    </div>
                    {/* Preview thumbnails for image_grid */}
                    {block.block_type === "image_grid" && block.images?.length > 0 && (
                      <div style={{ display: "flex", gap: "4px", flexShrink: 0 }}>
                        {block.images.slice(0, 3).map(img => (
                          <img key={img.id} src={img.image_url} alt="" style={{ width: "36px", height: "24px", objectFit: "cover", borderRadius: "4px" }} />
                        ))}
                      </div>
                    )}
                    {/* Delete (not for products block) */}
                    {block.block_type !== "products" && (
                      <button type="button" onClick={() => deleteBlock(block.id)}
                        style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "12px", fontWeight: 600, flexShrink: 0, padding: "0 4px" }}>
                        Remove
                      </button>
                    )}
                  </div>
                  {/* Text preview */}
                  {block.block_type === "text" && block.text_content && (
                    <div style={{ padding: "10px 14px", fontSize: "12.5px", color: "#64748b", lineHeight: 1.55, borderTop: "1px solid #f1f5f9" }}>
                      {block.text_content.slice(0, 140)}{block.text_content.length > 140 ? "…" : ""}
                    </div>
                  )}
                </div>
              ))}

              {/* Add block buttons */}
              {!addingBlock && (
                <div style={{ display: "flex", gap: "10px", marginTop: "12px", flexWrap: "wrap" }}>
                  <button type="button" onClick={() => { setAddingBlock("text"); setNewBlock({ text_title: "", text_content: "", layout: "2col", images: [] }); }}
                    style={{ padding: "7px 16px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, fontSize: "12.5px", cursor: "pointer", color: "#374151" }}>
                    + Text Block
                  </button>
                  <button type="button" onClick={() => { setAddingBlock("image_grid"); setNewBlock({ text_title: "", text_content: "", layout: "2col", images: [] }); }}
                    style={{ padding: "7px 16px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, fontSize: "12.5px", cursor: "pointer", color: "#374151" }}>
                    + Image Section
                  </button>
                </div>
              )}
              {addingBlock && (
                <BlockAddForm
                  draft={newBlock} setDraft={setNewBlock} imgRef={blockImgRef}
                  onSave={handleAddBlock}
                  onCancel={() => { setAddingBlock(null); setNewBlock({ text_title: "", text_content: "", layout: "2col", images: [] }); }}
                />
              )}
            </div>

            {/* ── Category Pages ── */}
            {form.layout_mode === "categories" && (
              <div style={{ marginTop: "28px", borderTop: "1px solid #e2e8f0", paddingTop: "24px" }}>
                <p style={{ margin: "0 0 4px", fontSize: "13px", fontWeight: 700, color: "#0f172a" }}>Category Pages</p>
                <p style={{ margin: "0 0 16px", fontSize: "12px", color: "#94a3b8" }}>
                  Customise what buyers see when they click a category tab — add images and text above the products.
                </p>

                {shopCategories.length === 0 && (
                  <div style={{ textAlign: "center", padding: "20px", background: "#f8fafc", borderRadius: "10px", color: "#94a3b8", fontSize: "13px" }}>
                    Add products first — categories will appear here once your shop has products.
                  </div>
                )}

                {shopCategories.map(catName => {
                  const page = catPages.find(p => p.category_name === catName);
                  const isOpen = expandedCat === catName;
                  return (
                    <div key={catName} style={{ border: "1px solid #e2e8f0", borderRadius: "10px", marginBottom: "8px", overflow: "hidden" }}>
                      {/* Accordion header */}
                      <button type="button" onClick={() => setExpandedCat(isOpen ? null : catName)}
                        style={{ width: "100%", display: "flex", alignItems: "center", justifyContent: "space-between", padding: "11px 16px", background: isOpen ? "#eff6ff" : "#f8fafc", border: "none", cursor: "pointer" }}>
                        <span style={{ fontSize: "13px", fontWeight: 600, color: isOpen ? "#2563eb" : "#374151" }}>{catName}</span>
                        <span style={{ fontSize: "12px", color: "#94a3b8", display: "flex", alignItems: "center", gap: "6px" }}>
                          {page?.blocks?.length ? `${page.blocks.length} block${page.blocks.length > 1 ? "s" : ""}` : "No custom content"}
                          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" style={{ transform: isOpen ? "rotate(180deg)" : "rotate(0)", transition: "transform 0.15s" }}>
                            <polyline points="6 9 12 15 18 9"/>
                          </svg>
                        </span>
                      </button>

                      {/* Accordion body */}
                      {isOpen && (
                        <div style={{ padding: "14px 16px", borderTop: "1px solid #e2e8f0" }}>
                          {/* Existing blocks */}
                          {page?.blocks?.map((block, bIdx) => (
                            <div key={block.id} style={{ border: "1px solid #f1f5f9", borderRadius: "8px", marginBottom: "8px", overflow: "hidden" }}>
                              <div style={{ display: "flex", alignItems: "center", gap: "10px", padding: "8px 12px", background: "#fafafa" }}>
                                <div style={{ display: "flex", flexDirection: "column", gap: "2px", flexShrink: 0 }}>
                                  <button type="button" onClick={() => moveCatBlock(page.id, bIdx, -1)} disabled={bIdx === 0}
                                    style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "3px", cursor: bIdx === 0 ? "default" : "pointer", padding: "0 4px", fontSize: "10px", color: bIdx === 0 ? "#d1d5db" : "#374151" }}>▲</button>
                                  <button type="button" onClick={() => moveCatBlock(page.id, bIdx, 1)} disabled={bIdx === page.blocks.length - 1}
                                    style={{ background: "none", border: "1px solid #e2e8f0", borderRadius: "3px", cursor: bIdx === page.blocks.length - 1 ? "default" : "pointer", padding: "0 4px", fontSize: "10px", color: bIdx === page.blocks.length - 1 ? "#d1d5db" : "#374151" }}>▼</button>
                                </div>
                                <span style={{ flex: 1, fontSize: "12.5px", fontWeight: 600, color: "#374151" }}>
                                  {block.block_type === "text" ? "Text Block" : "Image Section"}
                                  {block.text_title && <span style={{ color: "#94a3b8", fontWeight: 400, marginLeft: "6px" }}>— {block.text_title}</span>}
                                  {block.layout && <span style={{ fontSize: "11px", background: "#eff6ff", color: "#2563eb", padding: "1px 6px", borderRadius: "99px", marginLeft: "6px", fontWeight: 600 }}>{block.layout}</span>}
                                </span>
                                {block.block_type === "image_grid" && block.images?.length > 0 && (
                                  <div style={{ display: "flex", gap: "3px" }}>
                                    {block.images.slice(0, 3).map(img => (
                                      <img key={img.id} src={img.image_url} alt="" style={{ width: "30px", height: "20px", objectFit: "cover", borderRadius: "3px" }} />
                                    ))}
                                  </div>
                                )}
                                <button type="button" onClick={() => deleteCatBlock(page.id, block.id)}
                                  style={{ background: "none", border: "none", cursor: "pointer", color: "#ef4444", fontSize: "12px", fontWeight: 600, padding: "0 3px" }}>Remove</button>
                              </div>
                              {block.block_type === "text" && block.text_content && (
                                <div style={{ padding: "8px 12px", fontSize: "12px", color: "#64748b", lineHeight: 1.5, borderTop: "1px solid #f1f5f9" }}>
                                  {block.text_content.slice(0, 120)}{block.text_content.length > 120 ? "…" : ""}
                                </div>
                              )}
                            </div>
                          ))}

                          {/* Add cat block buttons */}
                          {!addingCatBlock && (
                            <div style={{ display: "flex", gap: "8px", marginTop: "8px", flexWrap: "wrap" }}>
                              <button type="button" onClick={() => { setAddingCatBlock("text"); setNewCatBlock({ text_title: "", text_content: "", layout: "2col", images: [] }); }}
                                style={{ padding: "6px 14px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, fontSize: "12px", cursor: "pointer", color: "#374151" }}>
                                + Text
                              </button>
                              <button type="button" onClick={() => { setAddingCatBlock("image_grid"); setNewCatBlock({ text_title: "", text_content: "", layout: "2col", images: [] }); }}
                                style={{ padding: "6px 14px", background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: "8px", fontWeight: 600, fontSize: "12px", cursor: "pointer", color: "#374151" }}>
                                + Image Section
                              </button>
                            </div>
                          )}
                          {addingCatBlock && (
                            <BlockAddForm
                              draft={newCatBlock} setDraft={setNewCatBlock} imgRef={catBlockImgRef}
                              forCategory={addingCatBlock}
                              onSave={() => handleAddCatBlock(catName)}
                              onCancel={() => { setAddingCatBlock(null); setNewCatBlock({ text_title: "", text_content: "", layout: "2col", images: [] }); }}
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
          </>
        );
      })()}

      {/* ── Danger zone ── */}
      <div style={{ marginTop: "40px", borderTop: "1px solid #fee2e2", paddingTop: "28px" }}>
        <p style={{ fontSize: "11px", fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.8px", margin: "0 0 12px" }}>
          Danger Zone
        </p>

        {!showDeleteConfirm ? (
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px", flexWrap: "wrap", background: "#fff5f5", border: "1px solid #fecaca", borderRadius: "12px", padding: "16px 20px" }}>
            <div>
              <div style={{ fontWeight: 600, fontSize: "13.5px", color: "#0f172a", marginBottom: "2px" }}>Delete Account</div>
              <div style={{ fontSize: "12.5px", color: "#94a3b8", lineHeight: 1.5 }}>Permanently delete your account, store, and all data. This cannot be undone.</div>
            </div>
            <button
              onClick={() => { setShowDeleteConfirm(true); setDeleteInput(""); }}
              style={{ padding: "8px 18px", background: "transparent", color: "#b91c1c", border: "1.5px solid #fecaca", borderRadius: "8px", fontWeight: 600, fontSize: "13px", cursor: "pointer", whiteSpace: "nowrap", flexShrink: 0 }}
            >
              Delete Account
            </button>
          </div>
        ) : (
          <div style={{ background: "#fff5f5", border: "1.5px solid #fecaca", borderRadius: "12px", padding: "20px" }}>
            <div style={{ fontWeight: 700, fontSize: "14px", color: "#b91c1c", marginBottom: "8px" }}>Are you sure?</div>
            <p style={{ fontSize: "13px", color: "#7f1d1d", lineHeight: 1.65, margin: "0 0 14px" }}>
              Your store, all products, and your account will be permanently deleted. This cannot be recovered.
            </p>
            <p style={{ fontSize: "13px", color: "#374151", fontWeight: 500, margin: "0 0 8px" }}>
              Type <strong>DELETE</strong> to confirm:
            </p>
            <input
              value={deleteInput}
              onChange={e => setDeleteInput(e.target.value)}
              placeholder="DELETE"
              style={{ width: "100%", padding: "9px 12px", borderRadius: "8px", fontSize: "13.5px", border: "1.5px solid #fecaca", outline: "none", marginBottom: "12px", fontFamily: "monospace", boxSizing: "border-box" }}
            />
            <div style={{ display: "flex", gap: "8px" }}>
              <button
                onClick={handleDeleteAccount}
                disabled={deleteInput !== "DELETE" || deleting}
                style={{ padding: "8px 20px", background: deleteInput === "DELETE" && !deleting ? "#b91c1c" : "#94a3b8", color: "#fff", border: "none", borderRadius: "8px", fontWeight: 700, fontSize: "13px", cursor: deleteInput === "DELETE" && !deleting ? "pointer" : "not-allowed" }}
              >
                {deleting ? "Deleting…" : "Delete my account"}
              </button>
              <button
                onClick={() => setShowDeleteConfirm(false)}
                style={{ padding: "8px 16px", background: "transparent", color: "#64748b", border: "1px solid #e2e8f0", borderRadius: "8px", fontWeight: 500, fontSize: "13px", cursor: "pointer" }}
              >
                Cancel
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default SellerSettings;
