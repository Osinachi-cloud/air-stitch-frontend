// import { useEffect, useState, useRef } from "react"
// import { RootState, useAppSelector } from "@/redux/store";
// import { useLocalStorage } from "./useLocalStorage";
// import { errorToast, successToast } from "./UseToast";
// import { useRouter } from 'next/navigation';

// export const usePost = (methodType: string, body: any, url: string, route: string | null) => {
//     const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
    
//     // Add instance tracking
//     const instanceId = useRef(Math.random().toString(36).substring(7));
//     const hasLoggedCreation = useRef(false);
    
//     // Only log creation once
//     if (!hasLoggedCreation.current) {
//         console.log(`📝 Post Hook ${instanceId.current} CREATED for:`, url);
//         hasLoggedCreation.current = true;
//     }

//     console.log(`📦 Post Instance ${instanceId.current} -`, methodType, body, url);

//     const [data, setData] = useState<any>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const token = getUserDetails()?.accessToken;
//     const router = useRouter();

//     console.log(`🔑 Post Instance ${instanceId.current} token ====>`, token);

//     const callApi = async () => {
//         // Prevent multiple simultaneous calls
//         if (isLoading) {
//             console.log(`⏭️ Post Instance ${instanceId.current} - Already loading, skipping`);
//             return;
//         }
        
//         console.log(`🚀 Post Instance ${instanceId.current} - Calling API:`, url);
//         setIsLoading(true);
        
//         try {
//             const headers: Record<string, string> = {
//                 'Content-Type': 'application/json',
//             };

//             if (token) {
//                 headers.Authorization = `Bearer ${token}`;
//             }

//             const fetchOptions: RequestInit = {
//                 method: methodType,
//                 headers: headers,
//             };

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
//             console.log(`✅ Post Instance ${instanceId.current} - Success:`, dataResponse);
            
//             if (route !== null && route !== undefined) {
//                 router.push(`/${route}`);
//             }

//         } catch (e: any) {
//             console.log(`❌ Post Instance ${instanceId.current} - Error:`, e.message);
//             const msg = e?.message || "Error processing request";
//             errorToast(msg);
//             setError(msg);
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     return { data, isLoading, setIsLoading, callApi, error };
// }

// export const usePostWithoutRouting = (methodType: string, body: any, url: string) => {
//     const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
    
//     // Add instance tracking
//     const instanceId = useRef(Math.random().toString(36).substring(7));
//     const hasLoggedCreation = useRef(false);
    
//     if (!hasLoggedCreation.current) {
//         console.log(`📝 Post Hook (no routing) ${instanceId.current} CREATED for:`, url);
//         hasLoggedCreation.current = true;
//     }

//     console.log(`📦 Post Instance ${instanceId.current} -`, methodType, body, url);

//     const [data, setData] = useState<any>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const token = getUserDetails()?.accessToken;

//     console.log(`🔑 Post Instance ${instanceId.current} token ====>`, token);

//     const callApi = async () => {
//         // Prevent multiple simultaneous calls
//         if (isLoading) {
//             console.log(`⏭️ Post Instance ${instanceId.current} - Already loading, skipping`);
//             return;
//         }
        
//         console.log(`🚀 Post Instance ${instanceId.current} - Calling API:`, url);
//         setIsLoading(true);
        
//         try {
//             const headers: Record<string, string> = {
//                 'Content-Type': 'application/json',
//             };

//             if (token) {
//                 headers.Authorization = `Bearer ${token}`;
//             }

//             const fetchOptions: RequestInit = {
//                 method: methodType,
//                 headers: headers,
//             };

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
//             console.log(`✅ Post Instance ${instanceId.current} - Success:`, dataResponse);

//         } catch (e: any) {
//             console.log(`❌ Post Instance ${instanceId.current} - Error:`, e.message);
//             const msg = e?.message || "Error processing request";
//             errorToast(msg);
//             setError(msg);
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     return { data, isLoading, setIsLoading, callApi, error };
// }






import { useState, useRef } from "react"
import { useLocalStorage } from "./useLocalStorage";
import { errorToast, successToast } from "./UseToast";
import { useRouter } from 'next/navigation';
import { useAuth } from "./jwtHooks"; // ADD THIS

export const usePost = (methodType: string, body: any, url: string, route: string | null) => {
    const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);
    const { checkTokenAndRedirect } = useAuth(); // ADD THIS
    
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
        
        // ADD THIS - Check token before posting
        if (token && !checkTokenAndRedirect()) return;
        
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

            // ADD THIS - Check if response is 401
            if (apiResponse.status === 401) {
                checkTokenAndRedirect();
                return;
            }

            if (!apiResponse.ok) {
                const errorText = await apiResponse.text();
                throw new Error(`HTTP error! status: ${apiResponse.status}, message: ${errorText}`);
            }

            const dataResponse = await apiResponse.json();
            successToast(dataResponse?.message); 
            setData(dataResponse?.message);
            console.log(`✅ Successful Post Instance ${instanceId.current} - Success:`, dataResponse);
            
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
    const { checkTokenAndRedirect } = useAuth(); // ADD THIS
    
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
        
        // ADD THIS - Check token before posting
        if (token && !checkTokenAndRedirect()) return;
        
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

            // ADD THIS - Check if response is 401
            if (apiResponse.status === 401) {
                checkTokenAndRedirect();
                return;
            }

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