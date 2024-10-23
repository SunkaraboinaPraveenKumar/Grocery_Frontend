"use client"
import { Button } from '@/components/ui/button';
import { LoaderCircle, ShoppingBag, ShoppingBasket } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import React, { useContext, useState } from 'react'
import { toast } from 'sonner';
import GlobalApi from '../_utils/GlobalApi';
import { UpdateCartContext } from '../_context/UpdateCartContext';

function ProductItemDetail({ product }) {
    const {updateCart,setUpdateCart}=useContext(UpdateCartContext);
    const jwt = sessionStorage.getItem('jwt');
    const user = JSON.parse(sessionStorage.getItem('user'))
    const router = useRouter();
    const [productTotalPrice, setProductTotalPrice] = useState(
        product.sellingPrice ?
            product.sellingPrice :
            product.mrp
    )

    const [quantity, setQuantity] = useState(1);
    const [loading,setLoading]=useState(false);
    const data = {
        "data": {
            quantity: quantity,
            amount: (quantity * productTotalPrice).toFixed(2),
            products: product.id-1,
            users_permissions_user: user.id,
            userid:user.id,
            productid:product.id-1
        }
    }


    // const addToCart = () => {
    //     setLoading(true);
    //     if (!jwt) {
    //         router.replace("/sign-in");
    //         toast("Login First!!");
    //         setLoading(false);
    //         return;
    //     }

    //     GlobalApi.addToCart(data).then(resp => {
    //         toast('Added to Cart');
    //         setUpdateCart(!updateCart);
    //         setLoading(false);
    //     }, (e) => {
    //         console.log(e.response?.data);  // Log error response data
    //         setLoading(false)
    //         toast('Error While Adding Item to Cart')
    //     })
    // }

    // const addToCart = () => {
    //     setLoading(true);
    //     if (!jwt) {
    //         router.replace("/sign-in");
    //         toast("Login First!!");
    //         setLoading(false);
    //         return;
    //     }
    
    //     // Add to backend cart
    //     GlobalApi.addToCart(data).then(resp => {
    //         toast('Added to Cart');
    //         setUpdateCart(!updateCart);
    //         setLoading(false);
    
    //         // Add to localStorage
    //         const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    
    //         // Check if the product already exists in localStorage cart
    //         const existingItemIndex = existingCartItems.findIndex(item => item.productId === product.id);
            
    //         if (existingItemIndex !== -1) {
    //             // If item already exists, update the quantity
    //             existingCartItems[existingItemIndex].quantity += quantity;
    //         } else {
    //             // Add new product to localStorage cart
    //             const newCartItem = {
    //                 productId: product.id,
    //                 name: product.name,
    //                 price: productTotalPrice,
    //                 quantity: quantity,
    //                 image: product.images[0]?.url,
    //             };
    //             existingCartItems.push(newCartItem);
    //         }
    
    //         // Save updated cart back to localStorage
    //         localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
    
    //     }, (e) => {
    //         console.log(e.response?.data);  // Log error response data
    //         setLoading(false)
    //         toast('Error While Adding Item to Cart')
    //     });
    // };

    const addToCart = () => {
        setLoading(true);
        if (!jwt) {
            router.replace("/sign-in");
            toast("Login First!!");
            setLoading(false);
            return;
        }
    
        // Add to backend cart
        GlobalApi.addToCart(data).then(resp => {
            toast('Added to Cart');
            setUpdateCart(!updateCart);
            setLoading(false);
    
            // Add to localStorage
            const existingCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            const deletedCartItems = JSON.parse(localStorage.getItem('deletedCartItems')) || [];
    
            // Remove from deletedCartItems if it exists
            const itemIndex = deletedCartItems.findIndex(item => item.productId === product.id && item.userId === user.id);
            if (itemIndex !== -1) {
                deletedCartItems.splice(itemIndex, 1); // Remove it from deleted items
                localStorage.setItem('deletedCartItems', JSON.stringify(deletedCartItems));
            }
    
            // Check if the product already exists in localStorage cart
            const existingItemIndex = existingCartItems.findIndex(item => item.productId === product.id);
            
            if (existingItemIndex !== -1) {
                // If item already exists, update the quantity
                existingCartItems[existingItemIndex].quantity += quantity;
            } else {
                // Add new product to localStorage cart
                const newCartItem = {
                    productId: product.id,
                    name: product.name,
                    price: productTotalPrice,
                    quantity: quantity,
                    image: product.images[0]?.url,
                };
                existingCartItems.push(newCartItem);
            }
    
            // Save updated cart back to localStorage
            localStorage.setItem('cartItems', JSON.stringify(existingCartItems));
    
        }, (e) => {
            console.log(e.response?.data);
            setLoading(false)
            toast('Error While Adding Item to Cart')
        });
    };
    
    return (
        <div className='grid grid-cols-1 md:grid-cols-2 p-4 md:p-7 bg-white text-black gap-5'>
            <Image
                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + product.images[0]?.url}
                alt={product.name}
                height={300}
                width={300}
                className='bg-slate-200 p-5 h-[200px] md:h-[320px] w-full object-contain rounded-lg'
            />
            <div className='flex flex-col gap-2 md:gap-3'>
                <h2 className='text-xl md:text-2xl font-bold'>{product.name}</h2>
                <h2 className='text-sm text-gray-600'>{product.description}</h2>
                <div className='flex gap-3'>
                    {product.sellingPrice &&
                        <h2 className='font-bold text-2xl md:text-3xl'>{product.sellingPrice}₹</h2>
                    }
                    <h2 className={`font-bold ${product.sellingPrice && 'line-through text-gray-600'} text-2xl md:text-3xl`}>{product.mrp}₹</h2>
                </div>
                <h2 className='font-medium text-md md:text-lg'>Quantity ({product.itemQuantityType})</h2>
                <div className='flex flex-col items-baseline gap-4'>
                    <div className='flex gap-3 items-center'>
                        <div className='flex p-2 border gap-5 md:gap-10 items-center px-5'>
                            <button disabled={quantity == 1} onClick={() => setQuantity(quantity - 1)} className='cursor-pointer'>-</button>
                            <h2>{quantity}</h2>
                            <button className='cursor-pointer' onClick={() => setQuantity(quantity + 1)}>+</button>
                        </div>
                        <h2 className='text-2xl font-bold'> = {(quantity * productTotalPrice).toFixed(2)}₹</h2>
                    </div>
                    <Button disabled={loading} onClick={() => addToCart()} className='flex gap-3'>
                        <ShoppingBasket />
                        {loading?<LoaderCircle className='animate-spin'/>:'Add To Cart'}
                    </Button>
                </div>
                <h2 className='text-sm'><span className='font-bold'>Category: </span> {product.categories[0].name}</h2>
            </div>
        </div>
    )
}

export default ProductItemDetail