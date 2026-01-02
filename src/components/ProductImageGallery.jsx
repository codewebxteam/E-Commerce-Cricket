import { useState } from "react";
import { getDirectImageUrl } from "../utils/imageUtils";

const ProductImageGallery = ({ images = [], isNew }) => {
  const [selectedImage, setSelectedImage] = useState(0);

  if (!images.length) return <div className="bg-gray-100 rounded-xl h-96 flex items-center justify-center text-gray-400">No Image</div>;

  return (
    <div className="space-y-4">
      {/* Main Image Stage */}
      <div className="relative bg-white rounded-3xl overflow-hidden border border-gray-100 shadow-sm aspect-square flex items-center justify-center p-4">
        {isNew && (
          <span className="absolute top-4 left-4 bg-green-600 text-white text-xs font-bold px-3 py-1 rounded-full z-10 shadow-md">
            NEW
          </span>
        )}
        <img
          src={getDirectImageUrl(images[selectedImage])}
          className="max-h-full max-w-full object-contain hover:scale-105 transition-transform duration-500"
          alt="Product Main"
        />
      </div>

      {/* Thumbnails */}
      {images.length > 1 && (
        <div className="flex gap-2 overflow-x-auto pb-2 scrollbar-hide">
          {images.map((img, i) => (
            <button
              key={i}
              onClick={() => setSelectedImage(i)}
              className={`min-w-[80px] w-20 h-20 rounded-xl border-2 overflow-hidden bg-white p-1 transition-all ${selectedImage === i ? "border-black ring-2 ring-black/20" : "border-transparent opacity-60 hover:opacity-100"
                }`}
            >
              <img
                src={getDirectImageUrl(img)}
                className="w-full h-full object-contain"
                alt={`Thumb ${i}`}
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ProductImageGallery;
