import React, { createContext, useContext, useMemo } from "react";
import { io } from 'socket.io-client'

const SocketContext = createContext();

export const useSocket = () => {
    return useContext(SocketContext);
}

export const SocketProvider = ({ children }) => {


    const socket = useMemo(() => io('http://localhost:8000'), [])


    return (
        <SocketContext.Provider value={{ socket }} >
            {
                children
            }
        </SocketContext.Provider>
    )
}