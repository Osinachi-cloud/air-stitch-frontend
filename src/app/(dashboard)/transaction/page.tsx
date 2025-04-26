"use client"

import TransactionStatusCard from "@/components/TransactionStatusCard";
import { useFetch } from "@/hooks/useFetch";
import { errorToast } from "@/hooks/UseToast";
import Image from "next/image";
import { userAgent } from "next/server";
import { useEffect, useState } from "react";
import 'react-toastify/dist/ReactToastify.css';


const TransactionPage = () => {

  return (
    <>
      <div className="p-[2rem]">
        <div className="grid md:grid-cols-5 gap-4 py-[4rem]">
          <TransactionStatusCard status="Total" transactionAmount={120000} />
          <TransactionStatusCard status="Nigeria" transactionAmount={12} />
          <TransactionStatusCard status="Canada" transactionAmount={1000} />
          <TransactionStatusCard status="China" transactionAmount={2000} />
          <TransactionStatusCard status="UK" transactionAmount={3000} />
        </div>
        <div>
          <TransactionTable />
        </div>
      </div>

    </>
  )
}

export default TransactionPage;




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



const TransactionTable = () => {

  const [transactions, setTransactions] = useState([]);
  const [pageNumber, setPageNumber] = useState(0);
  const [pageSize, setPageSize] = useState(10);
  const [loading, setLoading] = useState(false);
  const [arrLength, setArrLength] = useState(0);
  const [numberOfPages, setNumberOfPages] = useState(0);
  const url = `https://fakestoreapi.com/products&pageSize=${pageSize}&pageNumber=${pageNumber}`;
  // const url = `https://fakestoreapi.com/products`;

  const { data: loginResponseData, isLoading, setIsLoading, callApi, error } = useFetch('GET', {}, url);
  console.log({loginResponseData});
  console.log({error});
  if(error){
    errorToast(loginResponseData?.message);
  }

  const handlePageSize = (e: any) => {
    console.log(e.target.value);
    setPageSize(e.target.value);
  }

  const handlePageIncrease = () => {
    setPageNumber(num => num + 1);
  }

  const handlePageDecrease = () => {
    pageNumber > 0 && setPageNumber(num => num - 1);
  }

  const fetchApi = async () => {
    setLoading(true);
    try {
      const apiResponse = await fetch(url, {
        method: 'GET',
        headers: {
          'content-type': 'Application-json',
          'Authorization': `Bearer ${1234}`
        }
      });
      const response = await apiResponse.json();
      console.table(response);
      setArrLength(response?.size);
      getNumberOfPages(response?.size);

    } catch (e: any) {
      console.log(e)
      throw new Error();
    }
  }

  const getNumberOfPages = (orderTotal: number): void => {
    console.log(orderTotal);
    console.log(pageSize);
    if (orderTotal % pageSize == 0) {
      setNumberOfPages(orderTotal / pageSize)
    } else {
      setNumberOfPages(1 + Math.floor(orderTotal / pageSize));
    }
  }

  useEffect(() => {
    // fetchApi();
  }, [pageSize, pageNumber])

  return (
    <>
      <div>
        <div className="flex justify-between items-center p-[1rem] bg-[#fff]">
          <h3>Customer Orders</h3>
          <div className="flex gap-[1rem] items-center">
            <div className="border outline-none flex justify-between gap-[1rem] py-[0.5rem] px-[0.5rem] rounded-[8px]">
              <Image src="/search.png" height={10} width={25} alt="Transaction Icon" />
              <input type="search" placeholder="Search" className="bg-transparent outline-none" />
            </div>
            <div>
              <Image src="/trans-icon.png" height={10} width={30} alt="Transaction Icon" />
            </div>
          </div>
        </div>
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
                      </div>
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
        <div className="flex justify-between py-[1rem] text-[grey]">
          <div className="flex gap-[1rem]">
            <select onChange={(e: any) => handlePageSize(e)} value={pageSize} name="" id="">
              <option value={10}>10</option>
              <option value={20}>20</option>
              <option value={30}>30</option>
              <option value={40}>40</option>
            </select>
            <div>
              Items per page
            </div>
            <div>
              1 - {pageSize} of {arrLength} Items
            </div>
          </div>
          <div className="flex gap-[1rem]">
            <div className="flex justify-between w-[50px]">
              <span onClick={() => handlePageDecrease()} className="cursor-pointer">{"<"}</span>
              <span onClick={() => handlePageIncrease()} className="cursor-pointer">{">"}</span>
            </div>
            <div>
              {pageNumber} of {numberOfPages} pages
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
