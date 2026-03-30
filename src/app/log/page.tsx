import { WorkoutForm } from "@/components/WorkoutForm";
import { LensButton } from "@/components/LensButton";
import { DailyLogsForm } from "@/components/DailyLogsForm";

export default function LogPage() {
  return (
    <div className="min-h-screen p-6 pb-32 max-w-md mx-auto fade-in">
      <LensButton />
      <WorkoutForm />
      <DailyLogsForm />
    </div>
  );
}
