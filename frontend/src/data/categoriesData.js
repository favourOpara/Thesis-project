const categoriesData = [
  {
    name: "Clothing materials",
    value: "Clothing materials",
    subcategories: [
      "Traditional materials","African prints","Aso-ebi","Wrappers","Shirts",
      "Baby wears","Sweatshirts","Hoodies","Trousers","Joggers","Shorts",
      "Gym wears","Underwears","Dresses","Socks","Headwears","Shoes",
      "Slippers","Jewelry","Other",
    ],
  },
  {
    name: "Body accessories",
    value: "Body accessories",
    subcategories: ["Handbags","Purses","Wallets","Belts","Handwears","Eyewear","Other"],
  },
  {
    name: "Household items",
    value: "Household items",
    subcategories: ["Kitchenware","Cookware","Plastic containers","Storage bins","Cleaning supplies","Other"],
  },
  {
    name: "Sports & Fitness",
    value: "Sports and fitness",
    subcategories: [
      "Football equipment","Basketball equipment","Tennis equipment","Swimming gear",
      "Running gear","Cycling equipment","Boxing equipment","Golf equipment",
      "Outdoor sports","Team sports","Other",
    ],
  },
  {
    name: "Gym & Workout",
    value: "Gym and workout equipment",
    subcategories: [
      "Weights and dumbbells","Cardio machines","Yoga and pilates","Resistance bands",
      "Exercise mats","Fitness trackers","Protein supplements","Gym bags",
      "Home gym equipment","Other",
    ],
  },
  {
    name: "Electronics",
    value: "Electronics and appliances",
    subcategories: [
      "Mobile phones","Television","DVD players","Home theaters","Air conditioners",
      "Freezers","Fan","Pressing iron","Lights","Desktops","Laptops",
      "Musical instruments","Headphones","Digital watches","Video games","Other",
    ],
  },
  {
    name: "Agriculture & Food",
    value: "agriculture, food, and groceries",
    subcategories: [
      "Fresh fruits","Vegetables","Grains","Pulses","Legumes","Spices",
      "Herbs","Seasoning","Meat","Poultry","Fish","Packaged foods","Biscuits","Other",
    ],
  },
  {
    name: "Beauty & Health",
    value: "Cosmetic and beauty products",
    subcategories: ["Skincare","Haircare","Mouthcare","Makeups","Perfumes","Other"],
  },
  {
    name: "Arts & Crafts",
    value: "Arts and craft",
    subcategories: [
      "Handcrafted sculptures","Carvings","Paintings","Drawings","Artworks",
      "Beadworks","Traditional musical instruments","Flowers","Other",
    ],
  },
  {
    name: "Stationery",
    value: "Stationery",
    subcategories: ["Writing materials","Office supplies","Art supplies","School supplies","Other"],
  },
  {
    name: "Furniture & Decor",
    value: "Furniture and home decor",
    subcategories: ["Chairs","Tables","Beds","Mattresses","Rugs","Curtains","Dining set","Cupboards","Other"],
  },
  {
    name: "Autoparts",
    value: "Autoparts and accessories",
    subcategories: ["Vehicle spare parts","Car accessories","Car repair tools","Other"],
  },
  {
    name: "Building Materials",
    value: "Building materials",
    subcategories: [
      "Cement","Sand","Gravel","Bricks","Roofing materials","Plumbing",
      "Electric supplies","Toilet building","Construction tools","Other",
    ],
  },
  {
    name: "Toys & Kids",
    value: "Toys and children products",
    subcategories: ["Dolls","Action figures","Stuffed animals","Educational toys","Games","Baby care products","Other"],
  },
  {
    name: "Books & Media",
    value: "Books and media",
    subcategories: [
      "Fiction books","Non-fiction books","Educational books","Children books",
      "Religious books","Magazines","Newspapers","DVDs and CDs","Audiobooks",
      "Comics and manga","Other",
    ],
  },
  {
    name: "Health & Medical",
    value: "Health and medical",
    subcategories: [
      "First aid supplies","Medical devices","Vitamins and supplements","Personal care",
      "Dental care","Eye care","Hearing aids","Mobility aids","Health monitors",
      "Prescription items","Other",
    ],
  },
  {
    name: "Travel & Luggage",
    value: "Travel and luggage",
    subcategories: [
      "Suitcases","Backpacks","Travel bags","Laptop bags","Travel accessories",
      "Travel pillows","Passport holders","Luggage locks","Travel organizers","Other",
    ],
  },
  {
    name: "Musical Instruments",
    value: "Musical instruments",
    subcategories: [
      "Guitars","Keyboards and pianos","Drums","Wind instruments","String instruments",
      "DJ equipment","Recording equipment","Music accessories","Traditional instruments",
      "Sheet music","Other",
    ],
  },
  {
    name: "Jewelry & Watches",
    value: "Jewelry and watches",
    subcategories: [
      "Necklaces","Earrings","Rings","Bracelets","Watches","Engagement rings",
      "Wedding bands","Fashion jewelry","Traditional jewelry","Jewelry accessories","Other",
    ],
  },
  {
    name: "Photography & Cameras",
    value: "Photography and cameras",
    subcategories: [
      "Digital cameras","Film cameras","Camera lenses","Tripods","Camera bags",
      "Memory cards","Lighting equipment","Photo frames","Photo albums","Video equipment","Other",
    ],
  },
  {
    name: "Garden & Outdoor",
    value: "Garden and outdoor",
    subcategories: [
      "Plants and seeds","Garden tools","Pots and planters","Fertilizers","Outdoor furniture",
      "BBQ and grills","Garden decor","Watering equipment","Lawn care","Camping gear","Other",
    ],
  },
  {
    name: "Services",
    value: "Services",
    subcategories: [
      "Cleaning services","Repair services","Tutoring","Photography services","Event planning",
      "Transportation","Home improvement","Beauty services","IT services","Consulting","Other",
    ],
  },
  {
    name: "Office & Business",
    value: "Office and business",
    subcategories: [
      "Office furniture","Office supplies","Printers and scanners","Business equipment",
      "Filing and storage","Presentation equipment","Communication devices","Software",
      "Industrial equipment","Safety equipment","Other",
    ],
  },
  {
    name: "Baby & Maternity",
    value: "Baby and maternity",
    subcategories: [
      "Baby clothing","Baby gear","Baby feeding","Diapers and wipes","Baby furniture",
      "Maternity wear","Baby toys","Baby safety","Strollers and car seats","Nursing supplies","Other",
    ],
  },
  {
    name: "Food & Beverages",
    value: "Food and beverages",
    subcategories: [
      "Beverages","Snacks","Condiments and sauces","Baking supplies","Frozen foods",
      "Canned goods","Dairy products","Specialty foods","International foods","Organic foods","Other",
    ],
  },
  {
    name: "Party & Events",
    value: "Party and events",
    subcategories: [
      "Party supplies","Decorations","Birthday supplies","Wedding supplies","Holiday decorations",
      "Balloons","Party favors","Catering supplies","Event furniture","Entertainment","Other",
    ],
  },
  {
    name: "Antiques & Collectibles",
    value: "Antiques and collectibles",
    subcategories: [
      "Vintage items","Rare books","Coins and stamps","Artwork","Memorabilia",
      "Antique furniture","Vintage clothing","Collectible toys","Historical items","Other",
    ],
  },
  {
    name: "Religious & Spiritual",
    value: "Religious and spiritual",
    subcategories: [
      "Religious books","Prayer items","Religious clothing","Spiritual jewelry","Religious art",
      "Meditation supplies","Candles and incense","Religious music","Ceremonial items","Other",
    ],
  },
  {
    name: "Animal Pets",
    value: "Pets and animals",
    subcategories: [
      "Dogs","Cats","Birds","Fish and aquariums","Small animals","Reptiles","Pet food",
      "Pet toys","Pet accessories","Pet grooming","Pet health","Pet training","Pet carriers","Other",
    ],
  },
  {
    name: "Miscellaneous",
    value: "Miscellaneous",
    subcategories: [
      "Gift cards","Tickets","Vouchers","Craft supplies","Hobby items","Seasonal items",
      "Novelty items","Custom items","Bulk items","Other",
    ],
  },
  {
    name: "Adult",
    value: "Adult",
    subcategories: [
      "Adult entertainment","Adult toys","Adult accessories","Adult books and media",
      "Adult clothing","Wellness products","Other",
    ],
  },
];

export default categoriesData;
