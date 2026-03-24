'use client';

import { useState, useRef } from 'react';
import { Card } from './ui/Card';
import { Droplets, Pill, Utensils, Plus, Scale, Camera, Upload } from 'lucide-react';
import { logWater, logFood, logMedication, logWeight } from '@/actions/logs';

export function DailyLogsForm() {
  const scaleInputRef = useRef<HTMLInputElement>(null);
  const cameraInputRef = useRef<HTMLInputElement>(null);
  const [isScanningScale, setIsScanningScale] = useState(false);
  const [weightValue, setWeightValue] = useState('');
  const [waterCups, setWaterCups] = useState('');
  const [waterTime, setWaterTime] = useState('');

  const [foodItem, setFoodItem] = useState('');
  const [foodTime, setFoodTime] = useState('');

  const [medName, setMedName] = useState('');
  const [medDosage, setMedDosage] = useState('');
  const [medTime, setMedTime] = useState('');

  const [message, setMessage] = useState('');

  const inputClass = "w-full bg-gray-50/50 p-3 rounded-xl outline-none focus:bg-gray-100 transition-colors font-medium text-base border-2 border-transparent focus:border-gray-200 placeholder:text-gray-300 placeholder:font-normal";
  const labelClass = "text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block";

  const showMsg = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const handleWeight = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const w = parseFloat(formData.get('weight') as string);
    if (!isNaN(w)) {
      const res = await logWeight(w);
      if (res?.success) {
        setWeightValue('');
        showMsg('Weight logged successfully!');
      }
    }
  };

  const handleScanScale = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsScanningScale(true);
    showMsg('Scanning scale image...');
    const reader = new FileReader();
    reader.onloadend = async () => {
      const base64 = reader.result as string;
      try {
        const res = await fetch('/api/vision', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ imageBase64: base64, scanType: 'scale' }),
        });
        const data = await res.json();
        if (data.success) {
          const rawText = data.result || '';
          const match = rawText.match(/(\d+(\.\d+)?)/);
          const num = match ? parseFloat(match[0]) : NaN;
          if (!isNaN(num)) {
            setWeightValue(num.toString());
            showMsg(`AI detected: ${num} kg! Click Log to save.`);
          } else {
            showMsg("AI couldn't read numbers. Try again.");
          }
        }
      } catch (err) {
        showMsg("Network error.");
      }
      setIsScanningScale(false);
    };
    reader.readAsDataURL(file);
  };

  const handleWater = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await logWater(formData);
    if (res?.success) {
      setWaterCups('');
      setWaterTime('');
      showMsg('Water logged successfully!');
    }
  };

  const handleFood = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await logFood(formData);
    if (res?.success) {
      setFoodItem('');
      setFoodTime('');
      showMsg('Food logged successfully!');
    }
  };

  const handleMed = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const res = await logMedication(formData);
    if (res?.success) {
      setMedName('');
      setMedDosage('');
      setMedTime('');
      showMsg('Medication logged successfully!');
    }
  };

  return (
    <div className="space-y-6 mt-10">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-heading font-semibold tracking-tight">Manual Logs</h2>
        {message && <span className="text-green-500 font-sans text-sm animate-pulse">{message}</span>}
      </div>

      {/* Weight Log */}
      <Card className="!p-5 border border-transparent focus-within:border-gray-200 transition-colors">
        <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center">
              <Scale size={16} strokeWidth={2.5} />
           </div>
           <h3 className="font-heading font-semibold text-lg text-gray-800">Body Weight</h3>
        </div>
        <form onSubmit={handleWeight}>
          <div>
            <label className={labelClass}>Weight (kg)</label>
            <div className="flex items-center gap-2">
              <div className="relative flex-1 border-2 border-transparent focus-within:border-gray-200 rounded-xl transition-colors bg-gray-50/50">
                <input name="weight" type="number" step="0.1" required value={weightValue} onChange={(e) => setWeightValue(e.target.value)} placeholder="0.0" className="w-full bg-transparent p-3 outline-none focus:bg-gray-100 transition-colors font-medium text-base rounded-xl" />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-sans font-medium">kg</span>
              </div>
              <input type="file" accept="image/*" ref={scaleInputRef} onChange={handleScanScale} className="hidden" />
              <input type="file" accept="image/*" capture="environment" ref={cameraInputRef} onChange={handleScanScale} className="hidden" />
              
              <button 
                type="button" 
                onClick={() => cameraInputRef.current?.click()} 
                disabled={isScanningScale} 
                className={`w-[52px] h-[52px] shrink-0 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center hover:bg-indigo-100 transition-all ${isScanningScale ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 shadow-sm'}`}
              >
                 <Camera size={20} className={isScanningScale ? "animate-pulse" : ""} strokeWidth={2.5} />
              </button>

              <button 
                type="button" 
                onClick={() => scaleInputRef.current?.click()} 
                disabled={isScanningScale} 
                className={`w-[52px] h-[52px] shrink-0 bg-white border-2 border-indigo-50 text-indigo-400 rounded-xl flex items-center justify-center hover:bg-gray-50 transition-all ${isScanningScale ? 'opacity-50 cursor-not-allowed' : 'active:scale-95 shadow-sm'}`}
              >
                 <Upload size={20} className={isScanningScale ? "animate-pulse" : ""} strokeWidth={2.5} />
              </button>
            </div>
          </div>
          <button type="submit" disabled={isScanningScale || !weightValue} className="mt-4 w-full py-3 bg-gray-100 text-gray-800 rounded-[14px] font-sans font-bold tracking-wide uppercase text-xs flex items-center justify-center gap-2 hover:bg-gray-200 transition-colors disabled:opacity-50">
            <Plus size={16} strokeWidth={2.5} /> Log Weight
          </button>
        </form>
      </Card>

      {/* Water Log */}
      <Card className="!p-5 border border-transparent focus-within:border-gray-200 transition-colors">
        <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center">
              <Droplets size={16} strokeWidth={2.5} />
           </div>
           <h3 className="font-heading font-semibold text-lg text-gray-800">Water Intake</h3>
        </div>
        <form onSubmit={handleWater}>
          <div className="grid grid-cols-2 gap-4 font-sans">
            <div>
              <label className={labelClass}>Cups</label>
              <input name="cups" type="number" min="1" required value={waterCups} onChange={(e) => setWaterCups(e.target.value)} placeholder="0" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input name="time" type="time" required value={waterTime} onChange={(e) => setWaterTime(e.target.value)} className={inputClass} />
            </div>
          </div>
          <button type="submit" className="mt-4 w-full py-3 bg-blue-50 text-blue-600 rounded-[14px] font-sans font-bold tracking-wide uppercase text-xs flex items-center justify-center gap-2 hover:bg-blue-100 transition-colors">
            <Plus size={16} strokeWidth={2.5} /> Log Water
          </button>
        </form>
      </Card>

      {/* Food Log */}
      <Card className="!p-5 border border-transparent focus-within:border-gray-200 transition-colors">
        <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center">
              <Utensils size={16} strokeWidth={2.5} />
           </div>
           <h3 className="font-heading font-semibold text-lg text-gray-800">Food / Meal</h3>
        </div>
        <form onSubmit={handleFood}>
          <div className="space-y-4 font-sans">
            <div>
              <label className={labelClass}>What did you eat?</label>
              <input name="item" type="text" required value={foodItem} onChange={(e) => setFoodItem(e.target.value)} placeholder="e.g. Chicken Salad" className={inputClass} />
            </div>
            <div>
              <label className={labelClass}>Time</label>
              <input name="time" type="time" required value={foodTime} onChange={(e) => setFoodTime(e.target.value)} className={inputClass} />
            </div>
          </div>
          <button type="submit" className="mt-4 w-full py-3 bg-orange-50 text-orange-600 rounded-[14px] font-sans font-bold tracking-wide uppercase text-xs flex items-center justify-center gap-2 hover:bg-orange-100 transition-colors">
            <Plus size={16} strokeWidth={2.5} /> Log Food
          </button>
        </form>
      </Card>

      {/* Medicine Log */}
      <Card className="!p-5 border border-transparent focus-within:border-gray-200 transition-colors">
        <div className="flex items-center gap-2 mb-4">
           <div className="w-8 h-8 rounded-full bg-green-50 text-green-500 flex items-center justify-center">
              <Pill size={16} strokeWidth={2.5} />
           </div>
           <h3 className="font-heading font-semibold text-lg text-gray-800">Medication</h3>
        </div>
        <form onSubmit={handleMed}>
          <div className="space-y-4 font-sans">
            <div>
              <label className={labelClass}>Medicine Name</label>
              <input name="name" type="text" required value={medName} onChange={(e) => setMedName(e.target.value)} placeholder="e.g. Vitamin D3" className={inputClass} />
            </div>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelClass}>Dosage</label>
                <div className="relative border-2 border-transparent focus-within:border-gray-200 rounded-xl transition-colors bg-gray-50/50">
                  <input name="dosage" type="number" min="0" required value={medDosage} onChange={(e) => setMedDosage(e.target.value)} placeholder="0" className="w-full bg-transparent p-3 outline-none focus:bg-gray-100 transition-colors font-medium text-base rounded-xl" />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm font-sans font-medium">mg</span>
                </div>
              </div>
              <div>
                <label className={labelClass}>Time taken</label>
                <input name="time" type="time" required value={medTime} onChange={(e) => setMedTime(e.target.value)} className={inputClass} />
              </div>
            </div>
          </div>
          <button type="submit" className="mt-4 w-full py-3 bg-green-50 text-green-600 rounded-[14px] font-sans font-bold tracking-wide uppercase text-xs flex items-center justify-center gap-2 hover:bg-green-100 transition-colors">
            <Plus size={16} strokeWidth={2.5} /> Log Medicine
          </button>
        </form>
      </Card>

    </div>
  );
}
