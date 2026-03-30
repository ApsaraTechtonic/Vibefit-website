
import { Droplets, Pill, Utensils, Dumbbell, Scale } from "lucide-react";
import { Greeting } from "@/components/Greeting";
import { getSession } from "@/lib/session";
import clientPromise from "@/lib/mongodb";
import { redirect } from "next/navigation";
import { ObjectId } from "mongodb";
import AITracker from '@/components/AITracker';

export default async function Home() {
  const session = await getSession();
  if (!session) redirect('/auth');

  const client = await clientPromise;
  const db = client.db('vibefit');

  // Today's logs
  const startOfDay = new Date();
  startOfDay.setHours(0, 0, 0, 0);

  const logs = await db.collection('logs').find({
    userId: session.userId,
    createdAt: { $gte: startOfDay }
  }).toArray();

  const user = await db.collection('users').findOne({ _id: new ObjectId(session.userId) });
  const firstName = user?.name ? user.name.split(' ')[0] : 'Creator';

  const latestWeightLog = await db.collection('logs').findOne(
    { userId: session.userId, type: 'weight' },
    { sort: { createdAt: -1 } }
  );
  const currentWeight = latestWeightLog ? latestWeightLog.weight : null;
  const weightText = currentWeight ? `${currentWeight}` : '---';

  let waterCups = 0;
  let workouts = 0;
  let meals = 0;
  let medsCount = 0;
  let gymVolume = 0;
  let totalCalories = 0;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logs.forEach((log: any) => {
    if (log.type === 'water') waterCups += Number(log.cups) || 0;
    if (log.type === 'food') {
      meals += 1;
      totalCalories += Number(log.calories) || 0;
    }
    if (log.type === 'medication') medsCount += 1;
    if (log.type === 'workout') {
      workouts += 1;
      log.exercises?.forEach((ex: { weight?: number; sets?: number; reps?: number }) => {
        const w = Number(ex.weight) || 0;
        const s = Number(ex.sets) || 0;
        const r = Number(ex.reps) || 0;
        gymVolume += (w * s * r);
      });
    }
  });

  return (
    <div className="min-h-screen p-6 pb-24 max-w-md mx-auto fade-in">
      <header className="mb-8 mt-4">
        <Greeting username={firstName} />
        <p className="text-gray-500 mt-2 font-sans tracking-wide">Here is your daywise summary for today.</p>
      </header>

      <section className="space-y-4">

        {/* Weight */}
        <div className="bg-card p-5 rounded-[24px] shadow-sm flex items-start gap-4 border border-gray-50 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-gray-100 text-gray-700 flex items-center justify-center shrink-0">
            <Scale size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="font-heading font-semibold text-lg text-gray-800">Current Weight</h4>
            <p className="font-sans text-sm text-gray-500 mt-0.5 max-w-[140px] truncate">{currentWeight ? 'Latest recorded' : 'Not logged yet'}</p>
          </div>
          <div className="font-heading font-bold text-2xl text-gray-800">{weightText}<span className="text-sm text-gray-400 font-sans ml-1 font-medium">kg</span></div>
        </div>

        {/* Food */}
        <div className="bg-card p-5 rounded-[24px] shadow-sm flex items-start gap-4 border border-gray-50 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-orange-50 text-orange-500 flex items-center justify-center shrink-0">
            <Utensils size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="font-heading font-semibold text-lg text-gray-800">Diet & Meals</h4>
            <p className="font-sans text-sm text-gray-400 mt-1 italic">{meals === 0 ? 'No meals logged yet.' : `${meals} meals tracked`}</p>
          </div>
          <div className="flex flex-col items-end">
            <div className="font-heading font-bold text-2xl text-orange-400">
              {meals}<span className="text-sm font-sans ml-1 font-medium text-gray-400">meals</span>
            </div>
            {totalCalories > 0 && (
              <div className="text-[10px] font-sans font-bold text-orange-300 uppercase tracking-tighter">
                ~{totalCalories} kcal
              </div>
            )}
          </div>
        </div>

        {/* Exercises */}
        <div className="bg-card p-5 rounded-[24px] shadow-sm flex items-start gap-4 border border-gray-50 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-purple-50 text-purple-500 flex items-center justify-center shrink-0">
            <Dumbbell size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="font-heading font-semibold text-lg text-gray-800">Gym Activity</h4>
            <p className="font-sans text-sm text-gray-400 mt-1 pb-1">{workouts === 0 ? 'No exercises logged.' : `Total Volume: ${gymVolume}kg`}</p>
          </div>
          <div className="font-heading font-bold text-2xl text-purple-400">
            {workouts}<span className="text-sm font-sans ml-1 font-medium text-gray-400">workouts</span>
          </div>
        </div>

        {/* Water */}
        <div className="bg-card p-5 rounded-[24px] shadow-sm flex items-start gap-4 border border-gray-50 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
            <Droplets size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="font-heading font-semibold text-lg text-gray-800">Hydration</h4>
            <p className="font-sans text-sm text-gray-400 mt-1">{waterCups === 0 ? 'Not logged today' : 'Staying hydrated!'}</p>
          </div>
          <div className="font-heading font-bold text-2xl text-blue-400">
            {waterCups}<span className="text-sm font-sans ml-1 font-medium text-gray-400">cups</span>
          </div>
        </div>

        {/* Medicines */}
        <div className="bg-card p-5 rounded-[24px] shadow-sm flex items-start gap-4 border border-gray-50 transition-all hover:shadow-md">
          <div className="w-12 h-12 rounded-full bg-green-50 text-green-500 flex items-center justify-center shrink-0">
            <Pill size={20} strokeWidth={2.5} />
          </div>
          <div className="flex-1">
            <h4 className="font-heading font-semibold text-lg text-gray-800">Medications</h4>
            <p className="font-sans text-sm text-gray-400 mt-1">{medsCount === 0 ? 'None taken' : `${medsCount} recorded`}</p>
          </div>
          <div className="font-heading font-bold text-2xl text-green-400">
            {medsCount}
          </div>
        </div>

        {/* Live AI Tracker */}
        <div className="mt-8">
          <AITracker />
        </div>
      </section>
    </div>
  );
}
