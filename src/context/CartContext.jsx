import React, { createContext, useContext, useEffect, useState } from "react";
import { db } from "../firebase/config";
import { useAuth } from "./AuthContext";
import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  getDoc,
} from "firebase/firestore";

const CartContext = createContext();
export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
  const { currentUser } = useAuth();
  const [cartItems, setCartItems] = useState([]);
  const [loading, setLoading] = useState(true);

  /* 🔥 REAL-TIME CART */
  useEffect(() => {
    if (!currentUser) {
      const guest = localStorage.getItem("guest-cart");
      setCartItems(guest ? JSON.parse(guest) : []);
      setLoading(false);
      return;
    }

    const cartRef = collection(db, "users", currentUser.uid, "cart");

    const unsub = onSnapshot(cartRef, (snap) => {
      const items = snap.docs.map((d) => ({
        id: d.id,
        ...d.data(),
      }));
      setCartItems(items);
      setLoading(false);
    });

    return () => unsub();
  }, [currentUser]);

  /* 💾 SAVE GUEST CART */
  useEffect(() => {
    if (!currentUser) {
      localStorage.setItem("guest-cart", JSON.stringify(cartItems));
    }
  }, [cartItems, currentUser]);

  /* 🔄 MERGE GUEST CART AFTER LOGIN */
  useEffect(() => {
    if (!currentUser) return;

    const mergeGuestCart = async () => {
      const guest = JSON.parse(localStorage.getItem("guest-cart") || "[]");

      for (const item of guest) {
        await addToCart(item, item.quantity);
      }

      localStorage.removeItem("guest-cart");
    };

    mergeGuestCart();
  }, [currentUser]);

  /* ➕ ADD / INCREMENT */
  const addToCart = async (product, qty = 1) => {
    if (!currentUser || !product?.id) {
      console.warn("addToCart: Missing user or product ID", { currentUser, product });
      return;
    }

    const ref = doc(db, "users", currentUser.uid, "cart", product.id);
    const snap = await getDoc(ref);
    const prevQty = snap.exists() ? snap.data().quantity : 0;

    await setDoc(
      ref,
      {
        productId: product.id,
        name: product.name,
        price: product.price,
        image: product.image || product.images?.[0] || "",
        quantity: prevQty + qty,
        updatedAt: serverTimestamp(),
      },
      { merge: true }
    );
  };

  /* ❌ REMOVE */
  const removeFromCart = async (productId) => {
    if (!currentUser) return;
    await deleteDoc(doc(db, "users", currentUser.uid, "cart", productId));
  };

  /* 🔁 UPDATE QTY */
  const updateQuantity = async (productId, quantity) => {
    if (!currentUser) return;
    if (quantity <= 0) return removeFromCart(productId);

    await setDoc(
      doc(db, "users", currentUser.uid, "cart", productId),
      { quantity, updatedAt: serverTimestamp() },
      { merge: true }
    );
  };

  /* 🧹 CLEAR */
  const clearCart = async () => {
    if (!currentUser) return;
    await Promise.all(
      cartItems.map((item) =>
        deleteDoc(doc(db, "users", currentUser.uid, "cart", item.id))
      )
    );
  };

  /* 💤 ABANDONED CART TRACK */
  useEffect(() => {
    if (!currentUser || cartItems.length === 0) return;

    const timer = setTimeout(async () => {
      await setDoc(
        doc(db, "abandonedCarts", currentUser.uid),
        {
          items: cartItems,
          updatedAt: serverTimestamp(),
        },
        { merge: true }
      );
    }, 120000);

    return () => clearTimeout(timer);
  }, [cartItems, currentUser]);

  return (
    <CartContext.Provider
      value={{
        cartItems,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        cartTotal: cartItems.reduce(
          (t, i) => t + i.price * i.quantity,
          0
        ),
        cartCount: cartItems.reduce((t, i) => t + i.quantity, 0),
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
};
