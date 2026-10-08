export interface Product {
  id: number;
  name: string;
  category: "panolletas" | "flecos" | "twillys";
  price: number;
  isNew: boolean;
  description: string;
}

export const products: Product[] = [
  {
    id: 1,
    name: "Isabella",
    category: "panolletas",
    price: 159,
    isNew: true,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 2,
    name: "Siena",
    category: "panolletas",
    price: 159,
    isNew: false,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 3,
    name: "Mimosa",
    category: "twillys",
    price: 120,
    isNew: true,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 4,
    name: "Tutti",
    category: "twillys",
    price: 120,
    isNew: false,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
  {
    id: 5,
    name: "Perla",
    category: "flecos",
    price: 240,
    isNew: true,
    description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.",
  },
];