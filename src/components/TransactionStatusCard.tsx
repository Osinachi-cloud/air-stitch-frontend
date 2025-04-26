import Image from "next/image";

const TransactionStatusCard = ({ status, transactionAmount }: { status: string, transactionAmount: number }) => {
  return (
    <div className="rounded-[8px] shadow-[0_35px_60px_15px_rgba(200,200,200,0.3)] py-4 px-4 grid gap-6 min-w-[130px]">
      <div className="flex justify-between items-center">
        <h1 className="text-[10px] text-sm">
          {status}
        </h1>
        {/* <Image src="/more.png" alt="" width={20} height={20} /> */}
      </div>
      <div className="flex justify-between">
        <h2 className="capitalize text-2xl ">{transactionAmount}</h2>
        {/* <h1 className="text-sm font-semibold text-gray-500 my-4">{country}</h1> */}
      </div>

    </div>
  );
};

export default TransactionStatusCard;