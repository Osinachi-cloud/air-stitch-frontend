"use client"
import Image from "next/image";
import { useState } from "react";

interface Review {
  name: string;
  rating: number;
  comment: string;
}

const ProductDetails = () => {
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("black");
  const [measurement, setMeasurement] = useState("");
  const [sleeveType, setSleeveType] = useState<"short" | "long">("long");

  const reviews: Review[] = [
    { name: "Abiola Yewande", rating: 5, comment: "Lorem ipsum dolor sit amet consectetur..." },
    { name: "Johnny Doe", rating: 4, comment: "Lorem ipsum dolor sit amet consectetur..." },
    { name: "Uchenna Chizara", rating: 3, comment: "Lorem ipsum dolor sit amet consectetur..." },
  ];

  return (
    <div className="max-w-7xl mx-auto p-4 md:grid grid-cols-1 md:grid-cols-2 gap-8">
      {/* max-w-7xl mx-auto p-4 grid grid-cols-1 md:grid-cols-2 gap-8 */}
      {/* Left Side - Images */}
      <div className="col-span-1 w-full">
        <div className="grid grid-cols-4 gap-4">
          <div className="col-span-1 grid gap-2">
            <Image src="/images/Agbada (2).png" alt="Kaftan 1" width={100} height={100} className="w-full rounded-md" />
            <Image src="/images/Agbada (2).png" alt="Kaftan 2" width={100} height={100} className="w-full rounded-md" />
            <Image src="/images/Agbada (2).png" alt="Kaftan 3" width={100} height={100} className="w-full rounded-md" />
          </div>
          <div className="col-span-3">
            <Image src="/images/Agbada (2).png" alt="Kaftan main" width={100} height={100} className="w-full rounded-lg"/>
          </div>
        </div>
      </div>

      {/* Right Side - Details */}
      <div className="flex flex-col gap-6 col-span-1 mt-[2rem]">
        <div className="space-y-2">
          <p className="text-sm text-gray-500 md:bg-[#fff] w-fit p-[0.5rem] bg-[#000]">NATIVE</p>
          <h1 className="text-2xl md:text-4xl font-bold">Men Black Kaftan Fitted Style</h1>
          <p className="text-gray-600">
            <span className="font-semibold">Style:</span> Plain Kaftan Style for Men
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Material:</span> Senator, Guinea
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Sleeves:</span> Available in Short Sleeves & Long Sleeves
          </p>
          <p className="text-gray-600">
            <span className="font-semibold">Sizes:</span> Range of sizes, Available in multiple sizes
          </p>
          <p className="text-gray-600">
            Ready for delivery in: <span className="font-semibold">5 Working Days</span>
          </p>
        </div>

        {/* Measurement */}
        <div>
          <select
            value={measurement}
            onChange={(e) => setMeasurement(e.target.value)}
            className="w-full p-2 border rounded-md focus:outline-none focus:ring"
          >
            <option value="">Pick a Measurement</option>
            <option value="measurement1">Measurement 1</option>
            <option value="measurement2">Measurement 2</option>
          </select>
        </div>

        {/* Colors */}
        <div className="flex items-center gap-2">
          {["blue", "purple", "black", "red", "white"].map((color) => (
            <button
              key={color}
              onClick={() => setSelectedColor(color)}
              className={`w-6 h-6 rounded-sm border-2 ${selectedColor === color ? "border-black" : "border-gray-300"
                }`}
              style={{ backgroundColor: color }}
            />
          ))}
        </div>

        {/* Sleeves */}
        <div className="flex items-center gap-4">
          <button
            onClick={() => setSleeveType("short")}
            className={`px-4 py-2 rounded-md border ${sleeveType === "short" ? "bg-black text-white" : "bg-white text-black"
              }`}
          >
            Short Sleeves
          </button>
          <button
            onClick={() => setSleeveType("long")}
            className={`px-4 py-2 rounded-md border ${sleeveType === "long" ? "bg-black text-white" : "bg-white text-black"
              }`}
          >
            Long Sleeves
          </button>
        </div>

        {/* Quantity and Price */}
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <button
              onClick={() => setQuantity((q) => Math.max(1, q - 1))}
              className="px-3 py-1 border rounded-md"
            >
              -
            </button>
            <span>{quantity}</span>
            <button
              onClick={() => setQuantity((q) => q + 1)}
              className="px-3 py-1 border rounded-md"
            >
              +
            </button>
          </div>
          <p className="text-2xl font-bold">₦{(40000 * quantity).toLocaleString()}</p>
        </div>

        {/* Add to Cart and Buy Now */}
        <div className="flex gap-4">
          <button className="flex-1 bg-black text-white py-2 rounded-md">Add to Cart</button>
          <button className="flex-1 bg-gray-300 text-black py-2 rounded-md">Buy Now</button>
        </div>

        <div className="flex gap-[1rem] w-full items-center text-[10px]">
          <p className="md:text-sm text-gray-400">✓ FREE SHIPPING</p>
          <p className="md:text-xs text-gray-400">Product Code: FMS992IL</p>
          <p className="md:text-xs text-gray-400">Tags: NEW ARRIVALS, SUITS</p>
        </div>

      </div>

      {/* Description and Reviews */}
      <div className="col-span-2 mt-10">
        <h2 className="text-2xl font-semibold mb-4">DESCRIPTION</h2>
        <p className="text-gray-700 mb-8">
          Elevate your style with our Plain Kaftan for Men, a timeless classic that embodies simplicity, sophistication, and versatility. Crafted from a combination of Senator and Guinea fabrics, this kaftan is a symbol of high-quality craftsmanship and exquisite materials.
          <br /><br />
          With our Plain Kaftan for Men in black, you are not just wearing an outfit; you are making a statement...
        </p>

        <h2 className="text-2xl font-semibold mb-4">Review (3)</h2>
        <div className="space-y-6">
          {reviews.map((review, idx) => (
            <div key={idx}>
              <p className="font-bold">{review.name}</p>
              <div className="flex gap-1">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i}>
                    {i < review.rating ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
              <p className="text-gray-600">{review.comment}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
