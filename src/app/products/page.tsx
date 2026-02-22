"use client"

import { useState } from 'react';
import { useProduct } from '@/hooks/useProduct';
import { ColorOption, SizeOption, SleeveOption } from '@/types/product';

const ProductPage = () => {
  const { product, loading, error } = useProduct('men-black-kaftan');
  const [selectedColor, setSelectedColor] = useState<ColorOption | null | undefined>(null);
  const [selectedSize, setSelectedSize] = useState<SizeOption | null | undefined>(null);
  const [selectedSleeve, setSelectedSleeve] = useState<SleeveOption | null | undefined>(null);

  useState(() => {
    if (product) {
      if(product.colors) setSelectedColor(product?.colors[0]);
      if(product.sizes) setSelectedSize(product?.sizes[1]); 
      if(product.sleeveLengths) setSelectedSleeve(product.sleeveLengths[0]);
    }
  });

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900"></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">Product Not Found</h2>
          <p className="text-gray-600">{error || 'Unable to load product'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Desktop Version */}
      <div className="hidden lg:block max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Images Section */}
          <div className="space-y-4">
            <div className="bg-gray-100 h-96 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">Product Image</span>
            </div>
            <div className="grid grid-cols-4 gap-2">
              {product.images.map((image: any, index: any) => (
                <div key={index} className="bg-gray-100 h-20 rounded flex items-center justify-center">
                  <span className="text-gray-500 text-sm">Img {index + 1}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Product Details Section */}
          <div className="space-y-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{product.title}</h1>
              <div className="mt-4 space-y-2">
                <h2 className="text-lg font-semibold">{product.subtitle}</h2>
                <ul className="text-gray-600 space-y-1">
                  {product.features.map((feature:any, index:any) => (
                    <li key={index}>• {feature}</li>
                  ))}
                </ul>
              </div>
            </div>

            <div className="border-t border-gray-200 pt-6">
              <h2 className="text-xl font-semibold mb-4">DESCRIPTION</h2>
              <div className="text-gray-600 space-y-3 whitespace-pre-line">
                {product.description}
              </div>
            </div>

            {/* Color Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3">Color</h3>
              <div className="flex space-x-3">
                {product.colors.map((color:any) => (
                  <button
                    key={color.id}
                    onClick={() => setSelectedColor(color)}
                    className={`w-10 h-10 rounded-full border-2 ${
                      selectedColor?.id === color.id ? 'border-gray-900' : 'border-gray-300'
                    }`}
                    style={{ backgroundColor: color.value }}
                    title={color.name}
                  />
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <h3 className="text-lg font-medium mb-3">Size</h3>
              <div className="flex space-x-3">
                {product.sizes.map((size: any) => (
                  <button
                    key={size.id}
                    onClick={() => setSelectedSize(size)}
                    disabled={!size.inStock}
                    className={`w-12 h-12 border rounded-lg ${
                      selectedSize?.id === size.id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700'
                    } ${
                      !size.inStock ? 'opacity-50 cursor-not-allowed' : 'hover:border-gray-400'
                    }`}
                  >
                    {size.name}
                    {!size.inStock && (
                      <span className="block text-xs text-red-500">Out</span>
                    )}
                  </button>
                ))}
              </div>
            </div>

            {/* Sleeve Length */}
            <div>
              <h3 className="text-lg font-medium mb-3">Sleeve Length</h3>
              <div className="flex space-x-4">  
                {product.sleeveLengths.map((sleeve:any) => (
                  <button
                    key={sleeve.id}
                    onClick={() => setSelectedSleeve(sleeve)}
                    className={`px-6 py-2 border rounded-lg ${
                      selectedSleeve?.id === sleeve.id
                        ? 'border-gray-900 bg-gray-900 text-white'
                        : 'border-gray-300 text-gray-700 hover:border-gray-400'
                    }`}
                  >
                    {sleeve.displayName}
                  </button>
                ))}
              </div>
            </div>

            {/* Price and Add to Cart */}
            <div className="border-t border-gray-200 pt-6">
              <div className="flex items-center justify-between mb-6">
                <span className="text-2xl font-bold text-gray-900">
                  {product.currency}{product.price.toFixed(2)}
                </span>
                <span className={`${product.inStock ? 'text-green-600' : 'text-red-600'}`}>
                  {product.inStock ? 'In Stock' : 'Out of Stock'}
                </span>
              </div>
              <button 
                className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
                disabled={!product.inStock || !selectedSize || !selectedColor || !selectedSleeve}
              >
                ADD TO CART
              </button>
              <p className="text-center text-gray-600 mt-3">
                Delivery in {product.deliveryTime}
              </p>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Reviews ({product.reviews.length})</h2>
          {product.reviews.length === 0 ? (
            <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
          ) : (
            <div className="space-y-4">
              {product.reviews.map((review:any) => (
                <div key={review.id} className="border-b border-gray-200 pb-4">
                  <div className="flex items-center space-x-2 mb-2">
                    <div className="flex text-yellow-400">
                      {'★'.repeat(review.rating)}{'☆'.repeat(5 - review.rating)}
                    </div>
                    <span className="font-medium">{review.author}</span>
                    <span className="text-gray-500 text-sm">{review.date}</span>
                  </div>
                  <p className="text-gray-600">{review.comment}</p>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Related Products */}
        <div className="mt-12 border-t border-gray-200 pt-8">
          <h2 className="text-2xl font-bold mb-6">Related Products</h2>
          <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-6">
            {product.relatedProducts.map((relatedProduct:any) => (
              <div key={relatedProduct.id} className="text-center">
                <div className="bg-gray-100 h-40 rounded-lg mb-3 flex items-center justify-center">
                  <span className="text-gray-500">{relatedProduct.name}</span>
                </div>
                <h3 className="font-medium">{relatedProduct.name}</h3>
                <p className="text-gray-600">{product.currency}{relatedProduct.price.toFixed(2)}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Mobile Version */}
      <div className="lg:hidden">
        {/* Product Image */}
        <div className="bg-gray-100 h-80 w-full flex items-center justify-center">
          <span className="text-gray-500">Product Image</span>
        </div>

        {/* Product Details */}
        <div className="p-4 space-y-4">
          <div>
            <h1 className="text-2xl font-bold text-gray-900">{product.mobileSpecific.title}</h1>
            <p className="text-lg text-gray-700 mt-1">{product.mobileSpecific.subtitle}</p>
          </div>

          {/* Color Selection */}
          <div>
            <h3 className="font-medium mb-2">INPUT COLOUR</h3>
            <div className="bg-gray-100 p-3 rounded-lg">
              <span className="text-gray-900">
                {selectedColor?.displayName || product.mobileSpecific.colorDescription}
              </span>
            </div>
            <div className="flex space-x-3 mt-3">
              {product.colors.map((color:any) => (
                <button
                  key={color.id}
                  onClick={() => setSelectedColor(color)}
                  className={`w-8 h-8 rounded-full border-2 ${
                    selectedColor?.id === color.id ? 'border-gray-900' : 'border-gray-300'
                  }`}
                  style={{ backgroundColor: color.value }}
                  title={color.name}
                />
              ))}
            </div>
          </div>

          {/* Sleeve Options */}
          <div>
            <h3 className="font-medium mb-2">Sleeve Options</h3>
            <p className="text-gray-700">Available in Short Sleeves & Long Sleeves</p>
            <div className="flex space-x-3 mt-2">
              {product.sleeveLengths.map((sleeve:any) => (
                <button
                  key={sleeve.id}
                  onClick={() => setSelectedSleeve(sleeve)}
                  className={`flex-1 py-3 border rounded-lg ${
                    selectedSleeve?.id === sleeve.id
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 text-gray-700'
                  }`}
                >
                  {sleeve.name.charAt(0).toUpperCase() + sleeve.name.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Size Range */}
          <div>
            <h3 className="font-medium mb-2">Size</h3>
            <p className="text-gray-700 text-sm mb-3">
              Range of sizes, Available in multiple sizes, Extensive size range, Wide range of sizes, Various sizes
            </p>
            <div className="grid grid-cols-5 gap-2">
              {product.sizes.map((size:any) => (
                <button
                  key={size.id}
                  onClick={() => setSelectedSize(size)}
                  disabled={!size.inStock}
                  className={`py-3 border rounded-lg ${
                    selectedSize?.id === size.id
                      ? 'border-gray-900 bg-gray-900 text-white'
                      : 'border-gray-300 text-gray-700'
                  } ${
                    !size.inStock ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                >
                  {size.name}
                </button>
              ))}
            </div>
          </div>

          {/* Tags */}
          <div className="flex flex-wrap gap-2">
            {product.mobileSpecific.tags.map((tag:any, index:any) => (
              <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>

          {/* Delivery */}
          <div className="bg-blue-50 p-3 rounded-lg">
            <p className="text-blue-900 font-medium">
              {product.deliveryTime} Delivery
            </p>
          </div>

          {/* Price and Add to Cart */}
          <div className="border-t border-gray-200 pt-4 space-y-4">
            <div className="flex justify-between items-center">
              <span className="text-2xl font-bold">PRICE TOTAL</span>
              <span className="text-2xl font-bold text-gray-900">
                {product.currency}{product.price.toFixed(2)}
              </span>
            </div>
            <button 
              className="w-full bg-gray-900 text-white py-4 px-6 rounded-lg hover:bg-gray-800 transition-colors disabled:bg-gray-400 disabled:cursor-not-allowed"
              disabled={!product.inStock || !selectedSize || !selectedColor || !selectedSleeve}
            >
              ADD TO CART
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;