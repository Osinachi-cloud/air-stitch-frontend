const orders = [
    {
        productName: "Product A",
        orderDate: "2024-08-01",
        trackingId: "TRK123456",
        orderTotal: "$100",
        status: "PAID",
        dateCreated: "2024-07-31",
        orderId: "ORD0001",
        currency: "USD"
    },
    {
        productName: "Product B",
        orderDate: "2024-08-02",
        trackingId: "TRK123457",
        orderTotal: "$150",
        status: "STARTED",
        dateCreated: "2024-08-01",
        orderId: "ORD0002",
        currency: "USD"
    },
    {
        productName: "Product C",
        orderDate: "2024-08-03",
        trackingId: "TRK123458",
        orderTotal: "$200",
        status: "COMPLETED",
        dateCreated: "2024-08-02",
        orderId: "ORD0003",
        currency: "USD"
    },
    {
        productName: "Product D",
        orderDate: "2024-08-04",
        trackingId: "TRK123459",
        orderTotal: "$250",
        status: "PAID",
        dateCreated: "2024-08-03",
        orderId: "ORD0004",
        currency: "USD"
    },
    {
        productName: "Product E",
        orderDate: "2024-08-05",
        trackingId: "TRK123460",
        orderTotal: "$300",
        status: "STARTED",
        dateCreated: "2024-08-04",
        orderId: "ORD0005",
        currency: "USD"
    },
    {
        productName: "Product F",
        orderDate: "2024-08-06",
        trackingId: "TRK123461",
        orderTotal: "$350",
        status: "COMPLETED",
        dateCreated: "2024-08-05",
        orderId: "ORD0006",
        currency: "USD"
    },
    {
        productName: "Product G",
        orderDate: "2024-08-07",
        trackingId: "TRK123462",
        orderTotal: "$400",
        status: "PAID",
        dateCreated: "2024-08-06",
        orderId: "ORD0007",
        currency: "USD"
    },
    {
        productName: "Product H",
        orderDate: "2024-08-08",
        trackingId: "TRK123463",
        orderTotal: "$450",
        status: "STARTED",
        dateCreated: "2024-08-07",
        orderId: "ORD0008",
        currency: "USD"
    },
    {
        productName: "Product I",
        orderDate: "2024-08-09",
        trackingId: "TRK123464",
        orderTotal: "$500",
        status: "COMPLETED",
        dateCreated: "2024-08-08",
        orderId: "ORD0009",
        currency: "USD"
    },
    {
        productName: "Product J",
        orderDate: "2024-08-10",
        trackingId: "TRK123465",
        orderTotal: "$550",
        status: "PAID",
        dateCreated: "2024-08-09",
        orderId: "ORD0010",
        currency: "USD"
    }
];



export const TransactionTable = () => {
    return (
        <>
            <table
                className="w-full text-[14px] leading-[150%]  text-[#4B5563] text-left">
                <thead className="text-[14px] italic font-[100]  text-[#374151] uppercase bg-[#fff]">
                    <tr className="border-b">
                        <th scope="col" className="p-[1rem]">
                            <div className="flex items-center">
                                <input id="checkbox-all-search" type="checkbox"
                                    className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2" />
                                <label htmlFor="checkbox-all-search" className="sr-only">Payment ID</label>
                            </div>
                        </th>
                        <th scope="col" className="p-[2rem]">
                            Product Name
                        </th>
                        <th scope="col" className="p-[2rem]">
                            Order Date
                        </th>
                        <th scope="col" className="p-[2rem]">
                            Tracking Id
                        </th>
                        <th scope="col" className="p-[2rem]">
                            Order Total
                        </th>
                        <th scope="col" className="p-[2rem]">
                            Status
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {
                        orders.map((order: any) => (
                            <tr key={order.trackingId} className="text-[#6E7079] bg-[#fff] border-b hover:bg-gray-50">
                                <td className="w-4 p-[1rem]">
                                    <div className="flex items-center">
                                        <input id="checkbox-table-search-3" type="checkbox"
                                            className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2" />
                                        <label htmlFor="checkbox-table-search-3" className="sr-only">checkbox</label>
                                    </div>
                                </td>
                                <td scope="row" className="px-[2rem] font-medium text-gray-900 whitespace-nowrap dark:text-white">
                                    <div className="flex gap-[1rem]">
                                        <div className="p-0">
                                            <span className="text-[grey] leading-0">{order.productName}</span>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-[2rem]">
                                    <div className="flex items-center gap-[1rem]">
                                        <div>
                                            {order.dateCreated}
                                        </div>
                                    </div>
                                </td>
                                <td className="px-[2rem]">
                                    {order.orderId}
                                </td>
                                <td className="px-[2rem]">
                                    {order.currency}
                                    {50}
                                </td>

                                <td className="px-[1rem]">
                                    {
                                        order.status == "STARTED" &&
                                        <div
                                            className="bg-[lightgrey] p-[1rem] py-[0.3rem] flex items-center justify-center w-[120px] gap-[1rem] rounded-[4px]">
                                            <span className="text-[#fff]">{order.status}</span>
                                        </div>
                                    }
                                    {
                                        order.status == "COMPLETED" &&
                                        <div
                                            className="bg-[#e9dffc] p-[1rem] py-[0.3rem] flex items-center justify-center w-[120px] gap-[1rem] rounded-[4px]">
                                            <span className="text-[#7b57fc]">{order.status}</span>
                                        </div>
                                    }
                                    {
                                        order.status == "PAID" &&

                                        <div
                                            className="bg-[#fdeae9] p-[1rem] py-[0.3rem] flex items-center justify-center w-[120px] gap-[1rem] rounded-[4px]">
                                            <span className="text-[#F57E77]">{order.status}</span>
                                        </div >
                                    }
                                    {
                                        order.status == "PENDING" &&

                                        <div
                                            className="bg-[#E4E7FD] p-[1rem] py-[0.3rem] flex items-center justify-center w-[120px] gap-[1rem] rounded-[4px]" >
                                            <span className="text-[#5570F1]">{order.status}</span>
                                        </div >
                                    }
                                    {
                                        order.status == "DELIVERED" &&

                                        <div
                                            className="bg-[#DEEEE7] p-[1rem] py-[0.3rem] flex items-center justify-center w-[120px] gap-[1rem] rounded-[4px]" >
                                            <span className="text-[#32936F]">{order.status}</span>
                                        </div >
                                    }
                                    {/* <div
                                        className="bg-[#fef2dc] text-nowrap p-[1rem] py-[0.5rem] flex items-center justify-center w-[120px] gap-[1rem] rounded-[4px]" >
                                        <span className="text-[orange]">PAID</span>
                                    </div >
                                    <div
                                        className="bg-[#d9fcd1] p-[1rem] py-[0.5rem] flex items-center justify-center w-[120px] gap-[1rem] rounded-[4px]" >
                                        <span className="text-[#30a532]"> STARTED</span>
                                    </div >
                                    <div
                                        className="bg-[#d4e1f9] p-[1rem] py-[0.5rem] flex items-center justify-center w-[120px] gap-[1rem] rounded-[4px]" >
                                        <span className="text-[#387dfd]">COMPLETED</span>
                                    </div > */}
                                </td >

                            </tr >
                        ))
                    }

                </tbody >

            </table >
        </>
    )
}