import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

function TopCategoryList({ categoryList,selectedCategory }) {
    return (
        <div className='flex gap-5 mt-5 overflow-x-auto mx-7 md:mx-20 justify-center scrollbar-hide'>
            {
                categoryList.map((cat, index) => (
                    <Link href={"/product-category/" + cat.name} key={index} 
                    className={`flex flex-col items-center bg-green-50 gap-2 p-3 rounded-lg group cursor-pointer hover:bg-green-200 w-[150px] min-w-[100px]
                        ${selectedCategory==cat.name&&'bg-green-600 text-white'}
                        `}
                    >
                        <Image
                            src={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + cat.icon[0]?.url}
                            alt={process.env.NEXT_PUBLIC_BACKEND_BASE_URL + cat.icon[0]?.alternativeText || 'icon'}
                            height={50}
                            width={50}
                            className='group-hover:scale-125 transition-all ease-in-out'
                        />
                        <h2 className={`text-green-800 group-hover:text-white
                            ${selectedCategory==cat.name&&'text-white'}
                            `}>{cat.name}</h2>
                    </Link>
                ))
            }
        </div>
    )
}

export default TopCategoryList
