"use client"; // Yeh line bahut zaroori hai kyunki hum camera use kar rahe hain

import React, { useEffect, useRef, useState } from 'react';

export default function AITracker() {
    const videoRef = useRef<HTMLVideoElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const [result, setResult] = useState("Camera ka wait kar rahe hain...");
    const [confidence, setConfidence] = useState(0);

    useEffect(() => {
        let ws: WebSocket;
        let interval: NodeJS.Timeout;
        let lastSpoken = "";

        const setupAI = async () => {
            // 1. Camera On Karna
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (err) {
                console.error("Camera error:", err);
                setResult("Camera permission allow karo!");
                return;
            }

            // 2. Python Server se connect karna
            ws = new WebSocket("ws://127.0.0.1:8000/ws");

            ws.onopen = () => {
                console.log("VibeFit AI Server Connected!");
                setResult("Analyzing pose...");

                // 3. Har 150ms mein photo bhejna
                interval = setInterval(() => {
                    if (videoRef.current && canvasRef.current && ws.readyState === WebSocket.OPEN) {
                        const video = videoRef.current;
                        const canvas = canvasRef.current;
                        const ctx = canvas.getContext('2d');

                        if (video.readyState === video.HAVE_ENOUGH_DATA && ctx) {
                            canvas.width = video.videoWidth;
                            canvas.height = video.videoHeight;
                            ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
                            // Photo compress karke bhejo
                            ws.send(canvas.toDataURL('image/jpeg', 0.5));
                        }
                    }
                }, 150);
            };

            // 4. Server se answer aana aur bolna
            ws.onmessage = (event) => {
                const data = JSON.parse(event.data);
                setResult(data.pose);
                setConfidence(data.confidence);

                if (data.pose !== "Analyzing..." && data.pose !== lastSpoken) {
                    const speech = new SpeechSynthesisUtterance(data.pose);
                    speech.rate = 1.1;
                    window.speechSynthesis.speak(speech);
                    lastSpoken = data.pose;
                }
            };
        };

        setupAI();

        // Jab user page se jaye toh camera aur connection band kar do
        return () => {
            if (interval) clearInterval(interval);
            if (ws) ws.close();
        };
    }, []);

    return (
        <div className="flex flex-col items-center bg-white p-6 rounded-2xl shadow-lg border border-gray-100 max-w-2xl mx-auto">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">VibeFit Live Tracker</h2>

            {/* AI Result Box */}
            <div className="mb-4 text-center">
                <p className="text-3xl font-extrabold text-green-600">
                    {result} {confidence > 0 && <span className="text-lg text-gray-500">({confidence}%)</span>}
                </p>
            </div>

            {/* Video Screen */}
            <div className="relative w-full rounded-xl overflow-hidden bg-gray-100 shadow-inner">
                <video
                    ref={videoRef}
                    autoPlay
                    playsInline
                    className="w-full h-auto transform -scale-x-100"
                />
                <canvas ref={canvasRef} className="hidden" />
            </div>
        </div>
    );
}