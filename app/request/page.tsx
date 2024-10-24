"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";

import { vprequest } from "@/testdata/vprequest";

import QRCode from "react-qr-code";
import * as cryptoServer from "crypto";
import { useRouter } from "next/navigation";

function getRandomUUID() {
  if (typeof window === "undefined") {
    return cryptoServer.randomBytes(16).toString("hex");
  }
  return crypto.randomUUID();
}

export default function RequestQueue() {
  const [idc, setID] = useState<any>();
  const [exists, setExists] = useState<any>(true);

  const router = useRouter();

  useEffect(() => {
    const fetchDocument = async () => {
      try {
        const idc = localStorage.getItem("documentId");
        setID(idc);
        vprequest.challenge = JSON.stringify(idc);
        const response = await axios.get("/rqueue/checkStatus/" + idc);

        if (response.data.data && response.data.isExist === false) {
          setExists(false);
        } else if (response.data.isExist === false) {
          setExists(response.data.isExist);
        }
      } catch (error) {
        console.log("error is", error);
      }
    };
    const interval = setInterval(() => {
      fetchDocument();
      routeHandler();
    }, 2000);
    return () => clearInterval(interval);
  }, [router, exists]);

  const routeHandler = () => {
    if (!exists) {
      router.push("/dummy-page");
    } else {
      return;
    }
  };


  useEffect(() => {
    addQueueHandler();
  }, []);


  const addQueueHandler = async () => {
    const challenge = getRandomUUID();
    try {
      const addQueueResult = await axios.post("/rqueue/addQueue", {
        challenge,
      });
      localStorage.setItem("documentId", addQueueResult.data.challenge);
    } catch (e) {
      console.log(e);
    }
  };


  return (
    <div className="justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      This is the Request Queue Page
      <div className="mt-48">{`Challenge Id: ${idc}`}</div>
      {idc && (
        <QRCode
          size={250}
          style={{ height: "auto" }}
          value={JSON.stringify(vprequest)}
        />
      )}
    </div>
  );
}
