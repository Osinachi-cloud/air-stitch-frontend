import Image from "next/image";

const UserCard = ({ country, customerCount }: { country: string, customerCount: number }) => {
  return (
    <div className="rounded-[8px] odd:bg-stitchOffWhite shadow-[0_35px_60px_15px_rgba(200,200,200,0.3)] even:bg-stitchOffWhite py-4 px-4 grid gap-6 min-w-[130px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[10px] text-sm">
          {country}
        </h1>
        {/* <Image src="/more.png" alt="" width={20} height={20} /> */}
      </div>
      <div className="flex justify-between">
        <h2 className="capitalize text-2xl ">{customerCount}</h2>
        <select className="bg-[#F6F8FF]" name="" id="">
          <option value="">Month</option>
          <option value="">Day</option>
          <option defaultValue={50}>Week</option>
          <option value="">Year</option>
        </select>
        {/* <h1 className="text-sm font-semibold text-gray-500 my-4">{country}</h1> */}
      </div>

    </div>
  );
};

export default UserCard;