"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function AITracker() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [result, setResult] = useState("Camera ka wait kar rahe hain...");
    const [confidence, setConfidence] = useState(0);

    // DHYAN DEIN: Jab phone par test karna ho, toh '127.0.0.1' ko apne laptop ke Wi-Fi IP se badalna hoga (Step 2 padho)
    const serverIP = "127.0.0.1";

    useEffect(() => {
        let ws: WebSocket;
        let interval: NodeJS.Timeout;
        let lastSpoken = "";

        const setupAI = async () => {
            try {
                // Mobile ke liye Front Camera (Selfie) force karna
                const stream = await navigator.mediaDevices.getUserMedia({
                    video: { facingMode: "user" }
                });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera error:", err);
                setResult("Camera permission allow karo!");
                return;
            }

            ws = new WebSocket(`ws://${serverIP}:8000/ws`);

            ws.onopen = () => {
                console.log("VibeFit AI Server Connected!");
                setResult("Analyzing pose...");

                interval = setInterval(() => {
                    if (videoRef.current && canvasRef.current && ws.readyState === WebSocket.OPEN) {
                        const video = videoRef.current;
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext('2d');

                        if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            ws.send(canvas.toDataURL('image/jpeg', 0.5));
                        }
                    }
                }, 150);
            };

            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setResult(data.pose);
                setConfidence(data.confidence);

                // NAYA VOICE LOGIC: Accuracy percentage bolna
                if (data.pose !== "Analyzing..." && data.pose !== lastSpoken) {
                    // AI kya bolega yeh yahan set hota hai
                    const textToSpeak = `${data.pose}, ${data.confidence} percent`;

                    const speech = new SpeechSynthesisUtterance(textToSpeak);
                    speech.rate = 1.1; // Bolne ki speed
                    window.speechSynthesis.speak(speech);
                    lastSpoken = data.pose;
                }
            };
        };

        setupAI();

        return () => {
            if (interval) clearInterval(interval);
            if (ws) ws.close();
        };
    }, []);

    return (
        <div className="flex flex-col items-center bg-white p-4 md:p-6 rounded-2xl shadow-lg border border-gray-100 w-full max-w-2xl mx-auto">
            <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-4">VibeFit Live Tracker</h2>

            <div className="mb-4 text-center">
                <p className="text-2xl md:text-3xl font-extrabold text-green-600">
                    {result} {confidence > 0 && <span className="text-lg text-gray-500">({confidence}%)</span>}
                </p>
            </div>

            {/* Mobile screen ke hisaab se responsive video frame */}
            <div className="relative w-full aspect-video rounded-xl overflow-hidden bg-black shadow-inner">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-full object-cover transform -scale-x-100"
                />
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}