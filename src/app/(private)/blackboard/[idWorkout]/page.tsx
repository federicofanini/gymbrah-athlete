import { Card } from "@/components/ui/card";
import { getCachedWorkoutsByDay } from "@/actions/workout/cached-workout";
import { WorkoutClient } from "@/components/blackboard/workout-page/workout-client";

interface Exercise {
  id: string;
  name: string;
  sets: number;
  reps: number;
  weight: number | null;
  duration: number | null;
  category: string;
  muscles: string[];
  outcomes: string[];
  exercise_id: string;
  workout_id: string;
}

interface Workout {
  id: string;
  name: string;
  selected: boolean;
  created_at: Date;
  exercises: Exercise[];
}

// Define the type for the dynamic route params
type PageParams = { idWorkout: string } & Promise<any>;

export default async function WorkoutPage({ params }: { params: PageParams }) {
  const workoutsResponse = await getCachedWorkoutsByDay();

  if (!workoutsResponse.success || !workoutsResponse.data) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Error loading workout</h1>
            <p className="text-muted-foreground">Please try again later</p>
          </div>
        </Card>
      </div>
    );
  }

  const workoutsByDay = workoutsResponse.data;

  // Find workout by ID from workoutsByDay
  const workout = Object.values(workoutsByDay).find(
    (w) => w !== null && (w as Workout)?.id === params.idWorkout
  ) as Workout | undefined;

  if (!workout) {
    return (
      <div className="container max-w-2xl mx-auto p-4">
        <Card className="p-6">
          <div className="text-center">
            <h1 className="text-xl font-semibold">Workout not found</h1>
            <p className="text-muted-foreground">
              The requested workout could not be found
            </p>
          </div>
        </Card>
      </div>
    );
  }

  return <WorkoutClient workout={workout} />;
}
