"use client"
import { Button } from '@/components/ui/button';
import Image from 'next/image';
import React from 'react'
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import ProductItemDetail from './ProductItemDetail';

function ProductItem({ product }) {
    return (
        <div className='sm:p-2 p-6 flex flex-col items-center justify-center gap-3 border rounded-lg hover:scale-110 transition-all hover:shadow-lg ease-in-out'>
            <Image
                src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + product.images[0]?.url}
                alt={product.name}
                height={200}
                width={500}
                className='h-[100px] w-[200px] object-contain'
            />
            <h2 className='font-bold text-lg'>{product.name}</h2>
            <div className='flex gap-3'>
                {product.sellingPrice &&
                    <h2 className='font-bold text-lg'>{product.sellingPrice}₹</h2>
                }
                <h2 className={`font-bold ${product.sellingPrice && 'line-through text-gray-600'} text-lg`}>{product.mrp}₹</h2>
            </div>
            <Dialog>
                <DialogTrigger asChild>
                    <Button variant='outline' className='text-primary hover:text-white hover:bg-primary'>Add To Cart</Button>
                </DialogTrigger>
                <DialogContent className="w-full max-w-xs md:max-w-md lg:max-w-lg">
                    <DialogHeader>
                        <DialogDescription>
                            <ProductItemDetail product={product} />
                        </DialogDescription>
                    </DialogHeader>
                </DialogContent>
            </Dialog>
        </div>
    )
}

export default ProductItem