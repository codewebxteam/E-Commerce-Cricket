import React, { useState, useEffect } from "react";
import { useAuth } from "../../context/AuthContext";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { FaUser, FaPhone, FaEnvelope, FaMapMarkerAlt, FaCity, FaSave, FaBuilding } from "react-icons/fa";

const Profile = () => {
    const { currentUser } = useAuth();
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        displayName: "",
        phone: "",
        address: {
            fullName: "",
            phone: "",
            pincode: "",
            addressLine: "",
            city: "",
            state: "",
        },
    });

    useEffect(() => {
        if (!currentUser) return;
        const fetchUser = async () => {
            try {
                const snap = await getDoc(doc(db, "users", currentUser.uid));
                if (snap.exists()) {
                    const data = snap.data();
                    setFormData({
                        displayName: data.displayName || currentUser.displayName || "",
                        phone: data.phone || "",
                        address: {
                            fullName: data.address?.fullName || "",
                            phone: data.address?.phone || "",
                            pincode: data.address?.pincode || "",
                            addressLine: data.address?.addressLine || "",
                            city: data.address?.city || "",
                            state: data.address?.state || "",
                        },
                    });
                }
            } catch (err) {
                console.error("Error fetching user data:", err);
                toast.error("Could not load profile data");
            } finally {
                setLoading(false);
            }
        };
        fetchUser();
    }, [currentUser]);

    const handleSave = async (e) => {
        e.preventDefault();
        setSaving(true);
        try {
            await updateDoc(doc(db, "users", currentUser.uid), {
                displayName: formData.displayName,
                phone: formData.phone,
                address: formData.address,
                updatedAt: new Date(),
            });
            toast.success("Profile updated successfully!");
        } catch (error) {
            console.error("Error saving profile:", error);
            toast.error("Failed to save profile.");
        } finally {
            setSaving(false);
        }
    };

    if (loading) return (
        <div className="min-h-screen flex items-center justify-center bg-gray-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-600"></div>
        </div>
    );

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
            <div className="max-w-5xl mx-auto">
                <div className="text-center mb-10">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Account Settings</h1>
                    <p className="mt-2 text-lg text-gray-500">Manage your profile details and shipping address</p>
                </div>

                <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-3 gap-8">

                    {/* Left Column: Personal Info */}
                    <div className="lg:col-span-1 space-y-6">
                        <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-indigo-600 px-6 py-4">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FaUser className="opacity-80" /> Personal Details
                                </h2>
                            </div>
                            <div className="p-6 space-y-5">
                                <InputGroup label="Full Name" icon={<FaUser />}>
                                    <input
                                        type="text"
                                        className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors py-2.5 bg-white border text-gray-900 font-medium"
                                        value={formData.displayName}
                                        onChange={(e) => setFormData(prev => ({ ...prev, displayName: e.target.value }))}
                                        placeholder="Enter your name"
                                    />
                                </InputGroup>

                                <InputGroup label="Phone Number" icon={<FaPhone />}>
                                    <input
                                        type="tel"
                                        className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 transition-colors py-2.5 bg-white border text-gray-900 font-medium"
                                        value={formData.phone}
                                        onChange={(e) => setFormData(prev => ({ ...prev, phone: e.target.value }))}
                                        placeholder="+91..."
                                    />
                                </InputGroup>

                                <InputGroup label="Email Address" icon={<FaEnvelope />}>
                                    <input
                                        type="email"
                                        className="pl-10 block w-full border-gray-300 rounded-lg bg-gray-100 text-gray-500 cursor-not-allowed py-2.5 border font-medium"
                                        value={currentUser?.email}
                                        disabled
                                    />
                                </InputGroup>
                            </div>
                        </section>
                    </div>

                    {/* Right Column: Address Book */}
                    <div className="lg:col-span-2 space-y-6">
                        <section className="bg-white rounded-2xl shadow-md border border-gray-200 overflow-hidden">
                            <div className="bg-slate-800 px-6 py-4 flex justify-between items-center">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <FaMapMarkerAlt className="opacity-80" /> Shipping Address
                                </h2>
                                <span className="text-xs text-gray-200 bg-slate-600 px-2.5 py-1 rounded-full border border-slate-500">Default</span>
                            </div>

                            <div className="p-6">
                                <p className="text-sm text-gray-600 mb-6 bg-blue-50 text-blue-800 p-4 rounded-xl border border-blue-100 flex items-center gap-2">
                                    <FaMapMarkerAlt /> This address will be the default selected option during checkout.
                                </p>

                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <InputGroup label="Receiver Name" icon={<FaUser />}>
                                        <input
                                            className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2.5 bg-white border text-gray-900 font-medium"
                                            value={formData.address.fullName}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, fullName: e.target.value } }))}
                                            placeholder="John Doe"
                                        />
                                    </InputGroup>

                                    <InputGroup label="Receiver Phone" icon={<FaPhone />}>
                                        <input
                                            className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2.5 bg-white border text-gray-900 font-medium"
                                            value={formData.address.phone}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, phone: e.target.value } }))}
                                            placeholder="Mobile Number"
                                        />
                                    </InputGroup>

                                    <InputGroup label="Pincode" icon={<FaMapMarkerAlt />}>
                                        <input
                                            className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2.5 bg-white border text-gray-900 font-medium"
                                            value={formData.address.pincode}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, pincode: e.target.value } }))}
                                            placeholder="123456"
                                        />
                                    </InputGroup>

                                    <InputGroup label="City" icon={<FaCity />}>
                                        <input
                                            className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2.5 bg-white border text-gray-900 font-medium"
                                            value={formData.address.city}
                                            onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, city: e.target.value } }))}
                                            placeholder="New York"
                                        />
                                    </InputGroup>

                                    <div className="md:col-span-2">
                                        <InputGroup label="Full Address" icon={<FaBuilding />} isTextArea>
                                            <textarea
                                                className="pl-10 block w-full border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 py-2.5 bg-white border min-h-[100px] text-gray-900 font-medium"
                                                value={formData.address.addressLine}
                                                onChange={(e) => setFormData(prev => ({ ...prev, address: { ...prev.address, addressLine: e.target.value } }))}
                                                placeholder="House No., Building Name, Street, Area"
                                            />
                                        </InputGroup>
                                    </div>
                                </div>

                                <div className="mt-8 flex justify-end pt-6 border-t border-gray-100">
                                    <button
                                        type="submit"
                                        disabled={saving}
                                        className="inline-flex items-center gap-2 bg-indigo-600 text-white px-8 py-3 rounded-xl font-bold hover:bg-indigo-700 transition duration-200 shadow-md hover:shadow-lg disabled:opacity-70 disabled:cursor-not-allowed"
                                    >
                                        {saving ? (
                                            <>
                                                <div className="animate-spin h-4 w-4 border-2 border-white border-t-transparent rounded-full"></div>
                                                Saving...
                                            </>
                                        ) : (
                                            <>
                                                <FaSave /> Save Changes
                                            </>
                                        )}
                                    </button>
                                </div>
                            </div>
                        </section>
                    </div>
                </form>
            </div>
        </div>
    );
};

const InputGroup = ({ label, icon, children, isTextArea }) => (
    <div className="space-y-1">
        <label className="block text-sm font-semibold text-gray-700">{label}</label>
        <div className="relative rounded-md shadow-sm">
            <div className={`absolute left-0 pl-3 flex pointer-events-none text-gray-400 ${isTextArea ? 'top-3' : 'inset-y-0 items-center'}`}>
                {icon}
            </div>
            {children}
        </div>
    </div>
);

export default Profile;
