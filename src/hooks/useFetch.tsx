import { useEffect, useState } from "react"

export const useFetch = (methodType: string, body: any, url: string) => {
    console.log(methodType, body, url);

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = null;

    const apiFetchOnRender = async() => {
        setIsLoading(true);
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
            };

            // Add Authorization header only if token is provided
            if (token) {
                headers.Authorization = `Bearer ${token}`;
            }

            const apiResponse = await fetch(url, {
                method: methodType,
                headers: headers,
                // body:JSON.stringify(body)
            });

            if (!apiResponse.ok) {
                setError("Error loading Api")
                throw new Error(`HTTP error! status: ${apiResponse.status}`);
            }

            const dataResponse = await apiResponse.json();
            setData(dataResponse);
            setIsLoading(false);
            console.log(dataResponse);

        } catch (e: any){
            console.log(e);
            setIsLoading(false);
            setError(e)
        }
    }

    useEffect(() => {
        apiFetchOnRender();
    }, [])

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

            const apiResponse = await fetch(url, {
                method: methodType,
                headers: headers,
                // body:JSON.stringify(body)
            });

            if (!apiResponse.ok) {
                setError("Error loading Api")
                throw new Error(`HTTP error! status: ${apiResponse.status}`);
            }

            const dataResponse = await apiResponse.json();
            setData(dataResponse);
            setIsLoading(false);
            console.log(dataResponse);

        } catch (e: any){
            console.log(e);
            setIsLoading(false);
            setError(e)
        }
    }

    return {data, isLoading, setIsLoading, callApi, error};
}