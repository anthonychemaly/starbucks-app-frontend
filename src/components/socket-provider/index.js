"use client";

import React, { useEffect, useState } from "react";
import { socket } from "@/network/socket";
import Image from "next/image";

const SocketProvider = ({ children }) => {
  const [isConnected, setIsConnected] = useState(socket.connected);
  const [input, setInput] = useState(null);

  const USER_ID = 1;

  useEffect(() => {
    function onConnect() {
      console.log("connected");
      setIsConnected(true);
    }

    function onMessageReceive(message) {
      console.log(message);
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
    socket.emit("send_message", {
      userId: USER_ID,
      message: input,
    });
  }

  return (
    <div className="container p-8 max-w-[50%] h-screen flex flex-col justify-between mx-auto">
      <div>
        <div className="chat chat-start">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image src="/za3al.JPG" alt="za3al" width={32} height={32} />
            </div>
          </div>
          <div className="chat-header mb-1">
            Catherina (Za3al)
            <time className="text-xs ml-2 opacity-50">12:45</time>
          </div>
          <div className="chat-bubble">You were the Chosen One!</div>
        </div>
        <div className="chat chat-end">
          <div className="chat-image avatar">
            <div className="w-10 rounded-full">
              <Image src="/anthony.jpeg" alt="Anthony" width={32} height={32} />
            </div>
          </div>
          <div className="chat-header mb-1">
            Anthony Chmexeye
            <time className="text-xs ml-2 opacity-50">12:46</time>
          </div>
          <div className="chat-bubble">I hate you!</div>
        </div>
      </div>

      <div className="flex">
        <input
          type="text"
          className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
          placeholder="Write your message here..."
          required
          onChange={(e) => setInput(e.target.value)}
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
