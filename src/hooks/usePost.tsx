import { useEffect, useState } from "react"
import { RootState, useAppSelector } from "@/redux/store";
import { useLocalStorage } from "./useLocalStorage";
import { errorToast, successToast } from "./UseToast";
import { useRouter } from 'next/navigation';



export const usePost = (methodType: string, body: any, url: string, route:string) => {
    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

    console.log(methodType, body, url);

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getUserDetails()?.accessToken;
    const router = useRouter();

    console.log("token ====>", token);


    const callApi = async () => {
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
            successToast(dataResponse?.message); 
            setData(dataResponse?.message);
            setIsLoading(false);
            console.log(dataResponse);
            router.push(`/${route}`)

        } catch (e: any) {
            console.log(e.message);
            setIsLoading(false);
            const msg = e?.message || "Error processing request";
            errorToast(msg); 

            setError(msg);
        }
    }

    return { data, isLoading, setIsLoading, callApi, error };
}
