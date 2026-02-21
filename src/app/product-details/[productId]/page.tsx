"use client"
import { useState } from "react";
import { useParams } from "next/navigation";
import { useFetch } from "@/hooks/useFetch";
import { baseUrL } from "@/env/URLs";
import { useRouter } from 'next/navigation';
import { ProductDto, ProductVariation, Review } from "@/types/product";
import { useMemo } from 'react';
import { usePost } from "@/hooks/usePost";

const ProductDetails = () => {
  const params = useParams();
  const router = useRouter();
  
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [measurement, setMeasurement] = useState("");
  const [sleeveType, setSleeveType] = useState<string>();

  if (!params || !params.productId) {
    return (
      <div className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="flex justify-center items-center py-20">
          <div className="text-lg text-red-600">Error: Product ID is missing</div>
        </div>
      </div>
    );
  }

  const productId = params.productId as string;

  const addToCartRequestBody = useMemo(() => ({
    color: selectedColor,
    sleeveType: sleeveType,
    measurementTag: measurement,
    quantity: quantity
  }), [selectedColor, sleeveType, measurement, quantity]);

  const url = `${baseUrL}/get-product-by-id?productId=${productId}`;
  const bodyMeasurementUrl = `${baseUrL}/get-body-measurement-by-user`;
  const addToCartUrl = `${baseUrL}/increase-cart-with-variation?productId=${productId}&quantity=${addToCartRequestBody.quantity}`;

  const { data, isLoading, error } = useFetch("GET", null, url);
  const { data: bodyMeasurementData, isLoading: bodyMeasurementLoading, error: bodyMeasurementError } = useFetch("GET", null, bodyMeasurementUrl);
  const { callApi } = usePost("POST", addToCartRequestBody, addToCartUrl, "cart");

  const product: ProductDto | null = data || null;

  const reviews: Review[] = [
    { name: "Abiola Yewande", rating: 5, comment: "Lorem ipsum dolor sit amet consectetur..." },
    { name: "Johnny Doe", rating: 4, comment: "Lorem ipsum dolor sit amet consectetur..." },
    { name: "Uchenna Chizara", rating: 3, comment: "Lorem ipsum dolor sit amet consectetur..." },
  ];

  if (!productId) {
    return (
      <div className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="flex justify-center items-center py-20">
          <div className="text-lg text-red-600">Error: Product ID is missing</div>
        </div>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="flex justify-center items-center py-20">
          <div className="text-lg">Loading product details...</div>
        </div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="flex justify-center items-center py-20">
          <div className="text-lg text-red-600">
            Error: {error || "Product not found"}
          </div>
        </div>
      </div>
    );
  }

  const uniqueSleeveTypes = [...new Set(data.productVariation.map((product: ProductVariation) => product.sleeveType))];

  return (
    <>
      <div className="px-2 md:px-6 py-10 w-[90%] m-auto">
        <div className="max-w-7xl mx-auto p-4 md:grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Left Side - Images */}
          <div className="col-span-1 w-full">
            <div className="grid grid-cols-4 gap-4">
              <div className="col-span-1 grid gap-2">
                {/* Using the same product image for thumbnails - you can modify this if you have multiple images */}
                <img
                  src={product.productImage == null ? "/images/placeholder-product.png" : product.productImage}
                  alt={`${product.name} 1`}
                  width={100}
                  height={100}
                  className="w-full rounded-md"
                />
                <img
                  src={product.productImage}
                  alt={`${product.name} 2`}
                  width={100}
                  height={100}
                  className="w-full rounded-md"
                />
                <img
                  src={product.productImage}
                  alt={`${product.name} 3`}
                  width={100}
                  height={100}
                  className="w-full rounded-md"
                />
              </div>
              <div className="col-span-3">
                <img
                  src={product.productImage}
                  alt={product.name}
                  width={500}
                  height={500}
                  className="w-full h-auto rounded-lg"
                />
              </div>
            </div>
          </div>

          {/* Right Side - Details */}
          <div className="flex flex-col gap-6 col-span-1 mt-[2rem]">
            <div className="space-y-2">
              <p className="text-sm text-gray-500 md:bg-[#fff] w-fit p-[0.5rem] bg-[#000]">
                {product.category}
              </p>
              <h1 className="text-2xl md:text-4xl font-bold">{product.name}</h1>
              <p className="text-gray-600">
                <span className="font-semibold">Style:</span> {product.shortDescription}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Material:</span> {product.materialUsed || "Senator, Guinea"}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Sleeves:</span> Available in {uniqueSleeveTypes.join(" & ")}
              </p>
              <p className="text-gray-600">
                <span className="font-semibold">Sizes:</span> Range of sizes, Available in multiple sizes
              </p>
              <p className="text-gray-600">
                Ready for delivery in: <span className="font-semibold">{product.readyIn}</span>
              </p>
            </div>

            {/* <div className="bg-black">hi</div> */}

            {/* Colors */}
            <div className="flex items-center gap-2">
              {data.productVariation.map((product: ProductVariation) => (
                <button
                  key={product.color}
                  onClick={() => setSelectedColor(product.color)}
                  className={`w-6 h-6 rounded-sm border-2 ${selectedColor === product.color ? "border-black" : "border-gray-300"
                    }`}
                  style={{ backgroundColor: product.color }}
                ></button>
              ))}
            </div>

            {/* Measurement */}
            <div>
              <select
                value={measurement}
                onChange={(e) => setMeasurement(e.target.value)}
                className="w-full p-2 border rounded-md focus:outline-none focus:ring"
              >
                <option value="" disabled>Select Measurement</option>

                {!bodyMeasurementLoading ? (
                  !bodyMeasurementError ? (
                    bodyMeasurementData && bodyMeasurementData.length > 0 ? (
                      bodyMeasurementData.map((bm: any) => (
                        <option key={bm.tag} value={bm.tag}>
                          {bm.tag}
                        </option>
                      ))
                    ) : (
                      <option value="" disabled>No measurements found</option>
                    )
                  ) : (
                    <option value="" disabled>Error loading measurements: {bodyMeasurementError}</option>
                  )
                ) : (
                  <option value="" disabled>Loading measurements...</option>
                )}
              </select>

              {/* Debug info - remove in production */}
              {bodyMeasurementData && bodyMeasurementData.length === 1 && (
                <p className="text-xs text-gray-500 mt-1">
                  Found 1 measurement. Selected: {measurement || "none"}
                </p>
              )}
            </div>

            <div className="flex items-center gap-4">

              {uniqueSleeveTypes.map((sleeveTypeValue: any) => {
                // Find the first product with this sleeve type for reference
                const product = data.productVariation.find((p: ProductVariation) => p.sleeveType === sleeveTypeValue);

                return (
                  <button
                    key={sleeveTypeValue}
                    onClick={() => {
                      setSleeveType(sleeveTypeValue);
                    }}
                    className={`px-4 py-2 rounded-md border ${sleeveType === sleeveTypeValue
                      ? "bg-black text-white text-[10px]"
                      : "bg-white text-black text-[10px]"
                      }`}
                  >
                    {sleeveTypeValue + " Sleeves"}
                  </button>
                );
              })}
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
              <p className="text-2xl font-bold">
                ₦{((product.sellingPrice || product.price) * quantity).toLocaleString()}
              </p>
            </div>

            {/* Add to Cart and Buy Now */}
            <div className="flex gap-4">
              <button onClick={() => callApi()} className="flex-1 bg-black text-white py-2 rounded-md">
                Add to Cart
              </button>
              <button className="flex-1 bg-gray-300 text-black py-2 rounded-md">
                Buy Now
              </button>
            </div>

            <div className="flex gap-[1rem] w-full items-center text-[10px]">
              <p className="md:text-sm text-gray-400">✓ FREE SHIPPING</p>
              <p className="md:text-xs text-gray-400">Product Code: {product.code}</p>
              <p className="md:text-xs text-gray-400">Tags: NEW ARRIVALS, {product.category}</p>
            </div>
          </div>

          {/* Description and Reviews */}
          <div className="col-span-2 mt-10">
            <h2 className="text-2xl font-semibold mb-4">DESCRIPTION</h2>
            <p className="text-gray-700 mb-8">
              {product.longDescription || product.shortDescription}
            </p>

            <h2 className="text-2xl font-semibold mb-4">Review (3)</h2>
            <div className="space-y-6">
              {reviews.map((review: Review, idx) => (
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
      </div>
    </>
  );
};

export default ProductDetails;