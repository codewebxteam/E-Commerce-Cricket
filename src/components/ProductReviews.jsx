import React, { useEffect, useState } from "react";
import {
  collection,
  addDoc,
  onSnapshot,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { StarIcon } from "@heroicons/react/24/solid";
import { useAuth } from "../context/AuthContext";

const ProductReviews = ({ productId }) => {
  const { currentUser } = useAuth();
  const [reviews, setReviews] = useState([]);
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState("");

  useEffect(() => {
    const ref = collection(db, "products", productId, "reviews");
    const unsub = onSnapshot(ref, (snap) => {
      setReviews(snap.docs.map((d) => d.data()));
    });
    return () => unsub();
  }, [productId]);

  const submitReview = async () => {
    if (!currentUser || !comment) return;

    await addDoc(
      collection(db, "products", productId, "reviews"),
      {
        userId: currentUser.uid,
        userName: currentUser.email,
        rating,
        comment,
        createdAt: serverTimestamp(),
      }
    );

    setComment("");
    setRating(5);
  };

  return (
    <div className="mt-10 border-t pt-6">
      <h2 className="text-xl font-bold mb-4">Ratings & Reviews</h2>

      {/* ADD REVIEW */}
      {currentUser && (
        <div className="bg-gray-50 p-4 rounded mb-6">
          <p className="font-medium mb-2">Write a review</p>

          <div className="flex gap-1 mb-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <StarIcon
                key={i}
                onClick={() => setRating(i)}
                className={`h-6 w-6 cursor-pointer ${
                  i <= rating ? "text-yellow-400" : "text-gray-300"
                }`}
              />
            ))}
          </div>

          <textarea
            className="w-full border rounded p-2 mb-2"
            placeholder="Your review..."
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />

          <button
            onClick={submitReview}
            className="bg-blue-600 text-white px-4 py-2 rounded"
          >
            Submit
          </button>
        </div>
      )}

      {/* REVIEWS LIST */}
      <div className="space-y-4">
        {reviews.map((r, i) => (
          <div key={i} className="border-b pb-3">
            <p className="font-medium">{r.userName}</p>
            <div className="flex">
              {[...Array(5)].map((_, j) => (
                <StarIcon
                  key={j}
                  className={`h-4 w-4 ${
                    j < r.rating
                      ? "text-yellow-400"
                      : "text-gray-300"
                  }`}
                />
              ))}
            </div>
            <p className="text-gray-700">{r.comment}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductReviews;
