import { io } from "socket.io-client";

export const initSocket = async () => {
  const options = {
    "force new connection": true,
    reconnectionAttempts: "Infinity", // Avoid having user reconnect manually in order to prevent dead clients after a server restart
    timeout: 10000, // 10 seconds before connect_error and connect_timeout are emitted.
    transports: ["websocket"],
  };
  return io("http://localhost:5000", options); // Change to your backend URL
};
