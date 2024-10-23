"use client";
import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import CartItemList from '@/app/_components/CartItemList';

function OrderPage() {
  const router = useRouter();
  const [orderData, setOrderData] = useState(null);

  // Retrieve order details from localStorage when the component mounts
  useEffect(() => {
    if (typeof window !== 'undefined') {
      const storedOrder = localStorage.getItem('order');
      if (storedOrder) {
        setOrderData(JSON.parse(storedOrder));
      }
    }
  }, []);

  // If no order data is found, return a message to the user
  if (!orderData) {
    return (
      <div className="min-h-screen p-5 text-center">
        <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
        <p>No order details found. Please place an order first.</p>
        <div className="mt-6">
          <button
            onClick={() => router.push("/")}
            className="bg-green-600 text-white px-4 py-2 rounded"
          >
            Go Back to Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen p-5 text-center">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      <div>
        <h3 className="text-xl mb-4">Your Order Details:</h3>
        <p>Amount: ₹{orderData.amount}</p>
        <p>Delivery Address: {orderData.userDetails.address}</p>
        <p>Email: {orderData.userDetails.email}</p>
        <div className='flex items-center justify-center'>
          <CartItemList />
        </div>
      </div>
      <div className="mt-6">
        <button
          onClick={() => router.push("/")}
          className="bg-green-600 text-white px-4 py-2 rounded"
        >
          Go Back to Home
        </button>
      </div>
    </div>
  );
}

export default OrderPage;
