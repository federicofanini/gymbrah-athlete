import { getBusinessNameById } from "@/actions/business/get-business-name-by-id";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Dumbbell, PlayCircle } from "lucide-react";
import Link from "next/link";
import { Suspense } from "react";

interface Exercise {
  id: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  round?: string;
  exercise: {
    id: string;
    name: string;
    body_part: string;
    equipment: string;
    target: string;
    gif_url: string;
    secondary_muscles: string[];
    instructions: string[];
  };
}

interface Workout {
  id: string;
  name: string;
  created_at: string;
  exercises: Exercise[];
  business_id?: string;
  assigned_at?: string;
}

interface WorkoutFromBusinessProps {
  workouts: Workout[];
  businessName: string;
}

async function BusinessNameHeader({ businessId }: { businessId: string }) {
  const response = await getBusinessNameById({
    businessId,
  });
  return (
    <h2 className="text-lg md:text-xl lg:text-2xl font-semibold mb-2 md:mb-4">
      Workouts from {response?.data?.data}
    </h2>
  );
}

export async function WorkoutFromBusiness({
  workouts,
  businessName,
}: WorkoutFromBusinessProps) {
  if (!workouts.length) {
    return (
      <Card className="w-full">
        <CardContent className="p-3 md:p-4 lg:p-6 text-center">
          <Dumbbell className="mx-auto h-6 w-6 md:h-8 md:w-8 lg:h-12 lg:w-12 text-muted-foreground/50" />
          <p className="mt-2 md:mt-3 lg:mt-4 text-sm md:text-base lg:text-lg font-medium">
            No workouts found
          </p>
          <p className="text-xs md:text-sm text-muted-foreground">
            You don&apos;t have any workouts assigned yet.
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <div className="w-full">
      <Suspense
        fallback={
          <div className="space-y-2 md:space-y-4">
            <Skeleton className="h-5 md:h-6 lg:h-8 w-32 md:w-48 lg:w-64" />
          </div>
        }
      >
        <BusinessNameHeader businessId={workouts[0]?.business_id || ""} />
      </Suspense>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6 max-w-[calc(100vw-2rem)] sm:max-w-none">
        {workouts.map((workout) => (
          <Card key={workout.id} className="min-h-[280px] md:min-h-[320px]">
            <CardHeader className="p-3 md:p-4 lg:p-6">
              <h3 className="text-sm md:text-base lg:text-lg font-semibold">
                {workout.name}
              </h3>
              <p className="text-[10px] md:text-xs lg:text-sm text-muted-foreground">
                Assigned:{" "}
                {new Date(
                  workout.assigned_at || workout.created_at
                ).toLocaleDateString("en-US", {
                  month: "short",
                  day: "numeric",
                  year: "numeric",
                })}
              </p>
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-6">
              <div className="space-y-1.5 md:space-y-2">
                <p className="text-[10px] md:text-xs lg:text-sm font-medium">
                  {workout.exercises.length} Exercises
                </p>
                <ul className="text-[10px] md:text-xs lg:text-sm text-muted-foreground space-y-1.5 md:space-y-2">
                  {workout.exercises.slice(0, 3).map((exercise) => (
                    <li
                      key={exercise.id}
                      className="flex items-center justify-between"
                    >
                      <span className="flex items-center gap-1.5 md:gap-2">
                        <img
                          src={exercise.exercise.gif_url}
                          alt={exercise.exercise.name}
                          className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full"
                        />
                        <span className="line-clamp-1">
                          {exercise.exercise.name}
                        </span>
                      </span>
                      <span className="text-[8px] md:text-[10px] lg:text-xs ml-1 md:ml-2 flex-shrink-0">
                        {exercise.sets && `${exercise.sets} sets`}
                        {exercise.reps && ` × ${exercise.reps} reps`}
                        {exercise.duration && ` - ${exercise.duration}s`}
                      </span>
                    </li>
                  ))}
                  {workout.exercises.length > 3 && (
                    <li className="text-[10px] md:text-xs lg:text-sm">
                      +{workout.exercises.length - 3} more
                    </li>
                  )}
                </ul>
              </div>
            </CardContent>
            <CardFooter className="p-3 md:p-4 lg:p-6">
              <Button
                asChild
                className="w-full text-xs md:text-sm lg:text-base py-1.5 md:py-2"
              >
                <Link
                  href={`/athlete/${workout.id}`}
                  className="flex items-center justify-center"
                >
                  <PlayCircle className="w-3 h-3 md:w-4 md:h-4 mr-1.5 md:mr-2" />
                  Start Workout
                </Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
