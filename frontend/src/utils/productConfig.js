// ─── Size pools ──────────────────────────────────────────────────────────────

export const CLOTHING_SIZES = [
  { value: "XS", label: "XS" },
  { value: "S", label: "S" },
  { value: "M", label: "M" },
  { value: "L", label: "L" },
  { value: "XL", label: "XL" },
  { value: "XXL", label: "2XL" },
  { value: "XXXL", label: "3XL" },
  { value: "4XL", label: "4XL" },
  { value: "5XL", label: "5XL" },
  { value: "6XL", label: "6XL" },
  { value: "Free Size", label: "Free Size" },
];

export const SHOE_SIZES = [
  { value: "EU 35", label: "EU 35" },
  { value: "EU 36", label: "EU 36" },
  { value: "EU 37", label: "EU 37" },
  { value: "EU 38", label: "EU 38" },
  { value: "EU 39", label: "EU 39" },
  { value: "EU 40", label: "EU 40" },
  { value: "EU 41", label: "EU 41" },
  { value: "EU 42", label: "EU 42" },
  { value: "EU 43", label: "EU 43" },
  { value: "EU 44", label: "EU 44" },
  { value: "EU 45", label: "EU 45" },
  { value: "EU 46", label: "EU 46" },
  { value: "EU 47", label: "EU 47" },
  { value: "UK 3", label: "UK 3" },
  { value: "UK 4", label: "UK 4" },
  { value: "UK 5", label: "UK 5" },
  { value: "UK 6", label: "UK 6" },
  { value: "UK 7", label: "UK 7" },
  { value: "UK 8", label: "UK 8" },
  { value: "UK 9", label: "UK 9" },
  { value: "UK 10", label: "UK 10" },
  { value: "UK 11", label: "UK 11" },
  { value: "UK 12", label: "UK 12" },
  { value: "US 5", label: "US 5" },
  { value: "US 6", label: "US 6" },
  { value: "US 7", label: "US 7" },
  { value: "US 8", label: "US 8" },
  { value: "US 9", label: "US 9" },
  { value: "US 10", label: "US 10" },
  { value: "US 11", label: "US 11" },
  { value: "US 12", label: "US 12" },
  { value: "US 13", label: "US 13" },
];

export const KIDS_SIZES = [
  { value: "Newborn", label: "Newborn" },
  { value: "0-3M", label: "0-3 Months" },
  { value: "3-6M", label: "3-6 Months" },
  { value: "6-12M", label: "6-12 Months" },
  { value: "1-2Y", label: "1-2 Years" },
  { value: "2-3Y", label: "2-3 Years" },
  { value: "3-4Y", label: "3-4 Years" },
  { value: "4-5Y", label: "4-5 Years" },
  { value: "5-6Y", label: "5-6 Years" },
  { value: "6-7Y", label: "6-7 Years" },
  { value: "7-8Y", label: "7-8 Years" },
  { value: "8-9Y", label: "8-9 Years" },
  { value: "9-10Y", label: "9-10 Years" },
  { value: "XS Kids", label: "XS (Kids)" },
  { value: "S Kids", label: "S (Kids)" },
  { value: "M Kids", label: "M (Kids)" },
  { value: "L Kids", label: "L (Kids)" },
];

// ─── Reusable field presets ───────────────────────────────────────────────────

const CONDITION_FIELD = {
  key: "condition",
  label: "Condition",
  type: "select",
  required: true,
  options: ["Brand New", "UK Used", "Foreign Used", "Nigerian Used", "Refurbished"],
};

const COLOR_FIELD = {
  key: "color",
  label: "Color",
  type: "text",
  placeholder: "e.g., Black, Navy Blue, Red",
  required: false,
};

const DIMENSIONS_FIELD = {
  key: "dimensions",
  label: "Dimensions (L × W × H cm)",
  type: "text",
  placeholder: "e.g., 120 × 60 × 75",
  required: false,
};

// ─── Category / subcategory config ───────────────────────────────────────────
//
//  showMaterial  – show the Material Type input
//  showBrand     – show the Brand input (always optional)
//  showGender    – show the Gender dropdown
//  sizeType      – "clothing" | "shoes" | "kids" | "none"
//  extraFields   – array of { key, label, type, placeholder?, required, options? }
//  subCategoryOverrides – keyed by subcategory value; merged on top of base config

const CATEGORY_CONFIG = {
  "Clothing materials": {
    showMaterial: true,
    showBrand: false,
    showGender: true,
    sizeType: "clothing",
    extraFields: [COLOR_FIELD],
    subCategoryOverrides: {
      Shoes: { sizeType: "shoes" },
      Slippers: { sizeType: "shoes" },
      "Baby wears": { sizeType: "kids", showGender: false },
      Socks: { sizeType: "shoes" },
    },
  },

  "Body accessories": {
    showMaterial: true,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      COLOR_FIELD,
      { key: "dimensions", label: "Dimensions (L × W × H cm)", type: "text", placeholder: "e.g., 30 × 12 × 22", required: false },
    ],
  },

  "Household items": {
    showMaterial: true,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      DIMENSIONS_FIELD,
      COLOR_FIELD,
    ],
  },

  "Sports and fitness": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      CONDITION_FIELD,
      { key: "suitable_for", label: "Suitable For / Age Group", type: "text", placeholder: "e.g., Adults, Ages 8+, Professional", required: false },
    ],
    subCategoryOverrides: {
      "Swimming gear": { sizeType: "clothing", showMaterial: true },
      "Running gear": { sizeType: "clothing", showMaterial: true },
    },
  },

  "Gym and workout equipment": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      CONDITION_FIELD,
      { key: "weight_capacity", label: "Weight / Capacity", type: "text", placeholder: "e.g., Max 150kg, 20kg, 2L", required: false },
    ],
  },

  "Electronics and appliances": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [CONDITION_FIELD, COLOR_FIELD],
    subCategoryOverrides: {
      "Mobile phones": {
        extraFields: [
          { key: "storage", label: "Storage Capacity", type: "select", required: true, options: ["16GB", "32GB", "64GB", "128GB", "256GB", "512GB", "1TB", "Other"] },
          { key: "ram", label: "RAM", type: "select", required: true, options: ["1GB", "2GB", "3GB", "4GB", "6GB", "8GB", "12GB", "16GB", "Other"] },
          { key: "screen_size", label: "Screen Size", type: "text", placeholder: 'e.g., 6.1"', required: false },
          { key: "os", label: "Operating System", type: "select", required: true, options: ["Android", "iOS", "HarmonyOS", "Other"] },
          { key: "connectivity", label: "Network Connectivity", type: "select", required: false, options: ["2G/3G", "4G LTE", "5G"] },
          { key: "battery", label: "Battery Capacity", type: "text", placeholder: "e.g., 5000 mAh", required: false },
          { key: "camera", label: "Camera Spec", type: "text", placeholder: "e.g., 50MP + 12MP rear, 16MP front", required: false },
          CONDITION_FIELD,
          COLOR_FIELD,
        ],
      },
      Laptops: {
        extraFields: [
          { key: "processor", label: "Processor / CPU", type: "text", placeholder: "e.g., Intel Core i5 12th Gen, Apple M2", required: true },
          { key: "ram", label: "RAM", type: "select", required: true, options: ["4GB", "8GB", "16GB", "32GB", "64GB", "Other"] },
          { key: "storage", label: "Storage", type: "text", placeholder: "e.g., 256GB SSD, 1TB HDD + 256GB SSD", required: true },
          { key: "screen_size", label: "Screen Size", type: "text", placeholder: 'e.g., 15.6"', required: false },
          { key: "os", label: "Operating System", type: "select", required: true, options: ["Windows 11", "Windows 10", "macOS", "Linux", "ChromeOS", "Other"] },
          { key: "graphics", label: "Graphics Card", type: "text", placeholder: "e.g., Intel UHD, NVIDIA GeForce GTX 1650", required: false },
          CONDITION_FIELD,
          COLOR_FIELD,
        ],
      },
      Desktops: {
        extraFields: [
          { key: "processor", label: "Processor / CPU", type: "text", placeholder: "e.g., Intel Core i7 12th Gen, Ryzen 5", required: true },
          { key: "ram", label: "RAM", type: "select", required: true, options: ["4GB", "8GB", "16GB", "32GB", "64GB", "Other"] },
          { key: "storage", label: "Storage", type: "text", placeholder: "e.g., 1TB HDD + 256GB SSD", required: true },
          { key: "os", label: "Operating System", type: "select", required: true, options: ["Windows 11", "Windows 10", "Linux", "Other"] },
          { key: "graphics", label: "Graphics Card", type: "text", placeholder: "e.g., NVIDIA RTX 3060, AMD Radeon, Integrated", required: false },
          CONDITION_FIELD,
        ],
      },
      Television: {
        extraFields: [
          { key: "screen_size", label: "Screen Size", type: "select", required: true, options: ['24"', '32"', '40"', '43"', '50"', '55"', '65"', '75"', '85"', "Other"] },
          { key: "resolution", label: "Resolution", type: "select", required: true, options: ["HD (720p)", "Full HD (1080p)", "4K Ultra HD", "8K Ultra HD"] },
          { key: "smart_tv", label: "Smart TV", type: "select", required: true, options: ["Yes – Android TV", "Yes – WebOS", "Yes – Tizen", "Yes – Other", "No"] },
          CONDITION_FIELD,
        ],
      },
      Headphones: {
        extraFields: [
          { key: "connectivity", label: "Connectivity", type: "select", required: true, options: ["Wired (3.5mm)", "Wireless (Bluetooth)", "True Wireless (TWS)", "Wired + Wireless"] },
          CONDITION_FIELD,
          COLOR_FIELD,
        ],
      },
      "Air conditioners": {
        extraFields: [
          { key: "capacity", label: "Cooling Capacity (Horsepower)", type: "select", required: true, options: ["0.75 HP", "1 HP", "1.5 HP", "2 HP", "2.5 HP", "3 HP"] },
          { key: "ac_type", label: "Unit Type", type: "select", required: true, options: ["Split Unit", "Window Unit", "Portable / Standing", "Cassette / Ceiling"] },
          CONDITION_FIELD,
        ],
      },
      Freezers: {
        extraFields: [
          { key: "capacity", label: "Capacity (Litres)", type: "text", placeholder: "e.g., 100L, 200L, 350L", required: true },
          { key: "freezer_type", label: "Type", type: "select", required: true, options: ["Chest Freezer", "Upright Freezer", "Refrigerator-Freezer combo"] },
          CONDITION_FIELD,
        ],
      },
    },
  },

  "agriculture, food, and groceries": {
    showMaterial: false,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "weight_volume", label: "Weight / Volume per Unit", type: "text", placeholder: "e.g., 1kg, 500g, 1 litre, 1 dozen", required: true },
      { key: "packaging", label: "Packaging Type", type: "select", required: false, options: ["Bag", "Box", "Bottle", "Can", "Pack / Sachet", "Bundle", "Carton", "Loose / Unpackaged"] },
      { key: "shelf_life", label: "Shelf Life / Expiry Info", type: "text", placeholder: "e.g., 12 months, Fresh daily, Best before on pack", required: false },
    ],
  },

  "Cosmetic and beauty products": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "volume_weight", label: "Volume / Net Weight per Unit", type: "text", placeholder: "e.g., 200ml, 50g, 1 oz", required: true },
      { key: "skin_type", label: "Suitable Skin Type", type: "select", required: false, options: ["All Skin Types", "Dry Skin", "Oily Skin", "Combination Skin", "Sensitive Skin", "Normal Skin"] },
      { key: "key_ingredients", label: "Key Ingredients (optional)", type: "text", placeholder: "e.g., Shea butter, Vitamin C, Hyaluronic Acid", required: false },
    ],
  },

  "Arts and craft": {
    showMaterial: true,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "dimensions", label: "Dimensions / Size", type: "text", placeholder: "e.g., 60cm × 40cm, A4, Life-size", required: false },
      COLOR_FIELD,
    ],
  },

  Stationery: {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "quantity_pack", label: "Pack Quantity", type: "text", placeholder: "e.g., 50 sheets, Pack of 12 pens, Single item", required: false },
    ],
  },

  "Furniture and home decor": {
    showMaterial: true,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      DIMENSIONS_FIELD,
      COLOR_FIELD,
      { key: "assembly_required", label: "Assembly Required", type: "select", required: false, options: ["Yes", "No"] },
    ],
  },

  "Autoparts and accessories": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "compatible_makes", label: "Compatible Car Make(s)", type: "text", placeholder: "e.g., Toyota, Honda, Mercedes-Benz", required: true },
      { key: "year_range", label: "Compatible Year Range", type: "text", placeholder: "e.g., 2010–2020, 2015 only", required: false },
      CONDITION_FIELD,
      { key: "part_number", label: "Part Number / OEM Code (optional)", type: "text", placeholder: "e.g., 04465-47010", required: false },
    ],
  },

  "Building materials": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "unit", label: "Unit of Sale", type: "select", required: true, options: ["Per Bag", "Per Piece", "Per Tonne", "Per Cubic Metre", "Per Square Metre", "Per Litre", "Per Bundle", "Per Roll", "Per Set"] },
      { key: "specification", label: "Dimensions / Specification", type: "text", placeholder: "e.g., 6m × 12mm rod, 9mm plywood sheet", required: false },
    ],
  },

  "Toys and children products": {
    showMaterial: true,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "age_group", label: "Recommended Age", type: "text", placeholder: "e.g., 3–6 years, Ages 8+, All ages", required: true },
      CONDITION_FIELD,
    ],
  },

  "Books and media": {
    showMaterial: false,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "author", label: "Author / Creator", type: "text", placeholder: "e.g., Chinua Achebe, Wole Soyinka", required: true },
      { key: "publisher", label: "Publisher", type: "text", placeholder: "e.g., Penguin Books, Longman", required: false },
      { key: "edition_year", label: "Edition / Publication Year", type: "text", placeholder: "e.g., 3rd Edition, 2021", required: false },
      { key: "condition", label: "Condition", type: "select", required: true, options: ["Brand New", "Like New", "Good", "Fair", "Acceptable"] },
      { key: "isbn", label: "ISBN (optional)", type: "text", placeholder: "e.g., 978-3-16-148410-0", required: false },
    ],
  },

  "Health and medical": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "dosage_form", label: "Form / Dosage / Specification", type: "text", placeholder: "e.g., 500mg tablet, 200ml syrup, Digital thermometer", required: false },
      { key: "prescription_required", label: "Prescription Required", type: "select", required: false, options: ["No", "Yes"] },
      { key: "expiry_info", label: "Expiry / Shelf Life", type: "text", placeholder: "e.g., 2 years, Expires Dec 2026, On pack", required: false },
    ],
  },

  "Travel and luggage": {
    showMaterial: true,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "dimensions", label: "Dimensions / Capacity", type: "text", placeholder: "e.g., 75cm × 50cm × 30cm, 40L, Cabin-approved", required: false },
      COLOR_FIELD,
      CONDITION_FIELD,
    ],
  },

  "Musical instruments": {
    showMaterial: true,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      CONDITION_FIELD,
      { key: "includes", label: "Included Accessories", type: "text", placeholder: "e.g., Case, Strap, Cable, Bow, Reeds", required: false },
    ],
  },

  "Jewelry and watches": {
    showMaterial: false,
    showBrand: false,
    showGender: true,
    sizeType: "none",
    extraFields: [
      { key: "metal_type", label: "Metal / Material", type: "select", required: true, options: ["18k Gold", "14k Gold", "Gold-plated", "Rose Gold", "Sterling Silver (925)", "Silver-plated", "Stainless Steel", "Brass", "Copper", "Titanium", "Platinum", "Alloy", "Other"] },
      { key: "stone_gem", label: "Stone / Gem", type: "text", placeholder: "e.g., Diamond, Ruby, Emerald, CZ, None", required: false },
      { key: "plating", label: "Finishing / Plating", type: "text", placeholder: "e.g., Rhodium-plated, Matte, Polished", required: false },
      COLOR_FIELD,
    ],
    subCategoryOverrides: {
      Watches: {
        extraFields: [
          { key: "movement_type", label: "Movement Type", type: "select", required: true, options: ["Quartz", "Automatic (Self-winding)", "Manual / Mechanical", "Smart / Digital"] },
          { key: "water_resistant", label: "Water Resistance", type: "text", placeholder: "e.g., 30m, 50m, Not water resistant", required: false },
          { key: "band_material", label: "Band / Strap Material", type: "text", placeholder: "e.g., Leather, Stainless Steel, Silicone, Nylon", required: false },
          CONDITION_FIELD,
          COLOR_FIELD,
        ],
      },
    },
  },

  "Photography and cameras": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "megapixels", label: "Megapixels", type: "text", placeholder: "e.g., 24.2 MP, 45 MP", required: false },
      { key: "lens_info", label: "Lens / Focal Length", type: "text", placeholder: "e.g., 18-55mm kit lens, 50mm f/1.8, No lens", required: false },
      CONDITION_FIELD,
      { key: "includes", label: "Included in Box", type: "text", placeholder: "e.g., Body only, Lens, Bag, Memory card, Charger", required: false },
    ],
  },

  "Garden and outdoor": {
    showMaterial: false,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "suitable_for", label: "Suitable For", type: "text", placeholder: "e.g., Indoor plants, Outdoor garden, Balcony", required: false },
      DIMENSIONS_FIELD,
    ],
  },

  Services: {
    showMaterial: false,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "duration", label: "Duration / Pricing Unit", type: "text", placeholder: "e.g., Per session (2 hrs), Per project, Daily rate", required: true },
      { key: "availability", label: "Availability", type: "text", placeholder: "e.g., Weekdays 9am–5pm, By appointment, 24/7", required: false },
      { key: "service_area", label: "Service Area / Location", type: "text", placeholder: "e.g., Lagos Island, Nationwide (Remote), Abuja FCT", required: false },
    ],
  },

  "Office and business": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      CONDITION_FIELD,
      DIMENSIONS_FIELD,
    ],
  },

  "Baby and maternity": {
    showMaterial: true,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "age_group", label: "Suitable Age / Size Range", type: "text", placeholder: "e.g., 0–6 months, Newborn, One size", required: false },
    ],
    subCategoryOverrides: {
      "Baby clothing": { sizeType: "kids", showGender: true },
      "Maternity wear": { sizeType: "clothing", showGender: false },
    },
  },

  "Food and beverages": {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "weight_volume", label: "Net Weight / Volume per Unit", type: "text", placeholder: "e.g., 1kg, 500ml, 1 litre, 330ml can", required: true },
      { key: "packaging", label: "Packaging", type: "select", required: false, options: ["Bottle", "Can", "Box / Carton", "Sachet / Pack", "Bag", "Jar", "Tray", "Loose / Fresh"] },
    ],
  },

  "Party and events": {
    showMaterial: false,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "quantity_pack", label: "Pack Quantity", type: "text", placeholder: "e.g., Pack of 50, Set of 12, Single item", required: false },
      COLOR_FIELD,
    ],
  },

  "Antiques and collectibles": {
    showMaterial: true,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "era_period", label: "Era / Period", type: "text", placeholder: "e.g., 1920s, Colonial era, Pre-independence Nigeria", required: false },
      { key: "provenance", label: "Provenance / Origin", type: "text", placeholder: "e.g., Yoruba traditional, British colonial, Unknown", required: false },
      { key: "condition", label: "Condition", type: "select", required: true, options: ["Mint", "Excellent", "Very Good", "Good", "Fair", "Poor"] },
    ],
  },

  "Religious and spiritual": {
    showMaterial: false,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "faith_tradition", label: "Faith / Tradition", type: "text", placeholder: "e.g., Christian, Muslim, Traditional African, Interfaith", required: false },
    ],
  },

  "Pets and animals": {
    showMaterial: false,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "age", label: "Age", type: "text", placeholder: "e.g., 3 months, 2 years, 6 weeks", required: false },
      { key: "breed", label: "Breed / Species", type: "text", placeholder: "e.g., German Shepherd, Siamese Cat, Tilapia", required: false },
      { key: "vaccinated", label: "Vaccinated", type: "select", required: false, options: ["Yes – Fully vaccinated", "Yes – Partially vaccinated", "No", "Unknown"] },
      { key: "animal_gender", label: "Animal Gender", type: "select", required: false, options: ["Male", "Female", "Not applicable / Unknown"] },
    ],
    subCategoryOverrides: {
      "Pet food": {
        showBrand: true,
        extraFields: [
          { key: "weight_volume", label: "Weight / Volume per Pack", type: "text", placeholder: "e.g., 1kg, 500g, 2kg bag", required: true },
          { key: "suitable_for", label: "Suitable For", type: "text", placeholder: "e.g., Dogs, Cats, Puppies, Adult dogs, All pets", required: true },
        ],
      },
      "Pet accessories": {
        extraFields: [
          { key: "suitable_for", label: "Suitable For (pet type / size)", type: "text", placeholder: "e.g., Small dogs, Large cats, All pets", required: false },
          COLOR_FIELD,
        ],
      },
    },
  },

  Miscellaneous: {
    showMaterial: false,
    showBrand: false,
    showGender: false,
    sizeType: "none",
    extraFields: [],
  },

  Adult: {
    showMaterial: false,
    showBrand: true,
    showGender: false,
    sizeType: "none",
    extraFields: [
      { key: "dimensions", label: "Dimensions / Size", type: "text", placeholder: "e.g., 20cm, One size, Small/Medium/Large", required: false },
    ],
  },
};

// ─── Public helpers ───────────────────────────────────────────────────────────

/** Returns the resolved field config for a category + subcategory pair. */
export function getFieldConfig(category, subCategory) {
  const base = CATEGORY_CONFIG[category];
  if (!base) {
    return { showMaterial: true, showBrand: false, showGender: false, sizeType: "none", extraFields: [] };
  }
  const override = subCategory && base.subCategoryOverrides?.[subCategory] ? base.subCategoryOverrides[subCategory] : {};
  return {
    showMaterial: override.showMaterial !== undefined ? override.showMaterial : base.showMaterial,
    showBrand: override.showBrand !== undefined ? override.showBrand : base.showBrand,
    showGender: override.showGender !== undefined ? override.showGender : base.showGender,
    sizeType: override.sizeType !== undefined ? override.sizeType : base.sizeType,
    extraFields: override.extraFields !== undefined ? override.extraFields : base.extraFields,
  };
}

/** Returns the size options array for a given sizeType. */
export function getSizeOptions(sizeType) {
  switch (sizeType) {
    case "clothing": return CLOTHING_SIZES;
    case "shoes": return SHOE_SIZES;
    case "kids": return KIDS_SIZES;
    default: return [];
  }
}
