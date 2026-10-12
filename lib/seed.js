/* Seed data for byte2bite.
   Single source of truth for the hero carousel on the home page.
   Loaded as a plain script before main.js, so it is also available
   as window.BYTE2BITE_SEED and via module.exports for tooling. */
var BYTE2BITE_SEED = {
  // Currency symbol used when rendering prices.
  currency: "₱",
  carousel: [
    {
      image: "assets/carousell2/caro1.jpg",
      alt: "A bowl of kimchi fried rice topped with a fried egg",
      title: "Kimchi Rice",
      text: "Wok-fired rice with house kimchi, sesame and a golden fried egg.",
      cta: { label: "Order now", href: "#" }
    },
    {
      image: "assets/carousell2/caro2.jpg",
      alt: "A colourful bowl of bibimbap with vegetables and beef",
      title: "Sesame Pork",
      text: "Description",
      cta: { label: "Order now", href: "#" }
    },
    {
      image: "assets/carousell2/caro3.jpg",
      alt: "Crispy Korean fried chicken coated in a glossy glaze",
      title: "Item3",
      text: "Description",
      cta: { label: "Order now", href: "#" }
    },
    {
      image: "assets/carousell2/caro4.jpg",
      alt: "Chewy rice cakes in a rich red tteokbokki sauce",
      title: "Item4",
      text: "Description",
      cta: { label: "Order now", href: "#" }
    }
  ],
  drinks_seed: [
    {
      "name": "Coca-Cola",
      "description": "",
      "price":  10.2,
      "img": "assets/drinks_assets/coca_cola.jpg"
    },
    {
      "name": "Lemonade",
      "description": "",
      "price":  10.2,
      "img": "assets/drinks_assets/lemomade.jpg"
    },
    {
      "name": "Pineapple",
      "description": "",
      "price":  10.2,
      "img": "assets/drinks_assets/pineapple.jpg"
    },
    {
      "name": "Red Juice",
      "description": "",
      "price":  10.2,
      "img": "assets/drinks_assets/red_juice.jpg"
    },
    {
      "name": "Royal",
      "description": "",
      "price":  10.2,
      "img": "assets/drinks_assets/royal.jpg"
    },
    {
      "name": "Soju",
      "description": "",
      "price":  10.2,
      "img": "assets/drinks_assets/soju.jpg"
    },
    {
      "name": "Sprite",
      "description": "",
      "price":  10.2,
      "img": "assets/drinks_assets/sprite.jpg"
    }
  ],
  offers_seed: [
    {
      "name": "Offer 1",
      "img": "assets/offers/caro1.jpg",
      "price": 379.00
    },
    {
      "name": "Offer 2",
      "img": "assets/offers/caro2.jpg",
      "price": 259.00
    },
    {
      "name": "ALACARTE 199",
      "img": "assets/offers/caro3.jpg",
      "price": 199.00
    }
  ]
};

// Reusable from Node (tooling/tests) without a bundler.
if (typeof module !== "undefined" && module.exports) {
  module.exports = BYTE2BITE_SEED;
}
