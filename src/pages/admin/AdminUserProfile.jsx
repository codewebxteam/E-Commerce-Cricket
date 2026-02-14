import React, { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { doc, getDoc, collection, getDocs, orderBy, query } from "firebase/firestore";
import { db } from "../../firebase/config";
import { UserCircleIcon, ShoppingBagIcon, CalendarIcon, ArrowLeftIcon, EnvelopeIcon, PhoneIcon } from "@heroicons/react/24/outline";

const AdminUserProfile = () => {
    const { uid } = useParams();
    const [user, setUser] = useState(null);
    const [stats, setStats] = useState({
        totalOrders: 0,
        totalSpent: 0,
        lastOrderDate: "N/A"
    });
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                // Fetch User Details
                const userDoc = await getDoc(doc(db, "users", uid));
                if (userDoc.exists()) {
                    setUser(userDoc.data());
                }

                // Fetch User Orders Stats
                const ordersRef = collection(db, "users", uid, "orders");
                const q = query(ordersRef, orderBy("createdAt", "desc"));
                const orderSnap = await getDocs(q);

                const orders = orderSnap.docs.map(d => d.data());

                const totalSpent = orders.reduce((sum, order) => sum + (Number(order.totalAmount) || 0), 0);
                const lastOrderDate = orders.length > 0 && orders[0].createdAt
                    ? orders[0].createdAt.toDate().toLocaleDateString()
                    : "No orders yet";

                setStats({
                    totalOrders: orders.length,
                    totalSpent,
                    lastOrderDate
                });

            } catch (error) {
                console.error("Error fetching user details:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchUserData();
    }, [uid]);

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-600"></div>
        </div>
    );

    if (!user) return (
        <div className="p-8 text-center bg-gray-50 min-h-screen">
            <h2 className="text-2xl font-bold text-gray-700">User not found</h2>
            <Link to="/admin/users" className="text-blue-600 hover:underline mt-4 inline-block">Go Back</Link>
        </div>
    );

    return (
        <div className="p-6 max-w-5xl mx-auto space-y-6">
            <Link to="/admin/users" className="inline-flex items-center gap-2 text-gray-500 hover:text-blue-600 transition-colors mb-4 font-medium">
                <ArrowLeftIcon className="w-5 h-5" /> Back to Users
            </Link>

            <div className="bg-white rounded-3xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="bg-gradient-to-r from-blue-600 to-indigo-700 h-32 relative">
                    <div className="absolute -bottom-16 left-8">
                        <div className="w-32 h-32 bg-white rounded-full p-2 shadow-lg">
                            <div className="w-full h-full bg-gray-100 rounded-full flex items-center justify-center text-gray-400 text-4xl font-bold">
                                {user.email?.[0].toUpperCase()}
                            </div>
                        </div>
                    </div>
                </div>

                <div className="pt-20 px-8 pb-8">
                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-black text-gray-900">{user.displayName || "No Name"}</h1>
                            <div className="flex items-center gap-4 mt-2 text-gray-600 font-medium">
                                <span className="flex items-center gap-1"><EnvelopeIcon className="w-5 h-5" /> {user.email}</span>
                                <span className="flex items-center gap-1"><PhoneIcon className="w-5 h-5" /> {user.phoneNumber || "No Phone"}</span>
                            </div>
                        </div>
                        <div className="px-4 py-2 bg-blue-50 text-blue-700 rounded-lg border border-blue-100 font-bold uppercase text-xs tracking-wider">
                            Role: {user.role || "User"}
                        </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-12">
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2 text-gray-500">
                                <ShoppingBagIcon className="w-6 h-6" />
                                <span className="font-bold text-sm uppercase">Total Orders</span>
                            </div>
                            <p className="text-3xl font-black text-gray-900">{stats.totalOrders}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2 text-gray-500">
                                <span className="text-xl font-bold">₹</span>
                                <span className="font-bold text-sm uppercase">Total Spent</span>
                            </div>
                            <p className="text-3xl font-black text-gray-900">₹{stats.totalSpent.toLocaleString()}</p>
                        </div>
                        <div className="bg-gray-50 p-6 rounded-2xl border border-gray-100">
                            <div className="flex items-center gap-3 mb-2 text-gray-500">
                                <CalendarIcon className="w-6 h-6" />
                                <span className="font-bold text-sm uppercase">Last Order</span>
                            </div>
                            <p className="text-xl font-bold text-gray-900">{stats.lastOrderDate}</p>
                        </div>
                    </div>

                    <div className="mt-12">
                        <h2 className="text-lg font-bold text-gray-900 mb-4">Account Information</h2>
                        <div className="bg-white border border-gray-200 rounded-xl overflow-hidden">
                            <table className="w-full text-sm text-left">
                                <tbody className="divide-y divide-gray-100">
                                    <tr>
                                        <th className="px-6 py-4 bg-gray-50 w-1/3 text-gray-500 font-medium">User ID</th>
                                        <td className="px-6 py-4 font-mono text-gray-600">{uid}</td>
                                    </tr>
                                    <tr>
                                        <th className="px-6 py-4 bg-gray-50 text-gray-500 font-medium">Joined Date</th>
                                        <td className="px-6 py-4 text-gray-600">
                                            {user.createdAt?.toDate ? user.createdAt.toDate().toLocaleDateString() : "Unknown"}
                                        </td>
                                    </tr>
                                    <tr>
                                        <th className="px-6 py-4 bg-gray-50 text-gray-500 font-medium">Address</th>
                                        <td className="px-6 py-4 text-gray-600">
                                            {user.address ? (
                                                <>
                                                    {user.address.addressLine}, {user.address.city} - {user.address.pincode}
                                                </>
                                            ) : "No Address Saved"}
                                        </td>
                                    </tr>
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminUserProfile;
