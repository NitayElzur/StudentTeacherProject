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
        socket.on('connect-error', (err) => {
            console.log(err.message);
        })
        socket.on('connect', () => {
            console.log('connected as ' + socket.id);
        })
        return () => {
            socket.off('role');
            socket.off('connect-error');
            socket.off('connect');
        }
    }, [])
    return (
        <SocketContext.Provider value={{ socket, role, setRole }}>
            {children}
        </SocketContext.Provider>
    )
}