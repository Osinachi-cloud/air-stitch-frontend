import Image from "next/image"
import Link from "next/link"

export const ProductSectionHeader = ({title, url}: any) => {

    return (
        <>
            <div className="flex justify-between items-center mb-6 py-[2rem]">
                <h2 className="md:text-3xl font-bold">{title}</h2>
                <Link href={url} className="bg-[#373636] flex justify-center gap-[1rem] items-center text-[12px] md:text-[20px] text-[#fff] font-medium px-[1rem] rounded-[4px] py-[0.5rem] hover:bg-black transition-colors">
                    <span>Browse all </span>
                    <Image src="/icons/Arrow 1.png" alt="Product Image" className=" h-auto " width={30} height={40} />
                </Link>
            </div>
        </>
    )
}
