import { Product } from "@/types/product";


// Simulated API call with delay
export const fetchProduct = async (productId: string): Promise<Product> => {
  // Simulate API delay
  await new Promise(resolve => setTimeout(resolve, 1000));
  
  // Return mock data that matches your images
  return {
    id: productId,
    title: "Men Kaftan Fitted Style",
    subtitle: "Fitted Style",
    description: `Managing our style with our main Kaftan for Man, a timeless classic that embodies simplicity, sophistication, and versatility. Crafted from a combination of textures and cohesive fabrics, the kaftan is a symbol of high-quality craftsmanship and recyclable materials.

With our Flash Kaftan for Men in black, you're not just wearing an outfit, you're making a statement. Timeless design and impeccable craftsmanship ensure you'll stand out at any event; whether it's a grand gala, laid-back gathering, or a winding celebration. Choose the perfect fit and sleeve length, and make this classic piece your own with confidence, style, and shape with every step in our fine Kaftan.`,
    price: 89.99,
    currency: "$",
    inStock: true,
    deliveryTime: "5 Working Days",
    images: [
      "/images/kaftan-1.jpg",
      "/images/kaftan-2.jpg",
      "/images/kaftan-3.jpg"
    ],
    features: [
      "Natural and natural texture",
      "Natural texture, colorless",
      "Natural texture, texture-free",
      "Natural texture, texture-free"
    ],
    colors: [
      { id: "black", name: "Black", value: "#000000", displayName: "Picin Kaftan Style for Men" },
      { id: "navy", name: "Navy", value: "#000080", displayName: "Navy Kaftan Style for Men" },
      { id: "brown", name: "Brown", value: "#8B4513", displayName: "Brown Kaftan Style for Men" },
      { id: "white", name: "White", value: "#FFFFFF", displayName: "White Kaftan Style for Men" }
    ],
    sizes: [
      { id: "S", name: "S", inStock: true },
      { id: "M", name: "M", inStock: true },
      { id: "L", name: "L", inStock: true },
      { id: "XL", name: "XL", inStock: true },
      { id: "XXL", name: "XXL", inStock: false }
    ],
    sleeveLengths: [
      { id: "short", name: "short", displayName: "Short Sleeves" },
      { id: "long", name: "long", displayName: "Long Sleeves" }
    ],
    reviews: [],
    relatedProducts: [
      { id: "1", name: "Milk Style Kaftan", price: 79.99, image: "/images/related-1.jpg" },
      { id: "2", name: "Pizza Style Kaftan", price: 84.99, image: "/images/related-2.jpg" },
      { id: "3", name: "Sugar Style Kaftan", price: 89.99, image: "/images/related-3.jpg" },
      { id: "4", name: "Tango Style Kaftan", price: 94.99, image: "/images/related-4.jpg" },
      { id: "5", name: "Milk Style Kaftan", price: 79.99, image: "/images/related-5.jpg" }
    ],
    mobileSpecific: {
      title: "Men Black Kaftan",
      subtitle: "Fitted Style",
      colorDescription: "Picin Kaftan Style for Men",
      tags: ["NO", "Pain", "For Men"]
    }
  };
};