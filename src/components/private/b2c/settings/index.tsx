"use client";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useQueryState } from "nuqs";
import { AthleteDetails } from "./athlete-details";
import { AthleteFormData } from "@/actions/athlete/get-athlete";

export function SettingsPage({ athlete }: { athlete: AthleteFormData }) {
  const [tab, setTab] = useQueryState("tab", {
    defaultValue: "athlete-details",
  });

  const tabs = [
    {
      id: "athlete-details",
      title: "Athlete Details",
    },
    {
      id: "plan",
      title: "Plan",
    },
  ];

  return (
    <div className="w-full px-4 md:px-8 py-4">
      <Tabs value={tab} onValueChange={setTab} className="w-full">
        <TabsList className="justify-start rounded-none h-auto p-0 bg-transparent space-x-4 md:space-x-6 overflow-x-auto">
          {tabs.map((tab) => (
            <TabsTrigger
              key={tab.id}
              value={tab.id}
              className="rounded-none border-b-2 border-transparent text-primary data-[state=active]:border-primary data-[state=active]:bg-transparent px-0 py-2 text-sm md:text-base whitespace-nowrap"
            >
              {tab.title}
            </TabsTrigger>
          ))}
        </TabsList>

        <TabsContent value="athlete-details" className="mt-6">
          <AthleteDetails initialData={athlete} />
        </TabsContent>
      </Tabs>
    </div>
  );
}
