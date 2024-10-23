"use client"
import React from 'react'
import ProductItem from './ProductItem';

function ProductList({ productList }) {
    return (
        <div className='mt-10'>
            <h2 className='text-green-700 font-bold text-2xl'>Our Popular Products</h2>
            <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 mt-6'>
                {
                    productList.map((product, index) => index<=12&&(
                        <ProductItem product={product} key={index}/>
                    ))
                }
            </div>
        </div>
    )
}

export default ProductList