import React, { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase/config";

const AdminAnalytics = () => {
  const [stats, setStats] = useState({
    orders: 0,
    revenue: 0,
    users: 0,
  });

  useEffect(() => {
    const load = async () => {
      const ordersSnap = await getDocs(collection(db, "orders"));
      const usersSnap = await getDocs(collection(db, "users"));

      let revenue = 0;
      ordersSnap.forEach((d) => {
        revenue += d.data().totalAmount || 0;
      });

      setStats({
        orders: ordersSnap.size,
        users: usersSnap.size,
        revenue,
      });
    };

    load();
  }, []);

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card title="Total Orders" value={stats.orders} />
      <Card title="Total Users" value={stats.users} />
      <Card title="Revenue" value={`₹${stats.revenue}`} />
    </div>
  );
};

const Card = ({ title, value }) => (
  <div className="bg-white p-6 rounded-lg shadow">
    <p className="text-gray-500">{title}</p>
    <h2 className="text-2xl font-bold">{value}</h2>
  </div>
);

export default AdminAnalytics;
