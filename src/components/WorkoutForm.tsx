'use client';

import { useState } from 'react';
import { Card } from './ui/Card';
import { Plus, Trash2, Copy } from 'lucide-react';
import { logWorkout } from '@/actions/workout';

type Exercise = { id: number; name: string; weight: string; sets: string; reps: string };

export function WorkoutForm() {
  const [exercises, setExercises] = useState<Exercise[]>([
    { id: Date.now(), name: '', weight: '', sets: '', reps: '' }
  ]);
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState('');

  const showMsg = (msg: string) => {
    setMessage(msg);
    setTimeout(() => setMessage(''), 3000);
  };

  const addExercise = () => setExercises([...exercises, { id: Date.now(), name: '', weight: '', sets: '', reps: '' }]);
  
  const removeExercise = (id: number) => {
    if (exercises.length > 1) {
      setExercises(exercises.filter(e => e.id !== id));
    }
  };

  const updateExercise = (id: number, field: keyof Exercise, value: string) => {
    setExercises(exercises.map(e => e.id === id ? { ...e, [field]: value } : e));
  };

  const handleSave = async () => {
    setIsLoading(true);
    // Filter out completely empty rows
    const validExercises = exercises.filter(e => e.name.trim() !== '' || e.weight !== '' || e.reps !== '');
    
    if (validExercises.length === 0) {
      showMsg('Please fill out at least one exercise.');
      setIsLoading(false);
      return;
    }

    const res = await logWorkout(validExercises);
    if (res?.success) {
      showMsg('Workout saved successfully!');
      setExercises([{ id: Date.now(), name: '', weight: '', sets: '', reps: '' }]);
    } else {
      showMsg(res?.error || 'Failed to save.');
    }
    setIsLoading(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center mb-2">
        <h2 className="text-2xl font-heading font-semibold tracking-tight">Log Workout</h2>
        <div className="flex items-center gap-2">
          {message && <span className="text-green-500 font-sans text-xs font-semibold animate-pulse">{message}</span>}
          <button className="text-xs bg-gray-100 text-gray-700 px-3 py-1.5 rounded-full font-sans font-semibold tracking-wide uppercase hover:bg-gray-200 transition-colors flex items-center gap-1.5">
            <Copy size={12} strokeWidth={2.5} /> Copy Last
          </button>
        </div>
      </div>

      {exercises.map((exercise, index) => (
        <Card key={exercise.id} className="relative !p-5 border border-transparent focus-within:border-gray-200 transition-colors">
          <div className="flex justify-between items-center mb-4">
            <span className="text-xs font-sans font-bold text-gray-400 tracking-widest uppercase">Exercise {index + 1}</span>
            {exercises.length > 1 && (
              <button onClick={() => removeExercise(exercise.id)} className="text-gray-400 hover:text-red-500 transition-colors p-1">
                <Trash2 size={16} />
              </button>
            )}
          </div>
          
          <div className="space-y-4 font-sans">
            <div>
              <input 
                type="text" 
                placeholder="Exercise Name (e.g. Bench Press)" 
                className="w-full text-lg font-semibold bg-transparent border-b border-gray-100 pb-2 outline-none focus:border-black transition-colors placeholder:text-gray-300 placeholder:font-normal"
                value={exercise.name}
                onChange={(e) => updateExercise(exercise.id, 'name', e.target.value)}
              />
            </div>
            <div className="grid grid-cols-3 gap-4">
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block">Weight</label>
                <div className="relative">
                  <input type="number" className="w-full bg-gray-50/50 p-3 rounded-xl outline-none focus:bg-gray-100 transition-colors font-medium text-lg" placeholder="0" value={exercise.weight} onChange={(e) => updateExercise(exercise.id, 'weight', e.target.value)} />
                  <span className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 text-sm">kg</span>
                </div>
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block">Sets</label>
                <input type="number" className="w-full bg-gray-50/50 p-3 rounded-xl outline-none focus:bg-gray-100 transition-colors font-medium text-lg" placeholder="0" value={exercise.sets} onChange={(e) => updateExercise(exercise.id, 'sets', e.target.value)} />
              </div>
              <div>
                <label className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-1 block">Reps</label>
                <input type="number" className="w-full bg-gray-50/50 p-3 rounded-xl outline-none focus:bg-gray-100 transition-colors font-medium text-lg" placeholder="0" value={exercise.reps} onChange={(e) => updateExercise(exercise.id, 'reps', e.target.value)} />
              </div>
            </div>
          </div>
        </Card>
      ))}

      <button onClick={addExercise} className="w-full py-4 border-2 border-dashed border-gray-200 rounded-[24px] text-gray-400 font-semibold font-sans tracking-wide uppercase hover:border-gray-300 hover:text-gray-500 transition-colors flex items-center justify-center gap-2">
        <Plus size={18} strokeWidth={2.5} /> Add Exercise
      </button>

      <div className="pt-4 pb-20">
        <button 
          onClick={handleSave} 
          disabled={isLoading}
          className="w-full py-4 bg-foreground text-background rounded-[20px] font-semibold tracking-widest uppercase hover:bg-gray-800 transition-colors hover:-translate-y-0.5 active:translate-y-0 shadow-lg text-sm disabled:opacity-50"
        >
          {isLoading ? 'Saving...' : 'Save Workout'}
        </button>
      </div>
    </div>
  );
}
