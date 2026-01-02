import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { db } from "../firebase/config";
import { doc, getDoc } from "firebase/firestore";
import { motion } from "framer-motion";
import { CheckCircle, Package, ArrowRight, ShoppingBag } from "lucide-react";

const OrderSuccess = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const snap = await getDoc(doc(db, "orders", id));
                if (snap.exists()) {
                    setOrder(snap.data());
                }
            } catch (error) {
                console.error("Error fetching order:", error);
            } finally {
                setLoading(false);
            }
        };
        if (id) fetchOrder();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <div className="w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4 sm:p-6">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-white p-8 sm:p-12 rounded-[2.5rem] shadow-2xl max-w-xl w-full text-center border border-gray-100 relative overflow-hidden"
            >
                {/* Decorative background element */}
                <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-blue-600 to-indigo-600" />

                <div className="w-24 h-24 bg-blue-50 rounded-full flex items-center justify-center mx-auto mb-8 shadow-inner">
                    <motion.div
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ type: "spring", damping: 12, stiffness: 200, delay: 0.2 }}
                    >
                        <CheckCircle className="w-12 h-12 text-blue-600" />
                    </motion.div>
                </div>

                <h1 className="text-4xl font-black text-gray-900 mb-3 tracking-tight">Order Confirmed!</h1>
                <p className="text-gray-500 mb-10 font-medium max-w-sm mx-auto">
                    Excellent choice! We've received your order and our team is already preparing your gear for the field.
                </p>

                <div className="bg-gray-50 rounded-3xl p-8 mb-10 text-left border border-gray-100 space-y-6">
                    <div className="flex justify-between items-center pb-6 border-b border-gray-200">
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Order ID</p>
                            <p className="font-mono text-sm text-blue-600 font-bold">#{id?.slice(0, 12)}</p>
                        </div>
                        <div className="text-right">
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Total Paid</p>
                            <p className="text-xl font-black text-gray-900">₹{order?.totalAmount}</p>
                        </div>
                    </div>

                    <div className="flex gap-4 items-start">
                        <div className="bg-white p-3 rounded-2xl shadow-sm border border-gray-100">
                            <Package className="w-5 h-5 text-blue-600" />
                        </div>
                        <div>
                            <p className="text-[10px] text-gray-400 uppercase font-black tracking-widest mb-1">Shipping To</p>
                            <p className="text-sm font-bold text-gray-900">{order?.shippingAddress?.fullName}</p>
                            <p className="text-xs text-gray-500 font-medium">{order?.shippingAddress?.city}, {order?.shippingAddress?.state} - {order?.shippingAddress?.pincode}</p>
                        </div>
                    </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <Link
                        to="/orders"
                        className="group flex items-center justify-center gap-2 bg-gray-900 text-white py-4 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl hover:bg-black transition-all active:scale-95"
                    >
                        Track Order <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                    <Link
                        to="/products"
                        className="flex items-center justify-center gap-2 bg-white text-gray-900 py-4 rounded-2xl font-black text-xs uppercase tracking-widest border-2 border-gray-100 hover:bg-gray-50 transition-all active:scale-95"
                    >
                        <ShoppingBag className="w-4 h-4" /> Keep Shopping
                    </Link>
                </div>
            </motion.div>

            <p className="mt-8 text-gray-400 text-xs font-medium">A confirmation email has been sent to your inbox.</p>
        </div>
    );
};

export default OrderSuccess;
