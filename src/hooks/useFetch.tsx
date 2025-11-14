import { useEffect, useState } from "react"
import { RootState, useAppSelector } from "@/redux/store";
import { useLocalStorage } from "./useLocalStorage";




export const useFetch = (methodType: string, body: any, url: string) => {
    const  { value , getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
    
    console.log(methodType, body, url);

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getUserDetails()?.accessToken

    console.log("token ====>", token);
    
    const apiFetchOnRender = async() => {
        setIsLoading(true);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const fetchOptions: RequestInit = {
                method: methodType,
                headers: headers,
            };

            if (body && methodType !== 'GET') {
                fetchOptions.body = JSON.stringify(body);
            }

            const apiResponse = await fetch(url, fetchOptions);

            if (!apiResponse.ok) {
                const errorText = await apiResponse.text();
                throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorText}`);
            }

            const dataResponse = await apiResponse.json();
            setData(dataResponse);
            setIsLoading(false);
            console.log(dataResponse);

        } catch (e: any){
            console.log(e);
            setIsLoading(false);
            setError(e.message || "An error occurred while fetching data")
        }
    }

    useEffect(() => {
        apiFetchOnRender();
    }, [url, methodType, JSON.stringify(body)]) 

    const callApi = async() => {
        console.log("call Api for me");
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // Add Authorization header only if token is provided
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const fetchOptions: RequestInit = {
                method: methodType,
                headers: headers,
            };

            // Add body for non-GET requests
            if (body && methodType !== 'GET') {
                fetchOptions.body = JSON.stringify(body);
            }

            const apiResponse = await fetch(url, fetchOptions);

            if (!apiResponse.ok) {
                const errorText = await apiResponse.text();
                throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorText}`);
            }

            const dataResponse = await apiResponse.json();
            setData(dataResponse);
            setIsLoading(false);
            console.log(dataResponse);

        } catch (e: any){
            console.log(e);
            setIsLoading(false);
            // Ensure error is a string, not an Error object
            setError(e.message || "An error occurred while fetching data")
        }
    }

    return {data, isLoading, setIsLoading, callApi, error};
}
