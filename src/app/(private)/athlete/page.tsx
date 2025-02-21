import { Suspense } from "react";
import { WorkoutFromBusiness } from "@/components/private/b2c/athlete/workout-from-business";
import { WorkoutFromAthlete } from "@/components/private/b2c/athlete/workout-from-athlete";
import { getWorkoutsFromBusiness } from "@/actions/workout/athlete/workouts-from-business";
import { getWorkoutsFromAthlete } from "@/actions/workout/athlete/workouts-from-athlete";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
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
    <div className="w-full p-4 space-y-4 sm:p-6 sm:space-y-5 md:px-8 md:py-6 md:space-y-6">
      <Card>
        <CardHeader>
          <Skeleton className="h-4 w-20 sm:h-4 sm:w-24 md:h-5 md:w-32" />
        </CardHeader>
        <CardContent>
          <div className="flex gap-3 overflow-x-auto pb-2 snap-x snap-mandatory sm:gap-4 md:pb-3">
            {[...Array(3)].map((_, i) => (
              <Skeleton
                key={i}
                className="h-32 w-[calc(100vw-2.5rem)] flex-shrink-0 snap-center sm:h-36 sm:w-[280px] md:h-40 lg:h-48"
              />
            ))}
          </div>
        </CardContent>
      </Card>
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
