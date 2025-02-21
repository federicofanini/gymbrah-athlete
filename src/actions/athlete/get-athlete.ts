"use server";

import { createSafeActionClient } from "next-safe-action";
import type { ActionResponse } from "../types/action-response";
import { prisma } from "@/lib/db";
import { createClient } from "@/utils/supabase/server";
import { appErrors } from "../types/errors";

export interface AthleteFormData {
  name: string;
  surname: string;
  birth_date: string;
  gender: string;
  phone: string;
}

export const getAthlete = createSafeActionClient().action(
  async (): Promise<ActionResponse> => {
    try {
      const supabase = await createClient();
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) {
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
          name: true,
          surname: true,
          birth_date: true,
          gender: true,
          phone: true,
        },
      });

      if (!athlete) {
        return {
          success: false,
          error: appErrors.NOT_FOUND,
        };
      }

      return {
        success: true,
        data: {
          ...athlete,
          birth_date: athlete.birth_date.toISOString().split("T")[0],
        },
      };
    } catch (error) {
      return {
        success: false,
        error: appErrors.DATABASE_ERROR,
      };
    }
  }
);
