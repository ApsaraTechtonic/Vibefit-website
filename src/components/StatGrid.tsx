import { Card } from './ui/Card';

export function StatGrid({ calories, volume, score, aiSummary }: { calories: number, volume: number, score: number, aiSummary: string }) {
  return (
    <div className="grid grid-cols-2 gap-4">
      {/* AI Score (Spans full width) */}
      <Card className="col-span-2 flex items-center justify-between bg-gradient-to-br from-[#FDFBF7] to-[#F2EFE8] border border-[#EAE5DA]">
        <div className="pr-4">
          <h3 className="text-sm font-sans text-gray-800 font-semibold tracking-wide uppercase">Vibe Score</h3>
          <p className="text-xs text-gray-500 mt-2 leading-relaxed">{aiSummary}</p>
        </div>
        <div className="relative h-[72px] w-[72px] flex-shrink-0 flex items-center justify-center">
          <svg className="w-full h-full transform -rotate-90 drop-shadow-sm" viewBox="0 0 36 36">
            <path
              className="text-white/80"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
            />
            <path
              className="text-foreground transition-all duration-1000 ease-out"
              d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
              fill="none"
              stroke="currentColor"
              strokeWidth="3.5"
              strokeDasharray={`${score}, 100`}
              strokeLinecap="round"
            />
          </svg>
          <span className="absolute text-xl font-heading font-bold">{score}</span>
        </div>
      </Card>
      
      {/* Calories */}
      <Card className="flex flex-col justify-center">
        <span className="text-xs text-gray-500 font-semibold font-sans uppercase tracking-wider">Calories Left</span>
        <span className="text-3xl font-heading mt-2 tracking-tight">{calories}</span>
      </Card>

      {/* Gym Volume */}
      <Card className="flex flex-col justify-center">
        <span className="text-xs text-gray-500 font-semibold font-sans uppercase tracking-wider">Gym Volume</span>
        <span className="text-3xl font-heading mt-2 tracking-tight">{volume} <span className="text-base font-sans font-normal text-gray-400">kg</span></span>
      </Card>
    </div>
  );
}
