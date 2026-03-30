import { Card } from "@/components/ui/Card";
import { getDailyInsight } from "@/actions/ai";

export default async function AnalyticsPage() {
  const weeklyScores = [
    { day: 'M', score: 75 },
    { day: 'T', score: 82 },
    { day: 'W', score: 68 },
    { day: 'T', score: 90 },
    { day: 'F', score: 85 },
    { day: 'S', score: 88 },
    { day: 'S', score: 85 },
  ];

  const insightData = await getDailyInsight();
  const dailyInsight = insightData.insight || insightData.error || "Insight unavailable.";

  return (
    <div className="min-h-screen p-6 pb-32 max-w-md mx-auto fade-in">
      <h1 className="text-3xl font-heading font-semibold text-foreground mb-6 mt-4">Analytics</h1>
      
      <div className="space-y-6">
        {/* Weekly Vibe Score */}
        <Card className="!p-6 border border-transparent focus-within:border-gray-200 transition-colors">
          <h3 className="font-heading font-semibold text-lg text-gray-800 mb-6 tracking-tight">Weekly Vibe Score</h3>
          <div className="flex items-end justify-between h-40 gap-3">
             {weeklyScores.map((item, i) => (
                <div key={i} className="flex flex-col items-center flex-1 gap-3">
                   <div className="w-full bg-gray-50 rounded-lg relative flex items-end justify-center overflow-hidden h-[120px]">
                      <div 
                        className="w-full bg-foreground rounded-t-sm transition-all duration-1000 ease-out" 
                        style={{ height: `${item.score}%` }}
                      ></div>
                   </div>
                   <span className="text-xs font-sans font-bold text-gray-400 uppercase">{item.day}</span>
                </div>
             ))}
          </div>
        </Card>

        {/* Weight Trend Summary */}
        <div className="grid grid-cols-2 gap-4">
           <Card className="!p-5 flex flex-col justify-center border border-gray-50">
             <span className="text-xs text-gray-500 font-semibold font-sans uppercase tracking-wider">Avg Weight</span>
             <span className="text-3xl font-heading mt-2 tracking-tight">72.9 <span className="text-base font-sans font-normal text-gray-400">kg</span></span>
             <span className="text-xs text-green-500 font-sans font-medium mt-2">↓ 0.6 kg this week</span>
           </Card>
           
           <Card className="!p-5 flex flex-col justify-center border border-gray-50">
             <span className="text-xs text-gray-500 font-semibold font-sans uppercase tracking-wider">Avg Score</span>
             <span className="text-3xl font-heading mt-2 tracking-tight">81.8</span>
             <span className="text-xs text-green-500 font-sans font-medium mt-2">↑ 5 pts this week</span>
           </Card>
        </div>

        {/* AI Insight */}
        <Card className="!p-6 bg-gradient-to-br from-[#FDFBF7] to-[#F2EFE8] border border-[#EAE5DA]">
           <h3 className="font-heading font-semibold text-lg text-gray-800 mb-2">AI Daily Insight</h3>
           <p className="font-sans text-sm text-gray-600 leading-relaxed min-h-[80px]">
             {dailyInsight}
           </p>
        </Card>
      </div>
    </div>
  );
}

