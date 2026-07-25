import { Blog } from "./Blog";
import { ProductSectionHeader } from "./ProductsectionHeader";



const blogs = [
    {
        id: 1,
        header: "How to style your dress to fit your taste!",
        body: "Plain Kaftan Style for Men",
        price: "₦40,000",
        image: "/images/single-product-big.png",
    },
    {
        id: 2,
        header: "Gals",
        body: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 3,
        header: "Couples",
        body: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 4,
        header: "Kids",
        body: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 5,
        header: "Family",
        body: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
    {
        id: 6,
        header: "Aso ebi",
        body: "Short description of product",
        price: "₦140,000",
        image: "/images/Agbada.png", // Replace with actual path
    },
];

export const Blogs = () => {
    return (
        <>
            <section className="px-4 md:px-6 py-8 w-[95%] mx-auto">
                <ProductSectionHeader
                    title={"Blog"}
                    url={"/blog"}
                />

                <div
                    className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    {blogs.map((blog, index) => (
                        <Blog
                            key={index}
                            image={blog.image}
                            name={blog.header}
                            description={blog.body}
                            price={blog.price}
                            buttonText={"View more"}

                        />
                    ))}
                </div>
            </section>
        </>
    )
}