// src/data/menuData.ts
export type MenuItem = {
  slug: string;
  name: string;
  price: number;
  section: 'MENU' | 'FAMILY PACKS' | 'SPECIALTY MENU' | 'SIDES';
  image?: any; // require(...) if you have per-item images later
  description?: string;
  flavorCount?: number; // how many flavor selections allowed
  flavors?: string[];
  modifiers?: string[];
  glutenFreeNote?: 'Gluten Free Bun' | 'Gluten Free Bread' | null;
  celiacNote?: boolean; // show big bold Celiac label
};

const FLAVORS = [
  'no seasoning',
  'original',
  'sweet',
  'spicy',
  'sweet & spicy',
  'hot',
  'hot honey',
  'hot honey ranch',
  'fire',
  'fiery sweet',
];

const SLIDER_MODIFIERS = [
  'no slaw',
  'no sauce',
  'no pickles',
  'extra slaw +$0.50',
  'extra pickles +$0.50',
  'extra sauce +$0.50',
];

export const MENU_SECTIONS: Array<{ section: MenuItem['section']; items: MenuItem[] }> = [
  {
    section: 'MENU',
    items: [
      {
        slug: 'slider-fries',
        name: 'Slider w/ Fries',
        price: 13.99,
        section: 'MENU',
        flavorCount: 1,
        flavors: FLAVORS,
        modifiers: SLIDER_MODIFIERS,
        glutenFreeNote: 'Gluten Free Bun',
        celiacNote: true,
        description: 'Single slider, crispy fries, pickles, slaw, and Ruth’s flavor magic.',
      },
      {
        slug: '2-tender-fries',
        name: '2 Tenders w/ Fries',
        price: 12.99,
        section: 'MENU',
        flavorCount: 2,
        flavors: FLAVORS,
        glutenFreeNote: 'Gluten Free Bread',
        celiacNote: true,
        description: 'Two juicy tenders + fries. Pick your heat on each tender.',
      },
      {
        slug: 'slider-tender-fries',
        name: 'Slider + Tender w/ Fries',
        price: 14.99,
        section: 'MENU',
        flavorCount: 2, // 1 for slider + 1 for tender
        flavors: FLAVORS,
        modifiers: SLIDER_MODIFIERS, // modifiers apply to the slider
        glutenFreeNote: 'Gluten Free Bun',
        celiacNote: true,
        description: 'One slider + one tender with fries. Mix-and-match your flavors.',
      },
      {
        slug: '8pc-chicken-bites-fries',
        name: '8pc. Chicken Bites w/ Fries',
        price: 10.99,
        section: 'MENU',
        flavorCount: 1,
        flavors: FLAVORS,
        celiacNote: true,
        description: 'Eight poppable bites + fries. Perfect for saucing or snacking.',
      },
    ],
  },
  {
    section: 'FAMILY PACKS',
    items: [
      {
        slug: '2-sliders-fries',
        name: '2 Sliders w/ Fries',
        price: 18.99,
        section: 'FAMILY PACKS',
        flavorCount: 2,
        flavors: FLAVORS,
        modifiers: SLIDER_MODIFIERS,
        glutenFreeNote: 'Gluten Free Bun',
        celiacNote: true,
        description: 'Two sliders + fries. Double the fun, double the flavor.',
      },
      {
        slug: '3-tenders-fries',
        name: '3 Tenders w/ Fries',
        price: 15.99,
        section: 'FAMILY PACKS',
        flavorCount: 3,
        flavors: FLAVORS,
        glutenFreeNote: 'Gluten Free Bread',
        celiacNote: true,
        description: 'Three tenders + fries. Great for sharing—or not.',
      },
      {
        slug: 'slider-flight-4-fries',
        name: 'Slider Flight (4 Sliders) w/ Fries',
        price: 39.99,
        section: 'FAMILY PACKS',
        flavorCount: 4,
        flavors: FLAVORS,
        modifiers: SLIDER_MODIFIERS,
        glutenFreeNote: 'Gluten Free Bun',
        celiacNote: true,
        description: 'A four-slider flavor tour + fries. Try the whole heat ladder.',
      },
      {
        slug: 'tender-flight-5-fries',
        name: 'Tender Flight (5 Tenders) w/ Fries',
        price: 28.99,
        section: 'FAMILY PACKS',
        flavorCount: 5,
        flavors: FLAVORS,
        glutenFreeNote: 'Gluten Free Bread',
        celiacNote: true,
        description: 'Five tenders, five flavors, infinite happiness. Comes with fries.',
      },
    ],
  },
  {
    section: 'SPECIALTY MENU',
    items: [
      {
        slug: 'stack-fries',
        name: 'Stack Fries',
        price: 14.99,
        section: 'SPECIALTY MENU',
        flavorCount: 1,
        flavors: FLAVORS,
        modifiers: SLIDER_MODIFIERS,
        celiacNote: true,
        description: 'A loaded stack: fries piled high with your favorite flavors & toppings.',
      },
      {
        slug: 'chicken-waffles',
        name: 'Chicken & Waffles',
        price: 16.99,
        section: 'SPECIALTY MENU',
        flavorCount: 1,
        flavors: FLAVORS,
        celiacNote: true,
        description: 'Crispy chicken on fluffy waffles. Sweet meets heat.',
      },
      {
        slug: 'slider-flight-junior-fries',
        name: 'Slider Flight Junior w/ Fries',
        price: 15.99,
        section: 'SPECIALTY MENU',
        flavorCount: 2,
        flavors: FLAVORS,
        modifiers: SLIDER_MODIFIERS,
        glutenFreeNote: 'Gluten Free Bun',
        celiacNote: true,
        description: 'Two-slider mini flight + fries. Small size, big flavor.',
      },
    ],
  },
  {
    section: 'SIDES',
    items: [
      {
        slug: 'single-slider',
        name: 'Slider',
        price: 10.99,
        section: 'SIDES',
        flavorCount: 1,
        flavors: FLAVORS,
        modifiers: SLIDER_MODIFIERS,
        glutenFreeNote: 'Gluten Free Bun',
        celiacNote: true,
        description: 'A single slider on its own—perfect add-on.',
      },
      {
        slug: 'single-tender',
        name: 'Tender',
        price: 5.99,
        section: 'SIDES',
        celiacNote: true,
        description: 'One extra tender. Because one more is always right.',
      },
      {
        slug: 'fries',
        name: 'Fries',
        price: 3.99,
        section: 'SIDES',
        description: 'Crispy, golden fries. Salt-kissed and snackable.',
      },
      {
        slug: 'apple-slaw',
        name: 'Apple Slaw',
        price: 3.99,
        section: 'SIDES',
        description: 'Creamy, crunchy slaw with a hint of apple.',
      },
      {
        slug: 'ruths-sauce',
        name: "Ruth's Sauce",
        price: 0.99,
        section: 'SIDES',
        description: 'Signature sauce. Sweet, tangy, and a little mysterious.',
      },
    ],
  },
];

export const ALL_MENU_ITEMS: MenuItem[] = MENU_SECTIONS.flatMap(s => s.items);
export const FLAVOR_LIST = FLAVORS;
export const SLIDER_EXTRA_MODIFIERS = SLIDER_MODIFIERS;
