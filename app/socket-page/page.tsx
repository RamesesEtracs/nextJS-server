'use client';

import React, { useEffect, useState } from 'react';
import {socket} from '../socket'


export default function page() {
 
  useEffect(() => {
    // Listen for the test-message event from the server

    socket.on("connect", () => {
      console.log("Connecting....", socket.id);
     
    });

    socket.on("deleted", (data) => {
      console.log("Received from server:", data);
    });

    return () => {
      socket.off("test-message");
    };
  }, []);



  const handleDisconnect = () => {
    socket.disconnect();
    console.log("Socket was disconnected");
  }


  const handleConnect = () => {
    socket.connect();
    console.log("Socket was Connected");
  }


    
  return (
    <div>
      This is the Socket Simulation Page
      <div>
        <button onClick={handleDisconnect}>Disconnect</button>
        <button onClick={handleConnect}>Connect</button>
      </div>
    </div>
  )
}


