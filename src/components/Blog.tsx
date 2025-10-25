import Image from "next/image"

export const Blog = ({ id, image, header, body, price, buttonText}: any) => {

    const showBlogDetails = (productId: any) => {

    }
    return (
        <>
            <div
                className="bg-[#fff] rounded-lg shadow-md relative cursor-pointer md:pb-[2rem]">
                <Image src={image} alt="Product Image" width={100} height={100} 
                    className="w-full md:h-[400px] h-[250px] object-cover rounded-t-lg rounded-r-lg" />
                <div className="mt-4 md:px-[4rem] px-[1rem] py-[2rem]">
                    <p className="md:text-[35px] text-[20px] md:w-[70%] text-[#000] font-bold md:mb-4 mb-[1rem] animated md:leading-[3rem]">How to style your
                        dress to fit your taste!</p>
                    <p className="md:text-[17px] text-[14px] md:py-[2rem] md:mb-4 font animated leading-[2rem]">How to style your dress to fit
                        your taste! How to style your dress to fit your taste! How to style your dress to fit your
                        taste!</p>
                    <div className="flex justify-between items-center mt-[1rem]">
                        <p className="">07/09/2023</p>
                        <div onClick={()=> showBlogDetails(id)}
                            className="text-[#f5f8ff] md:px-[2rem] px-[1rem] md:py-[1rem] py-[0.5rem] my-[0.5rem] rounded-[4px] bg-[#373636] text-center text-[14px] md:w-[200px] w-[150px] flex justify-center items-center gap-[1rem]">
                        <span>Read more</span>
                        <div>
                            <Image src="/icons/Arrow-right.png" alt="" width={30} height={20} />
                        </div>
                    </div>


                </div>

            </div>
        </div >
        </>
    )
}