import React from "react";
import { StarIcon } from "@heroicons/react/24/solid";

const ProductFilter = ({
  filters,
  onFilterChange,
  categories,
  showTrophyFilter = true,
}) => {
  const brands = [
    "All Brands",
    "Gray-Nicolls",
    "Kookaburra",
    "SS",
    "GM",
    "Adidas",
    "New Balance",
    "CricketPro",
  ];

  const trophySizes = [
    "all",
    "Small (Under 15cm)",
    "Medium (15-25cm)",
    "Large (Over 25cm)",
  ];

  const trophyMaterials = [
    "all",
    "Metal",
    "Wood",
    "Acrylic",
    "Crystal",
  ];

  return (
    <div className="space-y-6">
      {/* CATEGORY */}
      {showTrophyFilter && categories && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Category</h3>
          <div className="space-y-2">
            {categories.map((cat) => (
              <label key={cat.id} className="flex items-center">
                <input
                  type="radio"
                  name="category"
                  value={cat.id}
                  checked={filters.category === cat.id}
                  onChange={(e) =>
                    onFilterChange("category", e.target.value)
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 flex items-center">
                  {cat.icon && <span className="mr-2">{cat.icon}</span>}
                  {cat.name}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* BRAND */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Brand</h3>
        <select
          value={filters.brand}
          onChange={(e) => onFilterChange("brand", e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-lg"
        >
          {brands.map((brand) => (
            <option
              key={brand}
              value={brand === "All Brands" ? "all" : brand}
            >
              {brand}
            </option>
          ))}
        </select>
      </div>

      {/* 🏆 TROPHY SIZE */}
      {showTrophyFilter && filters.category === "trophies" && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Trophy Size</h3>
          <div className="space-y-2">
            {trophySizes.map((size) => (
              <label key={size} className="flex items-center">
                <input
                  type="radio"
                  name="size"
                  value={size}
                  checked={filters.size === size}
                  onChange={(e) =>
                    onFilterChange("size", e.target.value)
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700">
                  {size === "all" ? "All Sizes" : size}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* 🏆 TROPHY MATERIAL */}
      {showTrophyFilter && filters.category === "trophies" && (
        <div className="bg-white rounded-lg shadow-sm p-4">
          <h3 className="font-semibold text-gray-900 mb-3">Material</h3>
          <div className="space-y-2">
            {trophyMaterials.map((material) => (
              <label key={material} className="flex items-center">
                <input
                  type="radio"
                  name="material"
                  value={material}
                  checked={filters.material === material}
                  onChange={(e) =>
                    onFilterChange("material", e.target.value)
                  }
                  className="mr-2"
                />
                <span className="text-sm text-gray-700 capitalize">
                  {material === "all" ? "All Materials" : material}
                </span>
              </label>
            ))}
          </div>
        </div>
      )}

      {/* PRICE */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">Price Range</h3>
        <input
          type="range"
          min="0"
          max="10000"
          value={filters.priceRange[1]}
          onChange={(e) =>
            onFilterChange("priceRange", [
              0,
              parseInt(e.target.value),
            ])
          }
          className="w-full"
        />
        <div className="flex justify-between text-sm text-gray-600">
          <span>₹0</span>
          <span>₹{filters.priceRange[1]}</span>
        </div>
      </div>

      {/* RATING */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <h3 className="font-semibold text-gray-900 mb-3">
          Minimum Rating
        </h3>
        {[4, 3, 2, 1, 0].map((rating) => (
          <label key={rating} className="flex items-center mb-2">
            <input
              type="radio"
              name="rating"
              value={rating}
              checked={filters.rating === rating}
              onChange={(e) =>
                onFilterChange("rating", parseInt(e.target.value))
              }
              className="mr-2"
            />
            <div className="flex items-center">
              {[...Array(5)].map((_, i) => (
                <StarIcon
                  key={i}
                  className={`h-4 w-4 ${
                    i < rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
              <span className="ml-2 text-sm text-gray-600">
                {rating === 0 ? "All Ratings" : `${rating}+ stars`}
              </span>
            </div>
          </label>
        ))}
      </div>

      {/* STOCK */}
      <div className="bg-white rounded-lg shadow-sm p-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={filters.inStock}
            onChange={(e) =>
              onFilterChange("inStock", e.target.checked)
            }
            className="mr-2"
          />
          <span>In Stock Only</span>
        </label>
      </div>

      {/* CLEAR */}
      <button
        onClick={() => {
          onFilterChange("category", "all");
          onFilterChange("brand", "all");
          onFilterChange("rating", 0);
          onFilterChange("inStock", false);
          onFilterChange("priceRange", [0, 10000]);
          onFilterChange("size", "all");
          onFilterChange("material", "all");
        }}
        className="w-full py-2 border border-gray-300 rounded-lg hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </div>
  );
};

export default ProductFilter;
