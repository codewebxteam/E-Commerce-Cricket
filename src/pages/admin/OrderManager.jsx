import React, { useEffect, useState } from "react";
import { collection, query, orderBy, getDocs, updateDoc, doc, where, writeBatch } from "firebase/firestore";
import { db } from "../../firebase/config";
import toast from "react-hot-toast";
import { XMarkIcon } from "@heroicons/react/24/outline";

const OrderManager = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const [expandedOrder, setExpandedOrder] = useState(null);

  // Modal State for Shipping
  const [showShipModal, setShowShipModal] = useState(false);
  const [shippingData, setShippingData] = useState({
    orderId: null,
    deliveryPartner: "",
    awbId: ""
  });

  const ORDERS_PER_PAGE = 10;

  const fetchOrders = async () => {
    try {
      const q = query(collection(db, "orders"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setOrders(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);

    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const initiateStatusUpdate = (orderId, newStatus) => {
    if (newStatus === "shipped") {
      setShippingData({ orderId, deliveryPartner: "Delhivery", awbId: "" });
      setShowShipModal(true);
    } else {
      updateOrderStatus(orderId, newStatus);
    }
  };

  const updateOrderStatus = async (orderId, newStatus, additionalData = {}) => {
    if (!window.confirm(`Update status to ${newStatus}?`)) return;

    try {
      const order = orders.find(o => o.id === orderId);
      if (!order) return;

      const batch = writeBatch(db);

      // 1. Update global order
      const orderRef = doc(db, "orders", orderId);
      batch.update(orderRef, {
        status: newStatus,
        ...additionalData,
        ...(newStatus === "shipped" ? { shippedAt: new Date() } : {})
      });

      // 2. Sync to user's order copy
      if (order.userId) {
        const userOrdersRef = collection(db, "users", order.userId, "orders");
        const userOrderQuery = query(userOrdersRef, where("orderId", "==", orderId));
        const userOrderSnap = await getDocs(userOrderQuery);

        userOrderSnap.docs.forEach((docSnap) => {
          batch.update(docSnap.ref, {
            status: newStatus,
            ...additionalData,
            ...(newStatus === "shipped" ? { shippedAt: new Date() } : {})
          });
        });
      }

      await batch.commit();

      // Update local state
      setOrders(orders.map(o => o.id === orderId ? { ...o, status: newStatus, ...additionalData } : o));
      toast.success(`Order status updated to ${newStatus}`);
      setShowShipModal(false);
    } catch (error) {
      console.error("Update failed", error);
      toast.error("Failed to update status");
    }
  };

  const handleShipSubmit = (e) => {
    e.preventDefault();
    if (!shippingData.deliveryPartner || !shippingData.awbId) {
      toast.error("Please fill all shipping details");
      return;
    }
    updateOrderStatus(shippingData.orderId, "shipped", {
      deliveryPartner: shippingData.deliveryPartner,
      awbId: shippingData.awbId
    });
  };

  const filteredOrders = statusFilter === "all"
    ? orders
    : orders.filter(o => o.status === statusFilter);

  // Pagination
  const totalPages = Math.ceil(filteredOrders.length / ORDERS_PER_PAGE);
  const paginatedOrders = filteredOrders.slice(
    (currentPage - 1) * ORDERS_PER_PAGE,
    currentPage * ORDERS_PER_PAGE
  );

  // Reset page when filter changes
  useEffect(() => {
    setCurrentPage(1);
  }, [statusFilter]);

  return (
    <div className="max-w-6xl mx-auto space-y-6 relative">

      {/* SHIPPING MODAL */}
      {showShipModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-6 animate-scaleIn">
            <div className="flex justify-between items-center mb-6">
              <h3 className="text-xl font-bold text-gray-900">Mark as Shipped</h3>
              <button onClick={() => setShowShipModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                <XMarkIcon className="w-6 h-6 text-gray-400" />
              </button>
            </div>

            <form onSubmit={handleShipSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Delivery Partner</label>
                <select
                  className="w-full border border-gray-300 rounded-lg p-3 font-medium"
                  value={shippingData.deliveryPartner}
                  onChange={(e) => setShippingData({ ...shippingData, deliveryPartner: e.target.value })}
                >
                  <option value="Delhivery">Delhivery</option>
                  <option value="BlueDart">BlueDart</option>
                  <option value="DTDC">DTDC</option>
                  <option value="XpressBees">XpressBees</option>
                  <option value="Other">Other</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">AWB / Tracking ID</label>
                <input
                  type="text"
                  className="w-full border border-gray-300 rounded-lg p-3 font-medium focus:ring-2 focus:ring-blue-500 outline-none"
                  placeholder="e.g. 1234567890"
                  value={shippingData.awbId}
                  onChange={(e) => setShippingData({ ...shippingData, awbId: e.target.value })}
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white font-bold py-3 rounded-xl hover:bg-blue-700 transition"
              >
                Confirm Shipment
              </button>
            </form>
          </div>
        </div>
      )}

      <div className="flex justify-between items-center bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
        <h1 className="text-3xl font-bold text-gray-800">Order Management</h1>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-300 rounded-lg p-2 bg-gray-50 font-medium outline-none focus:ring-2 focus:ring-blue-500"
        >
          <option value="all">All Orders ({orders.length})</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-gray-50 text-gray-500 uppercase tracking-wider font-semibold">
              <tr>
                <th className="p-4">Order ID / Date</th>
                <th className="p-4">Customer</th>
                <th className="p-4">Items / Total</th>
                <th className="p-4">Status</th>
                <th className="p-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {paginatedOrders.map(order => (
                <React.Fragment key={order.id}>
                  <tr
                    className="hover:bg-blue-50/50 transition-colors cursor-pointer"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <td className="p-4">
                      <p className="font-mono font-bold text-gray-900">#{order.id.slice(0, 8)}</p>
                      <p className="text-xs text-gray-500">{order.createdAt?.toDate().toLocaleDateString()}</p>
                      <p className="text-xs text-gray-400">{order.paymentMethod?.toUpperCase()}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900">{order.shippingAddress?.fullName}</p>
                      <p className="text-xs text-gray-500">{order.shippingAddress?.phone}</p>
                      <p className="text-xs text-gray-400">{order.shippingAddress?.city}, {order.shippingAddress?.state}</p>
                    </td>
                    <td className="p-4">
                      <p className="font-bold text-gray-900">₹{order.totalAmount}</p>
                      <p className="text-xs text-gray-500">{order.items?.length} Items</p>
                    </td>
                    <td className="p-4">
                      <span className={`px-2 py-1 rounded text-xs font-bold uppercase tracking-wide ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                        order.status === 'shipped' ? 'bg-blue-100 text-blue-700' :
                          order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                            'bg-yellow-100 text-yellow-700'
                        }`}>
                        {order.status}
                      </span>
                    </td>
                    <td className="p-4 text-right" onClick={(e) => e.stopPropagation()}>
                      <select
                        className="border border-gray-200 rounded px-2 py-1 text-xs font-bold text-gray-700 outline-none hover:border-gray-400 transition"
                        value={order.status}
                        onChange={(e) => initiateStatusUpdate(order.id, e.target.value)}
                      >
                        <option value="pending">Pending</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    </td>
                  </tr>

                  {/* Expanded row - full address details */}
                  {expandedOrder === order.id && (
                    <tr className="bg-blue-50/30">
                      <td colSpan="5" className="p-4">
                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                          <div>
                            <p className="font-bold text-gray-500 uppercase text-xs mb-1">Full Address</p>
                            <p className="text-gray-900">{order.shippingAddress?.addressLine}</p>
                            <p className="text-gray-700">{order.shippingAddress?.city}, {order.shippingAddress?.state} - {order.shippingAddress?.pincode}</p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-500 uppercase text-xs mb-1">Contact</p>
                            <p className="text-gray-900">{order.shippingAddress?.fullName}</p>
                            <p className="text-gray-700">📞 {order.shippingAddress?.phone}</p>
                          </div>
                          <div>
                            <p className="font-bold text-gray-500 uppercase text-xs mb-1">Order Info</p>
                            <p className="text-gray-700">Payment: {order.paymentMethod?.toUpperCase()}</p>
                            <p className="text-gray-700">Shipping: {order.shippingMethod || "Standard"}</p>
                            <p className="text-gray-700">Subtotal: ₹{order.subtotal} | Shipping: ₹{order.shippingCost || 0}</p>
                            {order.deliveryPartner && (
                              <div className="mt-2 text-blue-800 bg-blue-100 p-2 rounded">
                                <p className="font-bold text-xs uppercase">Shipping Info</p>
                                <p>{order.deliveryPartner} - {order.awbId}</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
              {filteredOrders.length === 0 && (
                <tr>
                  <td colSpan="5" className="p-8 text-center text-gray-500 font-medium">
                    No orders found matching this filter.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-between p-4 border-t border-gray-100 bg-gray-50">
            <p className="text-sm text-gray-500">
              Showing {(currentPage - 1) * ORDERS_PER_PAGE + 1}-{Math.min(currentPage * ORDERS_PER_PAGE, filteredOrders.length)} of {filteredOrders.length}
            </p>
            <div className="flex gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="px-3 py-1 text-sm font-bold rounded border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                ← Prev
              </button>
              {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`px-3 py-1 text-sm font-bold rounded transition ${currentPage === page
                    ? "bg-blue-600 text-white"
                    : "border border-gray-200 hover:bg-white text-gray-700"
                    }`}
                >
                  {page}
                </button>
              ))}
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="px-3 py-1 text-sm font-bold rounded border border-gray-200 hover:bg-white disabled:opacity-40 disabled:cursor-not-allowed transition"
              >
                Next →
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderManager;
