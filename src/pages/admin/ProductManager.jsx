import React, { useState, useEffect } from "react";
import {
  addDoc,
  collection,
  deleteDoc,
  doc,
  getDocs,
  updateDoc,
} from "firebase/firestore";
import { db } from "../../firebase/config";

const CATEGORIES = [
  "Cricket Bats",
  "Cricket Balls",
  "Trophies",
  "Kit Bags",
  "Accessories",
  "Shoes",
  "Clothing",
];

const ProductManager = () => {
  const [products, setProducts] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({
    name: "",
    subtitle: "",
    description: "",
    manufacturer: "",
    price: "",
    mrp: "",
    category: "Cricket Bats",
    images: [""],
    stock: 10,
    rating: 0,
    reviewsCount: 0,
    highlights: "",
    specs: "",
  });

  const fetchProducts = async () => {
    const snap = await getDocs(collection(db, "products"));
    setProducts(snap.docs.map((d) => ({ id: d.id, ...d.data() })));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const resetForm = () => {
    setForm({
      name: "",
      subtitle: "",
      description: "",
      manufacturer: "",
      price: "",
      mrp: "",
      category: "Cricket Bats",
      images: [""],
      stock: 10,
      rating: 0,
      reviewsCount: 0,
      highlights: "",
      specs: "",
    });
    setEditingId(null);
  };

  const handleEdit = (product) => {
    // Convert arrays/objects back to string format for editing
    const highlightsStr = product.highlights ? product.highlights.join("\n") : "";
    const specsStr = product.specs
      ? Object.entries(product.specs)
        .map(([k, v]) => `${k}: ${v}`)
        .join("\n")
      : "";

    setForm({
      name: product.name || "",
      subtitle: product.subtitle || "",
      description: product.description || "",
      manufacturer: product.manufacturer || "",
      price: product.price || "",
      mrp: product.mrp || "",
      category: product.category || "Cricket Bats",
      images: product.images && product.images.length ? product.images : [""],
      stock: product.stock || 0,
      rating: product.rating || 0,
      reviewsCount: product.reviewsCount || 0,
      highlights: highlightsStr,
      specs: specsStr,
    });
    setEditingId(product.id);
    // Scroll to top to see form
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleSaveProduct = async (e) => {
    e.preventDefault();

    // Calculate discount
    const price = Number(form.price);
    const mrp = Number(form.mrp);
    let discount = 0;
    if (mrp > price) {
      discount = Math.round(((mrp - price) / mrp) * 100);
    }

    // Parse highlights
    const highlightsArray = form.highlights
      .split("\n")
      .map((line) => line.trim())
      .filter((line) => line.length > 0);

    // Parse specs
    const specsObject = {};
    form.specs.split("\n").forEach((line) => {
      const parts = line.split(":");
      if (parts.length >= 2) {
        const key = parts[0].trim();
        const value = parts.slice(1).join(":").trim();
        if (key && value) {
          specsObject[key] = value;
        }
      }
    });

    const productData = {
      name: form.name,
      subtitle: form.subtitle,
      description: form.description,
      manufacturer: form.manufacturer,
      price: price,
      mrp: mrp > 0 ? mrp : null,
      discount: discount,
      category: form.category,
      images: form.images.map((i) => i.trim()).filter(Boolean),
      stock: Number(form.stock),
      rating: Number(form.rating),
      reviewsCount: Number(form.reviewsCount),
      inStock: Number(form.stock) > 0,
      highlights: highlightsArray,
      specs: specsObject,
      updatedAt: new Date(),
    };

    if (editingId) {
      await updateDoc(doc(db, "products", editingId), productData);
    } else {
      await addDoc(collection(db, "products"), {
        ...productData,
        createdAt: new Date(),
      });
    }

    resetForm();
    fetchProducts();
  };

  const deleteProduct = async (id) => {
    if (!window.confirm("Delete product?")) return;
    await deleteDoc(doc(db, "products", id));
    fetchProducts();
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 pb-10">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-800">Product Manager</h1>
        <button className="bg-gray-900 text-white px-4 py-2 rounded-lg text-sm font-medium hover:bg-black transition">
          View Live Site
        </button>
      </div>

      <form onSubmit={handleSaveProduct} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* LEFT COLUMN - MAIN INFO (2 Cols wide) */}
        <div className="lg:col-span-2 space-y-8">

          {/* ESSENTIALS CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              {editingId ? "✏️ Edit Details" : "📝 Basic Details"}
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Product Name</label>
                <input
                  placeholder="e.g. RS 35 Players Edition"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition"
                  value={form.name}
                  onChange={(e) => setForm({ ...form, name: e.target.value })}
                  required
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Category</label>
                  <select
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    required
                  >
                    {CATEGORIES.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Subtitle / Tagline</label>
                  <input
                    placeholder="e.g. ~ God's Plan..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.subtitle}
                    onChange={(e) => setForm({ ...form, subtitle: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Manufacturer Details</label>
                <input
                  placeholder="e.g. Delux Sports Company, Punjab"
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.manufacturer}
                  onChange={(e) => setForm({ ...form, manufacturer: e.target.value })}
                />
              </div>
            </div>
          </div>

          {/* DETAIL CONTENT CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4 flex items-center gap-2">
              📄 Content & Specs
            </h2>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Long Description</label>
                <textarea
                  rows="4"
                  placeholder="Detailed product story..."
                  className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                  value={form.description}
                  onChange={(e) => setForm({ ...form, description: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Highlights (One per line)</label>
                  <textarea
                    rows="5"
                    placeholder="Grade 1 Willow&#10;Lightweight Pickup&#10;..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.highlights}
                    onChange={(e) => setForm({ ...form, highlights: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Specifications (Key: Value)</label>
                  <textarea
                    rows="5"
                    placeholder="Material: English Willow&#10;Weight: 1180g&#10;..."
                    className="w-full border border-gray-300 rounded-lg p-3 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.specs}
                    onChange={(e) => setForm({ ...form, specs: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN - SIDEBAR INFO */}
        <div className="space-y-8">
          {/* PRICING CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">💰 Pricing & Stock</h2>
            <div className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Selling Price</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: e.target.value })}
                    required
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">MRP</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-blue-500 outline-none"
                    value={form.mrp}
                    onChange={(e) => setForm({ ...form, mrp: e.target.value })}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Stock Qty</label>
                  <input
                    type="number"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={form.stock}
                    onChange={(e) => setForm({ ...form, stock: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block text-xs font-bold text-gray-500 uppercase mb-1">Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    className="w-full border border-gray-300 rounded-lg p-2"
                    value={form.rating}
                    onChange={(e) => setForm({ ...form, rating: e.target.value })}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* MEDIA CARD */}
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
            <h2 className="text-xl font-bold text-gray-800 mb-4">📸 Media</h2>
            <div className="space-y-3">
              <label className="text-sm text-gray-500">Image URLs (Google Drive / CDNs)</label>
              {form.images.map((img, i) => (
                <input
                  key={i}
                  placeholder={`Image URL ${i + 1}`}
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  value={img}
                  onChange={(e) => {
                    const updated = [...form.images];
                    updated[i] = e.target.value;
                    setForm({ ...form, images: updated });
                  }}
                />
              ))}
              <button
                type="button"
                onClick={() => setForm({ ...form, images: [...form.images, ""] })}
                className="text-blue-600 text-sm font-bold hover:underline"
              >
                + Add More
              </button>
            </div>
          </div>

          <div className="flex gap-3">
            {editingId && (
              <button
                type="button"
                onClick={resetForm}
                className="flex-1 bg-gray-200 text-gray-800 font-bold py-4 rounded-xl hover:bg-gray-300 transition"
              >
                Cancel
              </button>
            )}
            <button className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-blue-500/30 transition-transform active:scale-95">
              {editingId ? "Update Product" : "Save Product"}
            </button>
          </div>
        </div>
      </form>

      {/* PRODUCT LIST */}
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-xl font-bold text-gray-800">Inventory</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Product</th>
                <th className="p-4">Price</th>
                <th className="p-4">Stock</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {products.map((p) => (
                <tr key={p.id} className="hover:bg-blue-50/50 transition-colors">
                  <td className="p-4">
                    <div className="font-bold text-gray-900">{p.name}</div>
                    <div className="text-xs text-gray-400">{p.category}</div>
                  </td>
                  <td className="p-4 font-medium">
                    ₹{p.price}
                    {p.mrp && <span className="text-xs text-gray-400 ml-2 line-through">₹{p.mrp}</span>}
                  </td>
                  <td className="p-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold ${p.stock < 5 ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'}`}>
                      {p.stock} Units
                    </span>
                  </td>
                  <td className="p-4 text-green-600 font-bold text-xs uppercase">
                    {p.stock > 0 ? "Active" : "Out of Stock"}
                  </td>
                  <td className="p-4 text-right space-x-2">
                    <button
                      onClick={() => handleEdit(p)}
                      className="text-blue-600 hover:text-blue-800 font-medium text-xs border border-blue-200 px-3 py-1 rounded hover:bg-blue-50 transition"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => deleteProduct(p.id)}
                      className="text-red-500 hover:text-red-700 font-medium text-xs border border-red-200 px-3 py-1 rounded hover:bg-red-50 transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ProductManager;
