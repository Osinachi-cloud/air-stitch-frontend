import { toast } from "react-toastify";


export const successToast = (test: string) => toast.success(test, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
    // theme: "colored"

    // position: "top-center",
    draggable: true,
    theme: "light",
})


export const errorToast = (test: string) => toast.error(test, {
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    progress: undefined,
    theme: "colored"
})