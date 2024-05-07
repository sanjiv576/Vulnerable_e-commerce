import { Navigate } from "react-router-dom"
import { useAuth } from "./authContext"

export const RequireAuth = ({ children }) => {
    const auth = useAuth()

    const storedToken = window.localStorage.getItem('token');


    if (storedToken == null || storedToken == '') {
        return <Navigate to={'/login'} />
    }
    // if (!auth.email) {
    //     return <Navigate to={'/login'} />
    // }

    return children
}