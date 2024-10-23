"use client";
import { Button } from '@/components/ui/button';
import React, { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { useRouter } from 'next/navigation';

function CheckOut() {
    const [subtotal, setSubtotal] = useState(0);
    const [deliveryCost, setDeliveryCost] = useState(50); // Default delivery cost
    const [taxRate] = useState(0.18); // 18% tax rate
    const [paymentMethod, setPaymentMethod] = useState('');
    const [userDetails, setUserDetails] = useState({ name: '', email: '', address: '', phone: '', zip: '' });
    const [upiDetails, setUpiDetails] = useState({ id: '', name: '' });
    const [cardDetails, setCardDetails] = useState({ cardNumber: '', expiry: '', cvv: '' });
    const router = useRouter();

    useEffect(() => {
        // Retrieve the price from localStorage and set it to subtotal
        const price = localStorage.getItem('price');
        if (price) {
            setSubtotal(Number(price));
        } else {
            console.warn("No price found in localStorage.");
        }
    }, []);

    const handlePaymentMethodChange = (method) => {
        setPaymentMethod(method);
    };

    const calculateTotal = () => {
        const tax = subtotal * taxRate; // Calculate tax
        const total = subtotal + deliveryCost + tax; // Calculate total
        return total.toFixed(2); // Return total rounded to 2 decimal places
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Create order data
        const orderData = {
            amount: calculateTotal(),
            createdAt: new Date().toISOString(),
            products: JSON.parse(localStorage.getItem('cartItems')) || [], // Get cart items from local storage
            userDetails,
        };

        // Store order data in localStorage
        localStorage.setItem('order', JSON.stringify(orderData));

        // Simulate successful payment
        toast.success("Order placed successfully!");
        router.push("/order"); // Redirect to order page
    };

    return (
        <div className="min-h-screen p-5 text-center border border-gray-500 bg-green-50 m-5 shadow-md">
            <h2 className="text-2xl font-bold mb-6">Checkout</h2>
            <h3 className="text-xl mb-4">Your subtotal is:</h3>
            <h2 className="text-3xl font-semibold mb-4">₹{subtotal}</h2>

            {/* Delivery and Tax Costs */}
            <div className="mb-4">
                <p>Delivery Cost: ₹{deliveryCost}</p>
                <p>Tax (18%): ₹{(subtotal * taxRate).toFixed(2)}</p>
            </div>

            <h2 className="text-3xl font-semibold mb-4">Total: ₹{calculateTotal()}</h2>

            {/* User Details and Payment Form */}
            <form onSubmit={handleSubmit} className="flex flex-col items-center mb-4">
                <input
                    type="text"
                    placeholder="Name"
                    value={userDetails.name}
                    onChange={(e) => setUserDetails({ ...userDetails, name: e.target.value })}
                    className="mb-2 p-2 border rounded"
                    required
                />
                <input
                    type="email"
                    placeholder="Email"
                    value={userDetails.email}
                    onChange={(e) => setUserDetails({ ...userDetails, email: e.target.value })}
                    className="mb-2 p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Address"
                    value={userDetails.address}
                    onChange={(e) => setUserDetails({ ...userDetails, address: e.target.value })}
                    className="mb-2 p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Phone"
                    value={userDetails.phone}
                    onChange={(e) => setUserDetails({ ...userDetails, phone: e.target.value })}
                    className="mb-2 p-2 border rounded"
                    required
                />
                <input
                    type="text"
                    placeholder="Zip Code"
                    value={userDetails.zip}
                    onChange={(e) => setUserDetails({ ...userDetails, zip: e.target.value })}
                    className="mb-4 p-2 border rounded"
                    required
                />

                {/* Payment Method Selection */}
                <div className="mb-4">
                    <h3 className="text-lg font-bold mb-2">Select Payment Method</h3>
                    <div className="flex justify-center gap-4">
                        <Button
                            type='button'
                            onClick={() => handlePaymentMethodChange('upi')}
                            className={`p-2 ${paymentMethod === 'upi' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                        >
                            UPI
                        </Button>
                        <Button
                            type='button'
                            onClick={() => handlePaymentMethodChange('credit-card')}
                            className={`p-2 ${paymentMethod === 'credit-card' ? 'bg-green-600 text-white' : 'bg-gray-200'}`}
                        >
                            Credit Card
                        </Button>
                    </div>
                </div>

                {/* Payment Forms */}
                {paymentMethod === 'upi' && (
                    <>
                        <input
                            type="text"
                            placeholder="UPI ID"
                            value={upiDetails.id}
                            onChange={(e) => setUpiDetails({ ...upiDetails, id: e.target.value })}
                            className="mb-4 p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Name"
                            value={upiDetails.name}
                            onChange={(e) => setUpiDetails({ ...upiDetails, name: e.target.value })}
                            className="mb-4 p-2 border rounded"
                            required
                        />
                    </>
                )}

                {paymentMethod === 'credit-card' && (
                    <>
                        <input
                            type="text"
                            placeholder="Card Number"
                            value={cardDetails.cardNumber}
                            onChange={(e) => setCardDetails({ ...cardDetails, cardNumber: e.target.value })}
                            className="mb-4 p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="Expiry Date (MM/YY)"
                            value={cardDetails.expiry}
                            onChange={(e) => setCardDetails({ ...cardDetails, expiry: e.target.value })}
                            className="mb-4 p-2 border rounded"
                            required
                        />
                        <input
                            type="text"
                            placeholder="CVV"
                            value={cardDetails.cvv}
                            onChange={(e) => setCardDetails({ ...cardDetails, cvv: e.target.value })}
                            className="mb-4 p-2 border rounded"
                            required
                        />
                    </>
                )}

                <Button type="submit" className="mt-4">Confirm Payment</Button>
            </form>
        </div>
    );
}

export default CheckOut;
