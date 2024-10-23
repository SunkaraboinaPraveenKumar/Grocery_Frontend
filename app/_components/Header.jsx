


// const onDeleteItem = async (id) => {
//     try {
//         await GlobalApi.deleteCartItem(id);
//         toast("Cart Item Deleted Successfully!!");
//         getCartItems(); // Refresh cart list
//     } catch (e) {
//         toast("Error Deleting Cart Item!!");
//         console.error(e);
//     }
// };
// const onDeleteItem = (id) => {
//     let localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

//     // Find the item to be deleted and its amount
//     const itemToDelete = localCartItems.find(item => item.id === id);

//     // Filter out the deleted item from the cart
//     localCartItems = localCartItems.filter(item => item.id !== id);

//     // Update cart items in localStorage
//     localStorage.setItem('cartItems', JSON.stringify(localCartItems));

//     // Update the subtotal by subtracting the deleted item's amount
//     const updatedSubtotal = subtotal - (itemToDelete ? itemToDelete.amount : 0);
//     setSubTotal(updatedSubtotal);

//     // Update subtotal in localStorage
//     localStorage.setItem('amount', updatedSubtotal);

//     // Update the state
//     setCartItemList(localCartItems);
//     setTotalCartItem(localCartItems.length); // Update cart total

//     toast("Cart Item Deleted Successfully!!");
// };

import { Button } from '@/components/ui/button';
import { CircleUserRound, LayoutGrid, Search, ShoppingBasket } from 'lucide-react';
import Image from 'next/image';
import React, { useContext, useEffect, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import Link from 'next/link';
import GlobalApi from '../_utils/GlobalApi';
import { useRouter } from 'next/navigation';
import { UpdateCartContext } from '../_context/UpdateCartContext';
import {
    Sheet,
    SheetClose,
    SheetContent,
    SheetDescription,
    SheetHeader,
    SheetTitle,
    SheetTrigger,
} from "@/components/ui/sheet";
import CartItemList from './CartItemList';
import { toast } from 'sonner';

function Header() {
    const [totalCartItem, setTotalCartItem] = useState(0);
    const [categoryList, setCategoryList] = useState([]);
    const [isLogin, setIsLogin] = useState(false);
    const { updateCart } = useContext(UpdateCartContext);
    const [cartItemsList, setCartItemList] = useState([]);
    const [subtotal, setSubTotal] = useState(0);
    const [user, setUser] = useState(null);

    const router = useRouter();

    useEffect(() => {
        if (typeof window !== 'undefined') {
            setIsLogin(!!sessionStorage.getItem('jwt'));
            const userData = JSON.parse(sessionStorage.getItem('user'));
            setUser(userData);

            // Load cart items from localStorage on mount
            const localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
            setCartItemList(localCartItems);
            setTotalCartItem(localCartItems.length);

            // Load subtotal from localStorage on mount
            const storedSubtotal = parseFloat(localStorage.getItem('amount')) || 0;
            setSubTotal(storedSubtotal);
        }

        getCategoryList();
    }, []);

    useEffect(() => {
        if (user) {
            getCartItems();
        }
    }, [user, updateCart]);

    const getCategoryList = () => {
        GlobalApi.getCategory().then(resp => {
            setCategoryList(resp?.data?.data);
        });
    };

    const onSignOut = () => {
        sessionStorage.clear();
        router.replace("/sign-in");
    };

    const getCartItems = async () => {
        if (user?.id) {
            try {
                const cartItemsList_ = await GlobalApi.getCartItems(user.id);

                // Retrieve deleted cart items from localStorage
                const deletedCartItems = JSON.parse(localStorage.getItem('deletedCartItems')) || [];

                // Filter out deleted items from fetched items
                const filteredCartItems = cartItemsList_.filter(item =>
                    !deletedCartItems.includes(item.id)
                );

                // Update localStorage with new filtered cart items
                localStorage.setItem('cartItems', JSON.stringify(filteredCartItems));

                setTotalCartItem(filteredCartItems.length > 0 ? filteredCartItems.length : 0);
                setCartItemList(filteredCartItems);
            } catch (error) {
                console.error('Failed to fetch cart items:', error);
            }
        } else {
            console.warn('User is not logged in or user ID is not available.');
        }
    };

    const onDeleteItem = (id) => {
        let localCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
        let deletedCartItems = JSON.parse(localStorage.getItem('deletedCartItems')) || [];
        const itemToDelete = localCartItems.find(item => item.id === id);

        // Filter out the deleted item from the cart
        localCartItems = localCartItems.filter(item => item.id !== id);
        localStorage.setItem('cartItems', JSON.stringify(localCartItems));

        // Store deleted item in deletedCartItems
        if (itemToDelete) {
            deletedCartItems.push({ ...itemToDelete, userId: user.id });
            localStorage.setItem('deletedCartItems', JSON.stringify(deletedCartItems));
        }

        // Update the subtotal
        const updatedSubtotal = subtotal - (itemToDelete ? itemToDelete.amount : 0);
        setSubTotal(updatedSubtotal);
        localStorage.setItem('amount', updatedSubtotal);
        setCartItemList(localCartItems);
        setTotalCartItem(localCartItems.length);

        toast("Cart Item Deleted Successfully!!");
    };

    useEffect(() => {
        const calculateSubtotal = () => {
            const total = cartItemsList.reduce((sum, cartItem) => sum + cartItem.amount, 0);
            setSubTotal(total);

            // Update subtotal in localStorage
            localStorage.setItem('amount', total);
        };
        calculateSubtotal();
    }, [cartItemsList]);

    return (
        <div className='p-5 shadow-md flex justify-between'>
            <div className='flex items-center gap-8'>
                <Link href={"/"}>
                    <Image src={"/logo.png"} alt='logo' width={100} height={100} />
                </Link>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <h2 className='flex flex-row md:flex gap-2 items-center border rounded-full p-2 px-10 bg-slate-200 cursor-pointer'>
                            <LayoutGrid className='h-5 w-5' />
                            Category
                        </h2>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent>
                        {categoryList?.map((cat, index) => (
                            <Link href={"/product-category/" + cat.name} key={index}>
                                <DropdownMenuItem className='flex gap-4 items-center cursor-pointer'>
                                    <Image
                                        src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + cat.icon[0]?.url}
                                        alt={cat.icon[0]?.alternativeText || 'icon'}
                                        height={30}
                                        width={30}
                                    />
                                    <h2 className='text-lg'>{cat.name}</h2>
                                </DropdownMenuItem>
                            </Link>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
                <div className='md:flex gap-3 items-center border rounded-full p-2 px-5 hidden'>
                    <Search />
                    <input type="text" placeholder='Search' className='outline-none' />
                </div>
            </div>

            <div className='flex gap-5 items-center'>
                <Sheet>
                    <SheetTrigger asChild>
                        <h2 className='flex gap-2 items-center text-lg cursor-pointer'>
                            <ShoppingBasket className='h-7 w-7' />
                            <span className='bg-primary text-white p-1 px-2 rounded-full'>{totalCartItem}</span>
                        </h2>
                    </SheetTrigger>
                    <SheetContent>
                        <SheetHeader>
                            <SheetTitle className='bg-primary text-white font-bold text-lg p-2'>My Cart</SheetTitle>
                            <SheetDescription>
                                <CartItemList onDeleteItem={onDeleteItem} />
                            </SheetDescription>
                        </SheetHeader>
                        <SheetClose asChild>
                            <div className='absolute w-[90%] bottom-6 flex flex-col'>
                                <h2 className='text-lg font-bold flex justify-between m-3'>Subtotal <span>{subtotal}₹</span></h2>
                                <Button onClick={() => {
                                    router.push(user ? '/check-out' : '/sign-in')
                                    localStorage.setItem('price', subtotal);
                                    localStorage.setItem('cart', JSON.stringify(cartItemsList));
                                }} className='w-full'>Check Out</Button>
                            </div>
                        </SheetClose>
                    </SheetContent>
                </Sheet>
                {!isLogin ? (
                    <Link href={"/sign-in"}>
                        <Button className='cursor-pointer'>Login</Button>
                    </Link>
                ) : (
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <CircleUserRound className='h-12 w-12 bg-green-100 cursor-pointer text-primary p-2 rounded-full' />
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                            <DropdownMenuItem>My Account</DropdownMenuItem>
                            <DropdownMenuItem>Profile</DropdownMenuItem>
                            <DropdownMenuItem>My Order</DropdownMenuItem>
                            <DropdownMenuItem onClick={() => onSignOut()}>Logout</DropdownMenuItem>
                        </DropdownMenuContent>
                    </DropdownMenu>
                )}
            </div>
        </div>
    );
}

export default Header;
