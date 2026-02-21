import { useEffect, useRef, useState } from "react"
import { RootState, useAppSelector } from "@/redux/store";
import { useLocalStorage } from "./useLocalStorage";


export const useFetchs = (methodType: string, body: any, url: string) => {
    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

    console.log(methodType, body, url);

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getUserDetails()?.accessToken

    console.log("token ====>", token);

    const apiFetchOnRender = async () => {
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

        } catch (e: any) {
            console.log(e);
            setIsLoading(false);
            setError(e.message || "An error occurred while fetching data")
        }
    }

    useEffect(() => {
        apiFetchOnRender();
    }, [url, methodType, JSON.stringify(body)]) 


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
            setData(dataResponse);
            setIsLoading(false);
            console.log(dataResponse);

        } catch (e: any) {
            console.log(e);
            setIsLoading(false);
            // Ensure error is a string, not an Error object
            setError(e.message || "An error occurred while fetching data")
        }
    }

    return { data, isLoading, setIsLoading, callApi, error };
}



export const useFetch = (methodType: string, body: any, url: string) => {
    const instanceId = useRef(Math.random().toString(36).substring(7));
    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    
    const { getUserDetails } = useLocalStorage("userDetails", null);
    const token = getUserDetails()?.accessToken

    // Use a ref to track if this is the first render
    const isFirstRender = useRef(true);
    const hasFetched = useRef(false);

    const apiFetchOnRender = async () => {
        // Prevent double fetch in development
        if (hasFetched.current && process.env.NODE_ENV === 'development') {
            console.log(`⏭️ Instance ${instanceId.current} - Skipping duplicate fetch`);
            return;
        }
        
        hasFetched.current = true;
        setIsLoading(true);
        
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

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
            console.log(`✅ Instance ${instanceId.current} - Success:`, dataResponse);

        } catch (e: any) {
            console.log(`❌ Instance ${instanceId.current} - Error:`, e);
            setError(e.message || "An error occurred while fetching data");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        // In development with Strict Mode, this will run twice
        // but our hasFetched ref will prevent double API calls
        apiFetchOnRender();
        
        // Cleanup function
        return () => {
            console.log(`🧹 Instance ${instanceId.current} - Cleanup`);
        };
    }, [url, methodType, JSON.stringify(body)]);

    const callApi = async () => {
        // For manual calls, always allow
        hasFetched.current = false; // Reset for manual calls
        await apiFetchOnRender();
    }

    return { data, isLoading, setIsLoading, callApi, error };
}




export const useCallFetch = (methodType: string, body: any, url: string, shouldCallApi: boolean) => {
    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

    console.log(methodType, body, url);

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getUserDetails()?.accessToken

    console.log("token ====>", token);

    const apiFetchOnRender = async () => {
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

        } catch (e: any) {
            console.log(e);
            setIsLoading(false);
            setError(e.message || "An error occurred while fetching data")
        }
    }

    useEffect(() => {
        shouldCallApi && apiFetchOnRender();
    }, [url, methodType, JSON.stringify(body)])

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
            setData(dataResponse);
            setIsLoading(false);
            console.log(dataResponse);

        } catch (e: any) {
            console.log(e);
            setIsLoading(false);
            // Ensure error is a string, not an Error object
            setError(e.message || "An error occurred while fetching data")
        }
    }

    return { data, isLoading, setIsLoading, callApi, error };
}
