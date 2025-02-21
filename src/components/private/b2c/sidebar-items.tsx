import { Dumbbell, Medal } from "lucide-react";
import {
  MdApps,
  MdAppShortcut,
  MdBatchPrediction,
  MdSportsGymnastics,
} from "react-icons/md";

export const sidebarItems = [
  {
    icon: MdSportsGymnastics,
    label: "Home",
    path: `/athlete`,
  },
  //{
  //  icon: Medal,
  //  label: "Achievements",
  //  path: `/athlete/achievements`,
  //},
  {
    icon: Dumbbell,
    label: "Workouts",
    path: `/athlete/workouts`,
  },
  {
    icon: MdBatchPrediction,
    label: "Feedback",
    path: `/athlete/feedback`,
  },
  {
    icon: MdAppShortcut,
    label: "Mobile App",
    path: `/athlete/mobile-app`,
  },
];
