window.ITEMS = [

  
  {
    id: "skin_default",
    name: "Default Button",
    img: "assets/buttons/ButtonCommon1.png",
    desc: "The classic button",
    cost: 0,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon1.png",

    inShop: false,
    inMerchant: false,
    alwaysOwned: true
  },


  {
    id: "skin_orange",
    name: "Orange Button",
    img: "assets/buttons/ButtonCommon2.png",
    desc: "Clean orange look",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon2.png",

    inShop: true,
    inMerchant: false
  },
  {
    id: "skin_blue",
    name: "Blue Button",
    img: "assets/buttons/ButtonCommon3.png",
    desc: "Cool blue vibe",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon3.png",

    inShop: true,
    inMerchant: false
  },
  {
    id: "skin_green",
    name: "Green Button",
    img: "assets/buttons/ButtonCommon4.png",
    desc: "Nature energy",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon4.png",

    inShop: true,
    inMerchant: false
  },
  {
    id: "skin_purple",
    name: "Purple Button",
    img: "assets/buttons/ButtonCommon5.png",
    desc: "Mystical purple vibe",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon5.png",

    inShop: true,
    inMerchant: false
  },
  {
    id: "skin_yellow",
    name: "Yellow Button",
    img: "assets/buttons/ButtonCommon6.png",
    desc: "Bright and cheerful",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon6.png",

    inShop: true,
    inMerchant: false
  },
  {
    id: "skin_pink",
    name: "Pink Button",
    img: "assets/buttons/ButtonCommon7.png",
    desc: "Cute and playful",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "ButtonCommon7.png",

    inShop: true,
    inMerchant: false
  },


  {
    id: "skin_iceblue",
    name: "Ice Blue Button",
    img: "assets/buttons/IceButtonBlue.png",
    desc: "Cool and refreshing",
    cost: 50000,
    rarity: "rare",
    type: "skin",
    value: "IceButtonBlue.png",

    inShop: true,
    inMerchant: false
  },
  {
    id: "skin_iceorange",
    name: "Ice Orange Button",
    img: "assets/buttons/IceButtonOrange.png",
    desc: "Tastes like orange",
    cost: 50000,
    rarity: "rare",
    type: "skin",
    value: "IceButtonOrange.png",

    inShop: true,
    inMerchant: false
  },
  {
    id: "skin_icegreen",
    name: "Ice Green Button",
    img: "assets/buttons/IceButtonGreen.png",
    desc: "Green apple energy",
    cost: 50000,
    rarity: "rare",
    type: "skin",
    value: "IceButtonGreen.png",

    inShop: true,
    inMerchant: false
  },

  
  {
    id: "skin_gold",
    name: "Golden Button",
    img: "assets/buttons/GoldButton.png",
    desc: "Legendary shine",
    cost: 25000,
    rarity: "epic",
    type: "skin",
    value: "GoldButton.png",

    inShop: false,
    inMerchant: true,
    chance: 0.1,
    clickBoost: 0.25
  },
  {
    id: "skin_silver",
    name: "Silver Button",
    img: "assets/buttons/SilberButton.png",
    desc: "Shiny but not too shiny",
    cost: 20000,
    rarity: "rare",
    type: "skin",
    value: "SilberButton.png",

    inShop: false,
    inMerchant: true,
    chance: 0.4,
    clickBoost: 0.2
  },
  {
    id: "skin_bronze",
    name: "Bronze Button",
    img: "assets/buttons/BronzeButton.png",
    desc: "Basic but classy",
    cost: 10000,
    rarity: "common",
    type: "skin",
    value: "BronzeButton.png",

    inShop: false,
    inMerchant: true,
    chance: 0.5,
    clickBoost: 0.15
  },

  
  {
    id: "boost_click",
    name: "Click Boost Pack",
    img: "assets/ui/ButtonCurrency.png",
    desc: "+50 clicks instantly",
    cost: 2000,
    rarity: "common",
    type: "boost",

    inShop: false,
    inMerchant: true,

    effect: () => {
      let clicks = parseInt(localStorage.getItem("clicks")) || 0;
      clicks += 50;
      localStorage.setItem("clicks", clicks);
    }
  },
  {
    id: "boost_gems",
    name: "Gem Pack",
    img: "assets/ui/GemCurrency.png",
    desc: "+10 gems instantly",
    cost: 3000,
    rarity: "rare",
    type: "boost",

    inShop: false,
    inMerchant: true,

    effect: () => {
      let gems = parseInt(localStorage.getItem("gems")) || 0;
      gems += 10;
      localStorage.setItem("gems", gems);
    }
  }

];