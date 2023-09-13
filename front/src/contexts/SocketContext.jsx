import { createContext, useState } from "react";
import { useEffect } from 'react';
import { io } from 'socket.io-client'
export const SocketContext = createContext();
const socket = io(import.meta.env.VITE_HOST, {
    reconnection: true,
    reconnectionDelay: 1000,
    reconnectionDelayMax: 30 * 1000
});

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
        socket.on('disconnect', () => {
            console.log('disconnected');
        })
        socket.on('connect', () => {
            socket.recovered && console.log('recovered');
        })
        return () => {
            socket.off('role');
            socket.off('connect-error');
            socket.off('disconnect');
        }
    }, [])
    return (
        <SocketContext.Provider value={{ socket, role, setRole }}>
            {children}
        </SocketContext.Provider>
    )
}