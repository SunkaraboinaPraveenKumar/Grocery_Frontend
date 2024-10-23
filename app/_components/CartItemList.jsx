"use client"
import React, { useEffect, useState } from 'react';
import GlobalApi from '../_utils/GlobalApi';
import Image from 'next/image';
import { TrashIcon } from 'lucide-react';
import { ClipLoader } from 'react-spinners';
import { usePathname } from 'next/navigation';

function CartItemList({ onDeleteItem }) {
    const [cartItemsList, setCartItemList] = useState([]);
    const [allProducts, setAllProducts] = useState([]);
    const [isLoading, setIsLoading] = useState(true); // Loading state
    const user = typeof window !== 'undefined' ? JSON.parse(sessionStorage.getItem('user')) : null; // Only access sessionStorage in the browser
    const [subtotal, setSubTotal] = useState(0);
    const [refresh, setRefresh] = useState(false); // State to trigger refetch

    const fetchCartAndProducts = async () => {
        try {
            if(!user?.id){
                return;
            }
            // Fetch products
            const products = await GlobalApi.getAllProductsCart();
            console.log("Products fetched:", products);
            setAllProducts(products);

            // Fetch cart items from localStorage
            if (typeof window !== 'undefined') { // Check if window is available
                const cartItemsList_ = JSON.parse(localStorage.getItem('cartItems')) || [];
                console.log("Cart items fetched:", cartItemsList_);
                setCartItemList(cartItemsList_);
            }
        } catch (error) {
            console.error("Error fetching data:", error);
        } finally {
            setIsLoading(false); // Stop loading
        }
    };

    useEffect(() => {
        fetchCartAndProducts();
    }, [user?.id, refresh]); // Re-fetch when user.id or refresh changes

    // Calculate subtotal whenever cartItemsList changes
    useEffect(() => {
        const calculateSubtotal = () => {
            if (typeof window !== 'undefined') { // Check if window is available
                const total = localStorage.getItem('amount');
                setSubTotal(total);
            }
        };
        calculateSubtotal();
    }, [cartItemsList]);

    const handleDeleteItem = (itemId) => {
        if (typeof window !== 'undefined') { // Check if window is available
            // Remove the item from cartItemsList state
            const updatedCartItems = cartItemsList.filter(item => item.id !== itemId);
            
            // Update the state
            setCartItemList(updatedCartItems);
            
            // Update localStorage with new cartItemsList
            localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));

            // Recalculate subtotal
            const newTotal = updatedCartItems.reduce((acc, item) => acc + item.amount * item.quantity, 0);
            setSubTotal(newTotal);
            localStorage.setItem('amount', newTotal); // Update localStorage with new subtotal

            // Call onDeleteItem function passed as prop (if needed for external handling)
            onDeleteItem(itemId);

            // Toggle refresh state to trigger re-fetch
            setRefresh(prev => !prev);
        }
    };

    const path = usePathname();

    return (
        <>
            <div className='p-5 bg-white rounded-lg shadow-lg w-full max-w-md'>
                {isLoading ? (
                    // Display spinner while loading
                    <div className='flex justify-center items-center'>
                        <ClipLoader size={50} color={'#36D7B7'} loading={isLoading} />
                    </div>
                ) : (
                    <div className='flex flex-col gap-4 max-h-[400px] overflow-y-auto'>
                        {cartItemsList.length > 0 && user?.id ? cartItemsList.map((cart, index) => {
                            const product = cart.products && cart.products.length > 0
                                ? allProducts?.find(product => product.id === cart.products[0].id)
                                : null;

                            const imageUrl = product ? `${process.env.NEXT_PUBLIC_BACKEND_BASE_URL}${product.images[0]?.url}` : '';

                            return (
                                <div key={index} className='flex items-center justify-between bg-gray-100 p-3 rounded-lg shadow'>
                                    <div className='flex gap-4 items-center'>
                                        {imageUrl ? (
                                            <Image
                                                src={imageUrl}
                                                width={70}
                                                height={70}
                                                alt={product?.name || 'Product Image'}
                                                className='rounded-lg border border-gray-200'
                                            />
                                        ) : (
                                            <p>No Image Available</p>
                                        )}
                                        <div>
                                            <h2 className='font-semibold text-lg'>{product?.name}</h2>
                                            <p>Quantity: {cart.quantity}</p>
                                            <p className='text-md font-bold text-green-600'>{cart.amount}₹</p>
                                        </div>
                                    </div>
                                    {path !== "/order" && (
                                        <TrashIcon onClick={() => handleDeleteItem(cart.id)} className='cursor-pointer text-red-500 hover:text-red-700' />
                                    )}
                                </div>
                            );
                        }) : (
                            <p className='text-center text-gray-500'>Your cart is empty</p>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}

export default CartItemList;
