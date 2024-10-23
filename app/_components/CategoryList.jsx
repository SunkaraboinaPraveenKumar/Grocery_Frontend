import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function CategoryList({ categoryList }) {
    return (
        <div className='mt-5'>
            <h2 className='text-green-700 font-bold text-2xl'>Shop By Category</h2>
            <div className='grid grid-cols-3 md:grid-cols-4 lg:grid-cols-7 gap-5 mt-2'>
                {
                    categoryList.map((cat, index) => (
                        <Link href={"/product-category/"+cat.name} key={index} className='flex flex-col items-center bg-green-50 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-200'>
                            <Image 
                            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL+cat.icon[0]?.url}
                            alt={process.env.NEXT_PUBLIC_BACKEND_BASE_URL+cat.icon[0]?.alternativeText || 'icon'}c
                            height={50}
                            width={50}
                            className='group-hover:scale-125 transition-all ease-in-out'
                            />
                            <h2 className='text-green-800'>{cat.name}</h2>
                        </Link>
                    ))
                }
            </div>
        </div>
    )
}

export default CategoryList