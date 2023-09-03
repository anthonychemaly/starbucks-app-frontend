"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/network/socket";
import Image from "next/image";

const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [input, setInput] = useState(null);
  const [messages, setMessages] = useState([]);

  const USER_ID = process.env.NEXT_PUBLIC_USER_ID;

  useEffect(() => {
    function onConnect() {
      console.log("connected");
      setIsConnected(true);
    }

    function onMessageReceive(message) {
      setMessages((messages) => [...messages, message]);
    }

    function onDisconnect() {
      setIsConnected(false);
      console.log("disconnected");
    }

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);
    socket.on(`receive_message_${USER_ID}`, onMessageReceive);

    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off(`receive_message_${USER_ID}`, onMessageReceive);
    };
  }, []);

  function sendMessage() {
    setMessages((messages) => [
      ...messages,
      {
        userId: USER_ID,
        message: input,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);

    socket.emit("send_message", {
      userId: USER_ID,
      message: input,
    });
    setInput("");
  }

  return (
    <div className="container p-8 max-w-[50%] h-screen flex flex-col justify-between mx-auto">
      <div>
        {messages?.map((item, idx) => (
          <div
            className={`chat ${
              item?.userId === USER_ID ? "chat-end" : "chat-start"
            }`}
            key={idx}
          >
            <div className="chat-image avatar">
              <div className="w-10 rounded-full">
                <Image
                  src={item?.userId === 1 ? "/anthony.jpeg" : "/za3al.JPG"}
                  alt="profile picture"
                  width={32}
                  height={32}
                />
              </div>
            </div>
            <div className="chat-header mb-1">
              {item?.userId === 1 ? "Anthony Chmexeye" : "Catherina (Za3al)"}
              <time className="text-xs ml-2 opacity-50">{item?.timestamp}</time>
            </div>
            <div className="chat-bubble">{item?.message}</div>
          </div>
        ))}
      </div>

      <div className="flex">
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your message here..."
          required
          onChange={(e) => setInput(e.target.value)}
          value={input}
        />
        <button
          className="btn btn-primary ml-2 text-white"
          onClick={() => {
            sendMessage();
          }}
        >
          Send
        </button>
      </div>
    </div>
  );
};

export default SocketProvider;
