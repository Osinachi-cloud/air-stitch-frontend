import Image from "next/image"
import Link from "next/link"

export const ProductSectionHeader = ({title, url}: any) => {

    return (
        <>
            <div className="flex justify-between items-center mb-4 py-4">
                <h2 className="font-display text-xl md:text-2xl font-semibold text-surface-800">{title}</h2>
                <Link href={url} className="bg-brand-gradient flex justify-center gap-2 items-center text-xs text-white font-semibold px-3 rounded-md py-2 hover:opacity-90 transition-opacity shadow-card">
                    <span>Browse all</span>
                    <Image src="/icons/Arrow 1.png" alt="Browse" className="h-auto w-4" width={16} height={16} />
                </Link>
            </div>
        </>
    )
}
