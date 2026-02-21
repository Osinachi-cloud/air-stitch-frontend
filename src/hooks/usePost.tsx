// import { useEffect, useState } from "react"
// import { RootState, useAppSelector } from "@/redux/store";
// import { useLocalStorage } from "./useLocalStorage";
// import { errorToast, successToast } from "./UseToast";
// import { useRouter } from 'next/navigation';



// export const usePost = (methodType: string, body: any, url: string, route:string | null) => {
//     const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

//     console.log(methodType, body, url);

//     const [data, setData] = useState<any>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const token = getUserDetails()?.accessToken;
//     const router = useRouter();

//     console.log("token ====>", token);


//     const callApi = async () => {
//         console.log("call Api for me");
//         try {
//             const headers: Record<string, string> = {
//                 'Content-Type': 'application/json',
//             };

//             // Add Authorization header only if token is provided
//             if (token) {
//                 headers.Authorization = `Bearer ${token}`;
//             }

//             const fetchOptions: RequestInit = {
//                 method: methodType,
//                 headers: headers,
//             };

//             // Add body for non-GET requests
//             if (body && methodType !== 'GET') {
//                 fetchOptions.body = JSON.stringify(body);
//             }

//             const apiResponse = await fetch(url, fetchOptions);

//             if (!apiResponse.ok) {
//                 const errorText = await apiResponse.text();
//                 throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorText}`);
//             }

//             const dataResponse = await apiResponse.json();
//             successToast(dataResponse?.message); 
//             setData(dataResponse?.message);
//             setIsLoading(false);
//             console.log(dataResponse);
//             if(route !== null && route !== undefined){
//                 router.push(`/${route}`)
//             }

//         } catch (e: any) {
//             console.log(e.message);
//             setIsLoading(false);
//             const msg = e?.message || "Error processing request";
//             errorToast(msg); 

//             setError(msg);
//         }
//     }

//     return { data, isLoading, setIsLoading, callApi, error };
// }



// export const usePostWithoutRouting = (methodType: string, body: any, url: string) => {
//     const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

//     console.log(methodType, body, url);

//     const [data, setData] = useState<any>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const token = getUserDetails()?.accessToken;
//     const router = useRouter();

//     console.log("token ====>", token);


//     const callApi = async () => {
//         console.log("call Api for me");
//         try {
//             const headers: Record<string, string> = {
//                 'Content-Type': 'application/json',
//             };

//             // Add Authorization header only if token is provided
//             if (token) {
//                 headers.Authorization = `Bearer ${token}`;
//             }

//             const fetchOptions: RequestInit = {
//                 method: methodType,
//                 headers: headers,
//             };

//             // Add body for non-GET requests
//             if (body && methodType !== 'GET') {
//                 fetchOptions.body = JSON.stringify(body);
//             }

//             const apiResponse = await fetch(url, fetchOptions);

//             if (!apiResponse.ok) {
//                 const errorText = await apiResponse.text();
//                 throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorText}`);
//             }

//             const dataResponse = await apiResponse.json();
//             successToast(dataResponse?.message); 
//             setData(dataResponse?.message);
//             setIsLoading(false);
//             console.log(dataResponse);
    

//         } catch (e: any) {
//             console.log(e.message);
//             setIsLoading(false);
//             const msg = e?.message || "Error processing request";
//             errorToast(msg); 

//             setError(msg);
//         }
//     }

//     return { data, isLoading, setIsLoading, callApi, error };
// }





import { useEffect, useState, useRef } from "react"
import { RootState, useAppSelector } from "@/redux/store";
import { useLocalStorage } from "./useLocalStorage";
import { errorToast, successToast } from "./UseToast";
import { useRouter } from 'next/navigation';

export const usePost = (methodType: string, body: any, url: string, route: string | null) => {
    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
    
    // Add instance tracking
    const instanceId = useRef(Math.random().toString(36).substring(7));
    const hasLoggedCreation = useRef(false);
    
    // Only log creation once
    if (!hasLoggedCreation.current) {
        console.log(`📝 Post Hook ${instanceId.current} CREATED for:`, url);
        hasLoggedCreation.current = true;
    }

    console.log(`📦 Post Instance ${instanceId.current} -`, methodType, body, url);

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getUserDetails()?.accessToken;
    const router = useRouter();

    console.log(`🔑 Post Instance ${instanceId.current} token ====>`, token);

    const callApi = async () => {
        // Prevent multiple simultaneous calls
        if (isLoading) {
            console.log(`⏭️ Post Instance ${instanceId.current} - Already loading, skipping`);
            return;
        }
        
        console.log(`🚀 Post Instance ${instanceId.current} - Calling API:`, url);
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
            successToast(dataResponse?.message); 
            setData(dataResponse?.message);
            console.log(`✅ Post Instance ${instanceId.current} - Success:`, dataResponse);
            
            if (route !== null && route !== undefined) {
                router.push(`/${route}`);
            }

        } catch (e: any) {
            console.log(`❌ Post Instance ${instanceId.current} - Error:`, e.message);
            const msg = e?.message || "Error processing request";
            errorToast(msg);
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return { data, isLoading, setIsLoading, callApi, error };
}

export const usePostWithoutRouting = (methodType: string, body: any, url: string) => {
    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
    
    // Add instance tracking
    const instanceId = useRef(Math.random().toString(36).substring(7));
    const hasLoggedCreation = useRef(false);
    
    if (!hasLoggedCreation.current) {
        console.log(`📝 Post Hook (no routing) ${instanceId.current} CREATED for:`, url);
        hasLoggedCreation.current = true;
    }

    console.log(`📦 Post Instance ${instanceId.current} -`, methodType, body, url);

    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const token = getUserDetails()?.accessToken;

    console.log(`🔑 Post Instance ${instanceId.current} token ====>`, token);

    const callApi = async () => {
        // Prevent multiple simultaneous calls
        if (isLoading) {
            console.log(`⏭️ Post Instance ${instanceId.current} - Already loading, skipping`);
            return;
        }
        
        console.log(`🚀 Post Instance ${instanceId.current} - Calling API:`, url);
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
            successToast(dataResponse?.message); 
            setData(dataResponse?.message);
            console.log(`✅ Post Instance ${instanceId.current} - Success:`, dataResponse);

        } catch (e: any) {
            console.log(`❌ Post Instance ${instanceId.current} - Error:`, e.message);
            const msg = e?.message || "Error processing request";
            errorToast(msg);
            setError(msg);
        } finally {
            setIsLoading(false);
        }
    }

    return { data, isLoading, setIsLoading, callApi, error };
}