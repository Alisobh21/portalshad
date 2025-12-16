"use client";
import { useEffect, useState, useRef } from "react";
import { io, type Socket } from "socket.io-client";

/**
 * A custom React hook for managing WebSocket connections using Socket.IO
 *
 * @param events - An object mapping event names to their handler functions.
 *                The keys are event names (strings) and values are callback functions.
 *                Default is an empty object.
 *
 * @returns An object containing:
 *          - socket: The Socket.IO socket instance
 *          - connected: Boolean indicating if socket is currently connected
 *          - emit: Function to emit events through the socket
 *
 * @example
 * ```tsx
 * const { socket, connected, emit } = useSocket({
 *   'message': (data) => console.log('Received message:', data),
 *   'notification': (data) => showNotification(data)
 * });
 * ```
 */

// Define a fixed URL to always use for the socket connection.
// This can be replaced with your desired fixed URL.
const FIXED_SOCKET_URL = "https://sockets.bolesa.app"; // example fixed URL

let globalSocket: Socket | null = null;

export function useSocket(events: Record<string, (...args: any[]) => void> = {}) {
    // Reference to store socket instance that persists across re-renders
    const socketRef = useRef<Socket | null>(null);
    // State to track socket connection status
    const [connected, setConnected] = useState(false);

    useEffect(() => {
        // Initialize socket connection if not already established
        if (!globalSocket) {
            // Use the fixed URL instead of the origin or NEXT_PUBLIC_SOCKET_URL
            const url = process.env.NEXT_PUBLIC_SOCKET_URL ?? "";
            globalSocket = io(url, {
                autoConnect: true,
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 10000,
                transports: ["websocket", "polling"],
                withCredentials: true,
            });
        }

        const socket = globalSocket;

        // Set up connection status handlers
        socket.on("connect", () => setConnected(true));
        socket.on("disconnect", (reason) => {
            console.log("Socket disconnected because:", reason);
            setConnected(false);
        });
        socket.on("connect_error", (error) => {
            console.error("Socket connection error:", error);
            setConnected(false);
        });

        // Register all event handlers passed in through events prop
        for (const [event, handler] of Object.entries(events)) {
            socket.on(event, handler);
        }

        // Cleanup function to remove event listeners when component unmounts
        // or when events prop changes
        return () => {
            for (const [event, handler] of Object.entries(events)) {
                socket.off(event, handler);
            }
            // socket.disconnect();
        };
    }, [events]);

    /**
     * Emits an event through the socket with optional data
     * @param event - The name of the event to emit
     * @param data - Optional data to send with the event
     */
    const emit = (event: string, data?: unknown) => {
        globalSocket?.emit(event, data);
    };

    return { socket: globalSocket, connected, emit };
}
