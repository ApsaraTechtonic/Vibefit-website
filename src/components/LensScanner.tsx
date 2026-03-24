'use client';

import { useState, useEffect, useRef } from 'react';
import { X, Camera, Upload, Sparkles } from 'lucide-react';
import { logWeight } from '@/actions/logs';

export function LensScanner({ isOpen, onClose }: { isOpen: boolean, onClose: () => void }) {
  const [scanning, setScanning] = useState(false);
  const [showModal, setShowModal] = useState(isOpen);
  const [scanType, setScanType] = useState<'food' | 'scale' | 'gym'>('food');
  
  const fileInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setShowModal(true);
    } else {
      setTimeout(() => setShowModal(false), 300);
    }
  }, [isOpen]);

  const handleCapture = () => cameraInputRef.current?.click();
  const handleUpload = () => fileInputRef.current?.click();

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setScanning(true);
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, scanType }),
        });
        const data = await res.json();
        
        if (data.success) {
           if (scanType === 'scale') {
              // Extract the first number found ignoring text
              const rawText = data.result || '';
              const match = rawText.match(/(\d+(\.\d+)?)/);
              const num = match ? parseFloat(match[0]) : NaN;
              
              if (!isNaN(num)) {
                 await logWeight(num);
                 alert(`Successfully tracked: ${num} kg!`);
              } else {
                 alert("Could not detect numbers on the scale. Please try again.");
              }
           } else {
              alert(`VibeVision identified: ${data.result}`);
           }
           onClose();
        } else {
           alert(data.error || "Failed to process image.");
        }
      } catch (err) {
        alert("Network error processing image.");
      }
      setScanning(false);
    };
    reader.readAsDataURL(file);
  };

  if (!showModal) return null;

  return (
    <div className={`fixed inset-0 z-[100] flex items-end sm:items-center justify-center bg-black/40 backdrop-blur-sm transition-opacity duration-300 ${isOpen ? 'opacity-100' : 'opacity-0'}`}>
      <div 
        className={`bg-[var(--color-background)] w-full max-w-md h-[90vh] sm:h-[650px] sm:rounded-[32px] rounded-t-[32px] overflow-hidden flex flex-col relative transition-transform duration-500 ease-out shadow-2xl ${isOpen ? 'translate-y-0' : 'translate-y-full'}`}
      >
        {/* Header */}
        <div className="flex justify-between items-center p-6 border-b border-gray-200/40">
          <h2 className="text-xl font-heading font-semibold">VibeVision AI</h2>
          <button onClick={onClose} className="p-2 bg-gray-100 rounded-full hover:bg-gray-200 transition-colors">
            <X size={20} />
          </button>
        </div>
        
        {/* Content */}
        <div className="flex-1 p-6 flex flex-col items-center justify-start relative">
          
          {/* Mode Selector */}
          <div className="flex gap-2 w-full bg-gray-100/80 p-1.5 rounded-full mb-6 relative z-10">
            <button onClick={() => setScanType('food')} className={`flex-1 py-2.5 text-xs font-bold rounded-full uppercase tracking-widest transition-all ${scanType === 'food' ? 'bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] text-black' : 'text-gray-500 hover:text-gray-700'}`}>Food</button>
            <button onClick={() => setScanType('scale')} className={`flex-1 py-2.5 text-xs font-bold rounded-full uppercase tracking-widest transition-all ${scanType === 'scale' ? 'bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] text-black' : 'text-gray-500 hover:text-gray-700'}`}>Scale</button>
            <button onClick={() => setScanType('gym')} className={`flex-1 py-2.5 text-xs font-bold rounded-full uppercase tracking-widest transition-all ${scanType === 'gym' ? 'bg-white shadow-[0_2px_8px_-2px_rgba(0,0,0,0.1)] text-black' : 'text-gray-500 hover:text-gray-700'}`}>Gym</button>
          </div>

          {scanning ? (
             <div className="flex-1 flex flex-col items-center justify-center gap-8 w-full pb-10">
               <div className="w-24 h-24 rounded-full bg-foreground flex items-center justify-center relative shadow-lg">
                  <div className="absolute inset-0 rounded-full border-t-2 border-white animate-spin"></div>
                  <Sparkles size={36} className="text-white relative z-10" />
               </div>
               <p className="font-sans font-semibold text-gray-800 tracking-wider uppercase animate-pulse">Running Google Lens AI...</p>
             </div>
          ) : (
            <div className="flex-1 flex flex-col w-full">
              <div className="w-full flex-1 min-h-[50%] bg-gray-100/50 rounded-[32px] border-2 border-dashed border-gray-300 flex items-center justify-center relative overflow-hidden group">
                  <div className="text-center p-8 flex flex-col items-center gap-4">
                    <div className="w-16 h-16 bg-white rounded-full flex items-center justify-center shadow-sm">
                      <Camera size={28} className="text-gray-400" />
                    </div>
                    <p className="text-sm font-sans font-medium text-gray-500 leading-relaxed px-4">
                      {scanType === 'food' && "Center your meal for AI calorie & macro estimation."}
                      {scanType === 'scale' && "Capture your scale display for auto-logging."}
                      {scanType === 'gym' && "Scan equipment for AI exercise suggestions and tracking."}
                    </p>
                  </div>
              </div>
              
              <div className="mt-6 flex gap-4 w-full pb-4">
                <input type="file" ref={cameraInputRef} accept="image/*" capture="environment" className="hidden" onChange={handleFileChange} />
                <input type="file" ref={fileInputRef} accept="image/*" className="hidden" onChange={handleFileChange} />
                
                <button onClick={handleCapture} className="flex-1 py-4 bg-foreground text-background rounded-[20px] font-semibold font-sans uppercase tracking-widest shadow-lg hover:bg-gray-800 transition-colors hover:-translate-y-0.5 active:translate-y-0">
                  Camera
                </button>
                <button onClick={handleUpload} className="p-4 bg-white border border-gray-200 rounded-[20px] text-foreground shadow-sm flex items-center justify-center hover:bg-gray-50 transition-colors">
                  <Upload size={24} strokeWidth={2.5} />
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
