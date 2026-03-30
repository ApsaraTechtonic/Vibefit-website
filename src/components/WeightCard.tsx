import { Card } from './ui/Card';
import { Camera } from 'lucide-react';

export function WeightCard({ currentWeight }: { currentWeight: string }) {
  return (
    <Card className="flex items-center justify-between">
      <div>
        <p className="text-sm text-gray-500 font-sans font-medium uppercase tracking-wider">Current Weight</p>
        <p className="text-5xl font-heading mt-2 tracking-tight">{currentWeight} <span className="text-xl text-gray-400 font-sans font-medium">kg</span></p>
      </div>
      <button className="h-16 w-16 bg-foreground text-background rounded-full flex items-center justify-center shadow-lg hover:scale-105 active:scale-95 transition-all">
        <Camera size={26} strokeWidth={2.5} />
      </button>
    </Card>
  );
}
