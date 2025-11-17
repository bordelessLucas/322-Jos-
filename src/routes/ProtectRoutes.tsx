import { Navigate } from "react-router-dom";
import { paths } from "./paths";
import {useAuth} from "../hooks/useAuth";
import type { ReactNode } from "react";

interface ProtectRoutesProps {
    children: ReactNode;
}

export const ProtectedRoutes = ({children} : ProtectRoutesProps) => {
    const {user, loading} = useAuth();

    if(loading) return <div>Loading...</div>;

    if(!user){
        return <Navigate to={paths.login} replace />;
    }

    return <>{children}</>;
}