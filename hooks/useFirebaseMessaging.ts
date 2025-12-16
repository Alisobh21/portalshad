"use client";

import { useEffect, useState } from "react";
import { getMessaging, isSupported, Messaging } from "firebase/messaging";
import { initializeApp, getApps, getApp } from "firebase/app";

const firebaseConfig = {
    apiKey: "AIzaSyB290uk7Ro_K_DONh1X9f96g2ENWNfgWVw",
    authDomain: "st-ui-ff.bolesa.net",
    projectId: "bolesa-wms",
    storageBucket: "bolesa-wms.firebasestorage.app",
    messagingSenderId: "159548524972",
    appId: "1:159548524972:web:2b274e91cc477c55815209",
    measurementId: "G-C4XF9L1RZH",
};

const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export function useFirebaseMessaging() {
    const [messaging, setMessaging] = useState<Messaging | null>(null);

    useEffect(() => {
        if (typeof window !== "undefined") {
            isSupported().then((supported) => {
                if (supported) {
                    const messagingInstance = getMessaging(app);
                    setMessaging(messagingInstance);
                }
            });
        }
    }, []);

    return messaging;
}
