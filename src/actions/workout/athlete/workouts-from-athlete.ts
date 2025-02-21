"use server";

import { createSafeActionClient } from "next-safe-action";
import type { ActionResponse } from "@/actions/types/action-response";
import { prisma } from "@/lib/db";
import { appErrors } from "@/actions/types/errors";
import { createClient } from "@/utils/supabase/server";

export const getWorkoutsFromAthlete = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
        error: authError,
      } = await supabase.auth.getUser();

      if (authError || !user) {
        return {
          success: false,
          error: appErrors.UNAUTHORIZED,
        };
      }

      const athlete = await prisma.athlete.findFirst({
        where: {
          user_id: user.id,
        },
        select: {
          id: true,
        },
      });

      if (!athlete) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      // Get all self-assigned workouts for this athlete
      const workouts = await prisma.workout_athlete.findMany({
        where: {
          athlete_id: athlete.id,
          business_id: "self assigned", // Only get self assigned workouts
        },
        select: {
          workout_id: true,
          created_at: true,
        },
      });

      // Get full workout details including exercises for each workout
      const workoutDetails = await prisma.workout.findMany({
        where: {
          id: {
            in: workouts.map((w) => w.workout_id),
          },
        },
        select: {
          id: true,
          name: true,
          created_at: true,
          exercises: {
            select: {
              id: true,
              sets: true,
              reps: true,
              weight: true,
              duration: true,
              round: true,
              exercise: {
                select: {
                  id: true,
                  name: true,
                  body_part: true,
                  equipment: true,
                  target: true,
                  gif_url: true,
                  secondary_muscles: true,
                  instructions: true,
                },
              },
            },
          },
        },
      });

      return {
        success: true,
        data: workoutDetails.map((workout) => ({
          ...workout,
          business_id: "self assigned",
          assigned_at: workouts.find((w) => w.workout_id === workout.id)
            ?.created_at,
        })),
      };
    } catch (error) {
      console.error("Error fetching workouts:", error);
      return {
        success: false,
        error: appErrors.UNEXPECTED_ERROR,
      };
    }
  }
);
