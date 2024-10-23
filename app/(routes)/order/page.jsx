"use client";
import React from 'react';
import { useRouter } from 'next/navigation';
import CartItemList from '@/app/_components/CartItemList';

function OrderPage() {
  const router = useRouter();
  const orderData = JSON.parse(localStorage.getItem('order'));

  return (
    <div className="min-h-screen p-5 text-center">
      <h2 className="text-2xl font-bold mb-6">Order Summary</h2>
      {orderData ? (
        <div>
          <h3 className="text-xl mb-4">Your Order Details:</h3>
          <p>Amount: ₹{orderData.amount}</p>
          <p>Delivery Address: {orderData.userDetails.address}</p>
          <p>Email: {orderData.userDetails.email}</p>
          <div className='flex items-center justify-center'>
          <CartItemList/>
          </div>
        </div>
      ) : (
        <p>No order details found.</p>
      )}
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

