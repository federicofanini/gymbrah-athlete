import { Suspense } from "react";
import { WorkoutFromBusiness } from "@/components/private/b2c/athlete/workout-from-business";
import { WorkoutFromAthlete } from "@/components/private/b2c/athlete/workout-from-athlete";
import { getWorkoutsFromBusiness } from "@/actions/workout/athlete/workouts-from-business";
import { getWorkoutsFromAthlete } from "@/actions/workout/athlete/workouts-from-athlete";
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
} from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { getUserGamificationData } from "@/actions/achievements/get-user-data";
import { getUserMetadata } from "@/utils/supabase/database/cached-queries";
import { Loader2 } from "lucide-react";

async function BlackboardWrapper() {
  const [workoutsFromBusinessResponse, workoutsFromAthleteResponse] =
    await Promise.all([getWorkoutsFromBusiness(), getWorkoutsFromAthlete()]);

  const workoutsFromBusiness = workoutsFromBusinessResponse?.data?.success
    ? workoutsFromBusinessResponse.data.data
    : [];

  const workoutsFromAthlete = workoutsFromAthleteResponse?.data?.success
    ? workoutsFromAthleteResponse.data.data
    : [];

  return (
    <div className="w-full p-4 space-y-6 mb-4 sm:p-6 sm:space-y-8 sm:mb-6 md:px-8 md:py-6 md:space-y-10 lg:space-y-14 lg:mb-10">
      {workoutsFromAthlete.length > 0 && (
        <WorkoutFromAthlete
          workouts={workoutsFromAthlete}
          businessName="My Workouts"
        />
      )}
      {workoutsFromBusiness.length > 0 && (
        <WorkoutFromBusiness
          workouts={workoutsFromBusiness}
          businessName="Business Name"
        />
      )}
    </div>
  );
}

function LoadingSkeleton() {
  return (
    <div className="w-full p-4 space-y-6 mb-4 sm:p-6 sm:space-y-8 sm:mb-6 md:px-8 md:py-6 md:space-y-10 lg:space-y-14 lg:mb-10">
      <div className="space-y-2 md:space-y-4">
        <Skeleton className="h-5 md:h-6 lg:h-8 w-32 md:w-48 lg:w-64" />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 md:gap-6">
        {[...Array(3)].map((_, i) => (
          <Card key={i} className="min-h-[280px] md:min-h-[320px]">
            <CardHeader className="p-3 md:p-4 lg:p-6">
              <Skeleton className="h-4 md:h-5 lg:h-6 w-32 md:w-40 lg:w-48" />
              <Skeleton className="h-3 md:h-4 lg:h-5 w-24 md:w-28 lg:w-32 mt-1" />
            </CardHeader>
            <CardContent className="p-3 md:p-4 lg:p-6">
              <div className="space-y-1.5 md:space-y-2">
                <Skeleton className="h-3 md:h-4 lg:h-5 w-20 md:w-24 lg:w-28" />
                <div className="space-y-2 md:space-y-3">
                  {[...Array(3)].map((_, j) => (
                    <div key={j} className="flex items-center gap-2">
                      <Skeleton className="w-6 h-6 md:w-8 md:h-8 lg:w-10 lg:h-10 rounded-full" />
                      <Skeleton className="h-3 md:h-4 lg:h-5 w-full" />
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
            <CardFooter className="p-3 md:p-4 lg:p-6">
              <Skeleton className="h-8 md:h-9 lg:h-10 w-full" />
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default async function Blackboard() {
  const data = await getUserGamificationData();
  const profile = await getUserMetadata();

  if (!profile) {
    return (
      <div className="flex items-center justify-center min-h-[100dvh]">
        <Loader2 className="size-4 animate-spin sm:size-5 md:size-6" />
      </div>
    );
  }

  return (
    <Suspense fallback={<LoadingSkeleton />}>
      {/* <AchievementsPage data={data} profile={profile} />*/}
      <BlackboardWrapper />
    </Suspense>
  );
}
