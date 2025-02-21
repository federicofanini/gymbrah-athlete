"use client";

import { useState } from "react";
import { createWorkout } from "@/actions/workout/create-workout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";
import { useQueryState } from "nuqs";
import { useRouter } from "next/navigation";
import { ExerciseTable } from "./exercise-table";
import { getAthleteId } from "@/actions/athlete/athlete-id";
import { assignWorkout } from "@/actions/workout/assign-workout";

interface Exercise {
  id: string;
  name: string;
  body_part: string;
  equipment: string;
  target: string;
  gif_url: string;
  secondary_muscles: string[];
  instructions: string[];
}

interface WorkoutExercise {
  exerciseId: string;
  sets?: number;
  reps?: number;
  weight?: number;
  duration?: number;
  round?: string;
  exercise?: Exercise;
}

interface WorkoutBuilderProps {
  exercises: {
    exercises: Exercise[];
    pagination: {
      total: number;
      pages: number;
      currentPage: number;
      limit: number;
    };
  };
  initialExercises: Exercise[];
}

export function WorkoutBuilder({
  exercises,
  initialExercises,
}: WorkoutBuilderProps) {
  const router = useRouter();
  const [name, setName] = useState("");
  const [selectedExercises, setSelectedExercises] = useState<WorkoutExercise[]>(
    []
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const [searchQuery, setSearchQuery] = useQueryState("search", {
    defaultValue: "",
    parse: (value) => value || "",
  });

  const [bodyPart, setBodyPart] = useQueryState("bodyPart", {
    defaultValue: "all",
    parse: (value) => value || "all",
  });

  const [page, setPage] = useQueryState("page", {
    defaultValue: "1",
    parse: (value) => {
      const parsed = parseInt(value || "1");
      return isNaN(parsed) ? "1" : parsed.toString();
    },
  });

  const handleSelectExercise = (exercise: Exercise) => {
    // Only add the exercise to the selected list if it's not already there
    if (!selectedExercises.some((e) => e.exerciseId === exercise.id)) {
      setSelectedExercises([
        ...selectedExercises,
        {
          exerciseId: exercise.id,
          exercise: exercise,
        },
      ]);
    } else {
      toast.info("Exercise already added to workout");
    }
  };

  const updateSelectedExercise = (
    index: number,
    field: keyof WorkoutExercise,
    value: string | number
  ) => {
    const updatedExercises = [...selectedExercises];
    updatedExercises[index] = {
      ...updatedExercises[index],
      [field]: field === "exerciseId" ? value : Number(value),
    };
    setSelectedExercises(updatedExercises);
  };

  const removeSelectedExercise = (index: number) => {
    setSelectedExercises(selectedExercises.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!name) {
      toast.error("Please enter a workout name");
      return;
    }

    if (selectedExercises.length === 0) {
      toast.error("Please add at least one exercise");
      return;
    }

    // Validate that all selected exercises have required fields
    const hasInvalidExercises = selectedExercises.some(
      (exercise) => !exercise.sets || !exercise.reps
    );

    if (hasInvalidExercises) {
      toast.error("Please fill in sets and reps for all exercises");
      return;
    }

    setIsSubmitting(true);

    try {
      const athleteIdResult = await getAthleteId();

      if (!athleteIdResult?.data?.success) {
        toast.error("Failed to get athlete ID");
        return;
      }

      const result = await createWorkout({
        name,
        exercises: selectedExercises,
      });

      if (result?.data?.success) {
        // Assign the workout to self
        const assignResult = await assignWorkout({
          workoutId: result.data.data.id,
          athleteId: athleteIdResult.data.data,
          businessId: "self assigned",
        });

        if (!assignResult?.data?.success) {
          toast.error("Workout created but failed to self-assign");
          return;
        }

        toast.success("Workout created and assigned successfully");
        setName("");
        setSelectedExercises([]);
        router.refresh();
      } else {
        toast.error("Failed to create workout");
      }
    } catch (error) {
      toast.error("An unexpected error occurred");
    } finally {
      setIsSubmitting(false);
    }
  };

  const displayedExercises =
    bodyPart === "all" ? initialExercises : exercises?.exercises || [];

  const filteredExercises =
    displayedExercises?.filter((exercise) => {
      if (!exercise) return false;

      const matchesSearch =
        !searchQuery ||
        exercise.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.target.toLowerCase().includes(searchQuery.toLowerCase()) ||
        exercise.body_part.toLowerCase().includes(searchQuery.toLowerCase());

      return matchesSearch;
    }) || [];

  return (
    <div className="space-y-8">
      <Card className="w-full">
        <CardHeader>
          <CardTitle>Create New Workout</CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="name">Workout Name</Label>
              <Input
                id="name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                required
              />
            </div>

            {selectedExercises.length > 0 && (
              <div className="space-y-4">
                <Label>Selected Exercises</Label>
                {selectedExercises.map((selectedExercise, index) => (
                  <div key={index} className="flex gap-2 items-end">
                    <div className="flex-1 space-y-2">
                      <div className="font-medium">
                        {selectedExercise.exercise?.name}
                      </div>
                      <div className="grid grid-cols-4 gap-2">
                        <Input
                          type="number"
                          placeholder="Sets"
                          value={selectedExercise.sets || ""}
                          onChange={(e) =>
                            updateSelectedExercise(
                              index,
                              "sets",
                              e.target.value
                            )
                          }
                          required
                        />
                        <Input
                          type="number"
                          placeholder="Reps"
                          value={selectedExercise.reps || ""}
                          onChange={(e) =>
                            updateSelectedExercise(
                              index,
                              "reps",
                              e.target.value
                            )
                          }
                          required
                        />
                        <Input
                          type="number"
                          placeholder="Weight"
                          value={selectedExercise.weight || ""}
                          onChange={(e) =>
                            updateSelectedExercise(
                              index,
                              "weight",
                              e.target.value
                            )
                          }
                        />
                        <Input
                          type="number"
                          placeholder="Duration"
                          value={selectedExercise.duration || ""}
                          onChange={(e) =>
                            updateSelectedExercise(
                              index,
                              "duration",
                              e.target.value
                            )
                          }
                        />
                      </div>
                    </div>
                    <Button
                      type="button"
                      variant="destructive"
                      onClick={() => removeSelectedExercise(index)}
                    >
                      Remove
                    </Button>
                  </div>
                ))}
              </div>
            )}

            <Button
              type="submit"
              disabled={isSubmitting || !name || selectedExercises.length === 0}
              className="w-full"
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Creating...
                </>
              ) : (
                "Create Workout"
              )}
            </Button>

            <ExerciseTable
              exercises={exercises}
              initialExercises={initialExercises}
              onAddExercise={handleSelectExercise}
            />
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
