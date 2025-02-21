"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import { useState } from "react";
import { toast } from "sonner";
import { updateAthlete } from "@/actions/athlete/update-athlete";
import { AthleteFormData } from "@/actions/athlete/get-athlete";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function AthleteDetails({
  initialData,
}: {
  initialData: AthleteFormData;
}) {
  const [isSaving, setIsSaving] = useState(false);
  const [formData, setFormData] = useState<AthleteFormData>(initialData);

  const handleInputChange =
    (field: keyof AthleteFormData) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setFormData((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleGenderChange = (value: "male" | "female" | "other") => {
    setFormData((prev) => ({
      ...prev,
      gender: value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);

    try {
      const response = await updateAthlete({
        name: formData.name,
        surname: formData.surname,
        birth_date: formData.birth_date,
        gender: formData.gender as "male" | "female" | "other",
        phone: formData.phone,
      });

      if (!response?.data?.success) {
        throw new Error(response?.data?.error);
      }

      toast.success("Athlete details updated successfully");
    } catch (error) {
      toast.error(
        error instanceof Error
          ? error.message
          : "Failed to update athlete details"
      );
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="mb-8 max-w-screen-xl">
      <Card className="w-full bg-noise">
        <CardHeader>
          <CardTitle className="text-xl font-semibold">
            Athlete Details
          </CardTitle>
          <p className="text-sm text-muted-foreground">
            Update your athlete information
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">First Name</label>
              <Input
                value={formData.name}
                onChange={handleInputChange("name")}
                placeholder="Enter first name"
                required
              />
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Last Name</label>
              <Input
                value={formData.surname}
                onChange={handleInputChange("surname")}
                placeholder="Enter last name"
                required
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Birth Date</label>
                <Input
                  type="date"
                  value={formData.birth_date}
                  onChange={handleInputChange("birth_date")}
                  required
                />
              </div>

              <div className="space-y-2">
                <label className="text-sm font-medium">Gender</label>
                <Select
                  value={formData.gender}
                  onValueChange={handleGenderChange}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select gender" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Phone Number</label>
              <Input
                value={formData.phone}
                onChange={handleInputChange("phone")}
                placeholder="Enter phone number"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={isSaving}
              className="w-full md:w-auto"
            >
              {isSaving && <Spinner size="sm" className="mr-2" />}
              Save Changes
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
