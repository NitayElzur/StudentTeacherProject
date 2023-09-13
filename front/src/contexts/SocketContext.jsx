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
    useEffect(() => {
        
        socket.on('connect-error', (err) => {
            console.log(err.message);
        })
        return () => {
            socket.off('role');
            socket.off('connect-error');
        }
    }, [])
    return (
        <SocketContext.Provider value={{ socket }}>
            {children}
        </SocketContext.Provider>
    )
}