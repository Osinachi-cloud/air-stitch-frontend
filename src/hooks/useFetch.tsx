// import { useEffect, useRef, useState } from "react"
// import { RootState, useAppSelector } from "@/redux/store";
// import { useLocalStorage } from "./useLocalStorage";


// export const useFetchs = (methodType: string, body: any, url: string) => {
//     const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

//     console.log(methodType, body, url);

//     const [data, setData] = useState<any>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const token = getUserDetails()?.accessToken

//     console.log("token ====>", token);

//     const apiFetchOnRender = async () => {
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
//             setData(dataResponse);
//             setIsLoading(false);
//             console.log(dataResponse);

//         } catch (e: any) {
//             console.log(e);
//             setIsLoading(false);
//             setError(e.message || "An error occurred while fetching data")
//         }
//     }

//     useEffect(() => {
//         apiFetchOnRender();
//     }, [url, methodType, JSON.stringify(body)]) 


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
//             setData(dataResponse);
//             setIsLoading(false);
//             console.log(dataResponse);

//         } catch (e: any) {
//             console.log(e);
//             setIsLoading(false);
//             // Ensure error is a string, not an Error object
//             setError(e.message || "An error occurred while fetching data")
//         }
//     }

//     return { data, isLoading, setIsLoading, callApi, error };
// }



// export const useFetch = (methodType: string, body: any, url: string) => {
//     const instanceId = useRef(Math.random().toString(36).substring(7));
//     const [data, setData] = useState<any>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);
    
//     const { getUserDetails } = useLocalStorage("userDetails", null);
//     const token = getUserDetails()?.accessToken

//     // Use a ref to track if this is the first render
//     const isFirstRender = useRef(true);
//     const hasFetched = useRef(false);

//     const apiFetchOnRender = async () => {
//         // Prevent double fetch in development
//         if (hasFetched.current && process.env.NODE_ENV === 'development') {
//             console.log(`⏭️ Instance ${instanceId.current} - Skipping duplicate fetch`);
//             return;
//         }
        
//         hasFetched.current = true;
//         setIsLoading(true);
        
//         try {
//             const headers: Record<string, string> = {
//                 'Content-Type': 'application/json',
//                 ...(token && { 'Authorization': `Bearer ${token}` })
//             };

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
//             setData(dataResponse);
//             console.log(`✅ Instance ${instanceId.current} - Success:`, dataResponse);

//         } catch (e: any) {
//             console.log(`❌ Instance ${instanceId.current} - Error:`, e);
//             setError(e.message || "An error occurred while fetching data");
//         } finally {
//             setIsLoading(false);
//         }
//     }

//     useEffect(() => {
//         // In development with Strict Mode, this will run twice
//         // but our hasFetched ref will prevent double API calls
//         apiFetchOnRender();
        
//         // Cleanup function
//         return () => {
//             console.log(`🧹 Instance ${instanceId.current} - Cleanup`);
//         };
//     }, [url, methodType, JSON.stringify(body)]);

//     const callApi = async () => {
//         // For manual calls, always allow
//         hasFetched.current = false; // Reset for manual calls
//         await apiFetchOnRender();
//     }

//     return { data, isLoading, setIsLoading, callApi, error };
// }




// export const useCallFetch = (methodType: string, body: any, url: string, shouldCallApi: boolean) => {
//     const { value, getUserDetails, setValue: setStoredValue, removeValue: removeStoredValue } = useLocalStorage("userDetails", null);

//     console.log(methodType, body, url);

//     const [data, setData] = useState<any>();
//     const [isLoading, setIsLoading] = useState(false);
//     const [error, setError] = useState<string | null>(null);

//     const token = getUserDetails()?.accessToken

//     console.log("token ====>", token);

//     const apiFetchOnRender = async () => {
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
//             setData(dataResponse);
//             setIsLoading(false);
//             console.log(dataResponse);

//         } catch (e: any) {
//             console.log(e);
//             setIsLoading(false);
//             setError(e.message || "An error occurred while fetching data")
//         }
//     }

//     useEffect(() => {
//         shouldCallApi && apiFetchOnRender();
//     }, [url, methodType, JSON.stringify(body)])

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
//             setData(dataResponse);
//             setIsLoading(false);
//             console.log(dataResponse);

//         } catch (e: any) {
//             console.log(e);
//             setIsLoading(false);
//             // Ensure error is a string, not an Error object
//             setError(e.message || "An error occurred while fetching data")
//         }
//     }

//     return { data, isLoading, setIsLoading, callApi, error };
// }










import { useEffect, useRef, useState } from "react"
import { useLocalStorage } from "./useLocalStorage";
import { useAuth } from "./jwtHooks";


export const useFetch = (methodType: string, body: any, url: string | null) => {
    const instanceId = useRef(Math.random().toString(36).substring(7));
    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    
    const { getUserDetails } = useLocalStorage("userDetails", null);
    const token = getUserDetails()?.accessToken
    const { checkTokenAndRedirect } = useAuth(); // ADD THIS

    // Use refs to track fetch state
    const hasFetched = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Memoize body to prevent unnecessary re-fetches
    const bodyString = body ? JSON.stringify(body) : null;

    const apiFetchOnRender = async () => {
        // Don't fetch if no URL
        if (!url) {
            console.log(`⏭️ Instance ${instanceId.current} - No URL provided`);
            return;
        }

        // ADD THIS - Check token before fetching
        if (token && !checkTokenAndRedirect()) return;

        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        // Prevent double fetch in development with Strict Mode
        if (hasFetched.current && process.env.NODE_ENV === 'development') {
            console.log(`⏭️ Instance ${instanceId.current} - Skipping duplicate fetch`);
            return;
        }
        
        hasFetched.current = true;
        setIsLoading(true);
        setError(null);
        
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            const fetchOptions: RequestInit = {
                method: methodType,
                headers: headers,
                signal: abortControllerRef.current.signal,
            };

            if (body && methodType !== 'GET') {
                fetchOptions.body = JSON.stringify(body);
            }

            console.log(`🌐 Instance ${instanceId.current} - Fetching:`, url);
            const apiResponse = await fetch(url, fetchOptions);
            
            setResponseStatus(apiResponse.status);

            // ADD THIS - Check if response is 401
            if (apiResponse.status === 401) {
                checkTokenAndRedirect();
                return;
            }

            // Check if response is JSON
            const contentType = apiResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await apiResponse.text();
                console.error('Non-JSON response:', textResponse);
                throw new Error(`Expected JSON but got ${contentType || 'no content-type'}`);
            }

            const dataResponse = await apiResponse.json();
            
            if (!apiResponse.ok) {
                throw new Error(dataResponse.message || `HTTP error! status: ${apiResponse.status}`);
            }

            setData(dataResponse);
            console.log(`✅ Instance ${instanceId.current} - Success:`, dataResponse);

        } catch (e: any) {
            // Don't set error if it's an abort error
            if (e.name === 'AbortError') {
                console.log(`🛑 Instance ${instanceId.current} - Request aborted`);
                return;
            }
            
            console.log(`❌ Instance ${instanceId.current} - Error:`, e);
            setError(e.message || "An error occurred while fetching data");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (url) {
            apiFetchOnRender();
        }
        
        return () => {
            hasFetched.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [url, methodType, bodyString, token]);

    const callApi = async () => {
        // For manual calls, always allow
        hasFetched.current = false;
        
        // Cancel any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        await apiFetchOnRender();
    }

    return { 
        data, 
        isLoading, 
        setIsLoading, 
        callApi, 
        error,
        responseStatus 
    };
}


export const useCallFetch = (methodType: string, body: any, url: string | null, shouldCallApi: boolean) => {
    const instanceId = useRef(Math.random().toString(36).substring(7));
    const [data, setData] = useState<any>();
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [responseStatus, setResponseStatus] = useState<number | null>(null);
    
    const { getUserDetails } = useLocalStorage("userDetails", null);
    const token = getUserDetails()?.accessToken
    const { checkTokenAndRedirect } = useAuth(); // ADD THIS

    // Use refs to track fetch state
    const hasFetched = useRef(false);
    const abortControllerRef = useRef<AbortController | null>(null);

    // Memoize body to prevent unnecessary re-fetches
    const bodyString = body ? JSON.stringify(body) : null;

    const apiFetchOnRender = async () => {
        // Don't fetch if no URL
        if (!url) {
            console.log(`⏭️ Instance ${instanceId.current} - No URL provided`);
            return;
        }

        // ADD THIS - Check token before fetching
        if (token && !checkTokenAndRedirect()) return;

        // Cancel previous request if exists
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        // Create new abort controller
        abortControllerRef.current = new AbortController();

        // Prevent double fetch in development with Strict Mode
        if (hasFetched.current && process.env.NODE_ENV === 'development') {
            console.log(`⏭️ Instance ${instanceId.current} - Skipping duplicate fetch`);
            return;
        }
        
        hasFetched.current = true;
        setIsLoading(true);
        setError(null);
        
        try {
            const headers: Record<string, string> = {
                'Content-Type': 'application/json',
                ...(token && { 'Authorization': `Bearer ${token}` })
            };

            const fetchOptions: RequestInit = {
                method: methodType,
                headers: headers,
                signal: abortControllerRef.current.signal,
            };

            if (body && methodType !== 'GET') {
                fetchOptions.body = JSON.stringify(body);
            }

            console.log(`🌐 Instance ${instanceId.current} - Fetching:`, url);
            const apiResponse = await fetch(url, fetchOptions);
            
            setResponseStatus(apiResponse.status);

            // ADD THIS - Check if response is 401
            if (apiResponse.status === 401) {
                checkTokenAndRedirect();
                return;
            }

            // Check if response is JSON
            const contentType = apiResponse.headers.get('content-type');
            if (!contentType || !contentType.includes('application/json')) {
                const textResponse = await apiResponse.text();
                console.error('Non-JSON response:', textResponse);
                throw new Error(`Expected JSON but got ${contentType || 'no content-type'}`);
            }

            const dataResponse = await apiResponse.json();
            
            if (!apiResponse.ok) {
                throw new Error(dataResponse.message || `HTTP error! status: ${apiResponse.status}`);
            }

            setData(dataResponse);
            console.log(`✅ Instance ${instanceId.current} - Success:`, dataResponse);

        } catch (e: any) {
            // Don't set error if it's an abort error
            if (e.name === 'AbortError') {
                console.log(`🛑 Instance ${instanceId.current} - Request aborted`);
                return;
            }
            
            console.log(`❌ Instance ${instanceId.current} - Error:`, e);
            setError(e.message || "An error occurred while fetching data");
        } finally {
            setIsLoading(false);
        }
    }

    useEffect(() => {
        if (url && shouldCallApi) {
            apiFetchOnRender();
        }
        
        return () => {
            hasFetched.current = false;
            if (abortControllerRef.current) {
                abortControllerRef.current.abort();
            }
        };
    }, [url, methodType, bodyString, token]);

    const callApi = async () => {
        // For manual calls, always allow
        hasFetched.current = false;
        
        // Cancel any ongoing request
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }
        
        await apiFetchOnRender();
    }

    return { 
        data, 
        isLoading, 
        setIsLoading, 
        callApi, 
        error,
        responseStatus 
    };
}

export const useDownload = () => {
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [progress, setProgress] = useState<number>(0);
    const abortControllerRef = useRef<AbortController | null>(null);
    
    const { getUserDetails } = useLocalStorage("userDetails", null);
    const token = getUserDetails()?.accessToken
    const { checkTokenAndRedirect } = useAuth(); // ADD THIS

    const downloadExcel = async (url: string | URL, filename?: string) => {
        // ADD THIS - Check token before download
        if (token && !checkTokenAndRedirect()) return { success: false, error: 'Authentication failed' };

        // Cancel any ongoing download
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
        }

        abortControllerRef.current = new AbortController();

        setIsLoading(true);
        setError(null);
        setProgress(0);

        try {
            const urlString = url instanceof URL ? url.toString() : url;
            
            const response = await fetch(urlString, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Accept': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet, application/octet-stream'
                },
                signal: abortControllerRef.current.signal
            });

            // ADD THIS - Check if response is 401
            if (response.status === 401) {
                checkTokenAndRedirect();
                return { success: false, error: 'Session expired' };
            }

            if (!response.ok) {
                // Try to parse error response
                const contentType = response.headers.get('content-type');
                if (contentType?.includes('application/json')) {
                    const errorData = await response.json();
                    throw new Error(errorData.message || `Download failed: ${response.status}`);
                } else {
                    const errorText = await response.text();
                    throw new Error(errorText || `Download failed with status: ${response.status}`);
                }
            }

            // Check content type
            const contentType = response.headers.get('content-type');
            const isExcelFile = contentType?.includes('spreadsheetml') || 
                               contentType?.includes('octet-stream') ||
                               filename?.endsWith('.xlsx') || 
                               filename?.endsWith('.xls');

            // Get content length for progress tracking
            const contentLength = response.headers.get('content-length');
            const total = contentLength ? parseInt(contentLength, 10) : 0;

            let blob: Blob;

            // If we can track progress, use reader
            if (response.body && total > 0) {
                const reader = response.body.getReader();
                const chunks: Uint8Array[] = [];
                let receivedLength = 0;

                while (true) {
                    const { done, value } = await reader.read();
                    
                    if (done) break;
                    
                    chunks.push(value);
                    receivedLength += value.length;
                    
                    // Update progress
                    const percent = (receivedLength / total) * 100;
                    setProgress(Math.round(percent));
                }

                // Combine chunks
                const chunksAll = new Uint8Array(receivedLength);
                let position = 0;
                for (const chunk of chunks) {
                    chunksAll.set(chunk, position);
                    position += chunk.length;
                }
                
                blob = new Blob([chunksAll], { 
                    type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
                });
            } else {
                // If no progress tracking, just get blob directly
                blob = await response.blob();
                setProgress(100);
            }

            // Validate that we got a valid blob
            if (blob.size === 0) {
                throw new Error('Downloaded file is empty');
            }

            // Get filename from Content-Disposition header
            const contentDisposition = response.headers.get('content-disposition');
            let finalFilename = filename || 'export.xlsx';
            
            if (contentDisposition) {
                const filenameMatch = contentDisposition.match(/filename[^;=\n]*=((['"]).*?\2|[^;\n]*)/);
                if (filenameMatch && filenameMatch[1]) {
                    finalFilename = filenameMatch[1].replace(/['"]/g, '');
                }
            }

            // Ensure .xlsx extension
            if (!finalFilename.toLowerCase().endsWith('.xlsx') && 
                !finalFilename.toLowerCase().endsWith('.xls')) {
                finalFilename += '.xlsx';
            }

            // Create and trigger download
            const downloadUrl = window.URL.createObjectURL(blob);
            const link = document.createElement('a');
            link.href = downloadUrl;
            link.download = finalFilename;
            
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
            
            // Cleanup
            setTimeout(() => {
                window.URL.revokeObjectURL(downloadUrl);
            }, 100);

            return { success: true, filename: finalFilename, size: blob.size };

        } catch (err: any) {
            if (err.name === 'AbortError') {
                console.log('Download aborted');
                return { success: false, error: 'Download aborted' };
            }
            
            console.error('Download error:', err);
            setError(err.message || 'Failed to download file');
            return { success: false, error: err.message };
        } finally {
            setIsLoading(false);
            abortControllerRef.current = null;
        }
    };

    const cancelDownload = () => {
        if (abortControllerRef.current) {
            abortControllerRef.current.abort();
            abortControllerRef.current = null;
        }
    };

    return { 
        downloadExcel, 
        cancelDownload,
        isLoading, 
        error, 
        progress 
    };
}