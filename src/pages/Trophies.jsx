import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Link, useNavigate } from "react-router-dom";
import ProductGrid from "../components/ProductGrid";
import { ArrowLeftIcon, FunnelIcon } from "@heroicons/react/24/outline";
import { db } from "../firebase/config";
import { collection, onSnapshot } from "firebase/firestore";

const Trophies = () => {
  const navigate = useNavigate();

  const [trophies, setTrophies] = useState([]);
  const [filteredTrophies, setFilteredTrophies] = useState([]);
  const [loading, setLoading] = useState(true);

  const [filters, setFilters] = useState({
    priceRange: [0, 100000],
    size: "all",
    material: "all",
    rating: 0,
    sortBy: "name",
    inStock: false,
  });

  const trophySizes = [
    "all",
    "Small (Under 15cm)",
    "Medium (15-25cm)",
    "Large (Over 25cm)",
  ];

  const trophyMaterials = ["all", "Metal", "Wood", "Acrylic", "Crystal"];

  const sortOptions = [
    { value: "name", label: "Name (A-Z)" },
    { value: "price-low", label: "Price: Low to High" },
    { value: "price-high", label: "Price: High to Low" },
    { value: "rating", label: "Highest Rated" },
  ];

  /* ---------------- FIREBASE FETCH ---------------- */
  useEffect(() => {
    const unsub = onSnapshot(collection(db, "products"), (snap) => {
      const list = snap.docs
        .map((doc) => ({ id: doc.id, ...doc.data() }))
        .filter((p) => p.category === "trophies");

      setTrophies(list);
      setLoading(false);
    });

    return () => unsub();
  }, []);

  /* ---------------- FILTER LOGIC ---------------- */
  useEffect(() => {
    let filtered = [...trophies];

    if (filters.size !== "all") {
      filtered = filtered.filter((t) => t.size === filters.size);
    }

    if (filters.material !== "all") {
      filtered = filtered.filter((t) => t.material === filters.material);
    }

    filtered = filtered.filter(
      (t) =>
        t.price >= filters.priceRange[0] &&
        t.price <= filters.priceRange[1]
    );

    if (filters.rating > 0) {
      filtered = filtered.filter((t) => t.rating >= filters.rating);
    }

    if (filters.inStock) {
      filtered = filtered.filter((t) => t.inStock);
    }

    filtered.sort((a, b) => {
      if (filters.sortBy === "price-low") return a.price - b.price;
      if (filters.sortBy === "price-high") return b.price - a.price;
      if (filters.sortBy === "rating") return b.rating - a.rating;
      return a.name.localeCompare(b.name);
    });

    setFilteredTrophies(filtered);
  }, [filters, trophies]);

  const handleFilterChange = (key, value) => {
    setFilters((prev) => ({ ...prev, [key]: value }));
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* HEADER */}
      <div className="bg-gradient-to-r from-yellow-500 to-yellow-600 text-white py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-3 mb-4">
            <button
              onClick={() => navigate(-1)}
              className="flex items-center gap-2 text-yellow-100"
            >
              <ArrowLeftIcon className="h-5 w-5" />
              Back
            </button>
            /
            <Link to="/" className="text-yellow-100">
              Home
            </Link>
            /
            <span>Trophies</span>
          </div>

          <h1 className="text-4xl font-bold mb-2">
            Premium Trophies & Awards
          </h1>
          <p className="text-yellow-100">
            {filteredTrophies.length} trophies available
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* SIDEBAR */}
          <div className="lg:w-64 space-y-6">
            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3 flex items-center">
                <FunnelIcon className="h-4 w-4 mr-2" />
                Size
              </h3>
              {trophySizes.map((s) => (
                <label key={s} className="flex items-center text-sm mb-1">
                  <input
                    type="radio"
                    checked={filters.size === s}
                    onChange={() => handleFilterChange("size", s)}
                    className="mr-2"
                  />
                  {s === "all" ? "All Sizes" : s}
                </label>
              ))}
            </div>

            <div className="bg-white p-4 rounded shadow">
              <h3 className="font-semibold mb-3">Material</h3>
              {trophyMaterials.map((m) => (
                <label key={m} className="flex items-center text-sm mb-1">
                  <input
                    type="radio"
                    checked={filters.material === m}
                    onChange={() => handleFilterChange("material", m)}
                    className="mr-2"
                  />
                  {m === "all" ? "All Materials" : m}
                </label>
              ))}
            </div>

            <button
              onClick={() =>
                setFilters({
                  priceRange: [0, 100000],
                  size: "all",
                  material: "all",
                  rating: 0,
                  sortBy: "name",
                  inStock: false,
                })
              }
              className="w-full border py-2 rounded"
            >
              Clear Filters
            </button>
          </div>

          {/* MAIN */}
          <div className="flex-1">
            <div className="flex justify-between mb-6">
              <div>
                <h2 className="text-2xl font-bold">Trophies</h2>
                <p className="text-gray-600">
                  {filteredTrophies.length} items
                </p>
              </div>

              <select
                value={filters.sortBy}
                onChange={(e) =>
                  handleFilterChange("sortBy", e.target.value)
                }
                className="border px-3 py-2 rounded"
              >
                {sortOptions.map((o) => (
                  <option key={o.value} value={o.value}>
                    {o.label}
                  </option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {[...Array(6)].map((_, i) => (
                  <div
                    key={i}
                    className="bg-white h-64 rounded animate-pulse"
                  />
                ))}
              </div>
            ) : (
              <ProductGrid products={filteredTrophies} viewMode="grid" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Trophies;
