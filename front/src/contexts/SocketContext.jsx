import { createContext, useState } from "react";
import { useEffect } from 'react';
import { io } from 'socket.io-client'
export const SocketContext = createContext();
const socket = io(import.meta.env.VITE_HOST);

export const SocketProvider = ({ children }) => {
    const [role, setRole] = useState();
    useEffect(() => {
        function handleRole(role) {
            setRole(role)
        }
        socket.on('role', handleRole);
        return () => {
            socket.off('connect');
            socket.off('role');
        }
    }, [])
    return (
        <SocketContext.Provider value={{ socket, role, setRole }}>
            {children}
        </SocketContext.Provider>
    )
}