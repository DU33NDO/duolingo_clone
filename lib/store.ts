import { atom } from "jotai";

export interface User {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  streak: number;
  xp: number;
}

export interface Course {
  id: string;
  name: string;
  language: string;
  flag: string;
  progress: number;
  level: number;
}

export interface CourseDetails {
  id: string;
  name: string;
  language: string;
  flag: string;
  description: string;
  lessons: number;
  duration: string;
  difficulty: string;
  available: boolean;
  progress: number;
  level: number;
}

export const userAtom = atom<User | null>(null);

export const coursesAtom = atom<CourseDetails[]>([
  {
    id: "1",
    name: "Spanish",
    language: "Spanish",
    flag: "🇪🇸",
    description:
      "Learn Spanish with interactive lessons covering grammar, vocabulary, and conversation skills.",
    lessons: 120,
    duration: "6 months",
    difficulty: "Beginner to Advanced",
    available: false,
    progress: 65,
    level: 3,
  },
  {
    id: "2",
    name: "French",
    language: "French",
    flag: "🇫🇷",
    description:
      "Master French through engaging exercises focusing on pronunciation, reading, and writing.",
    lessons: 115,
    duration: "6 months",
    difficulty: "Beginner to Advanced",
    available: false,
    progress: 45,
    level: 2,
  },
  {
    id: "3",
    name: "German",
    language: "German",
    flag: "🇩🇪",
    description:
      "Discover German language and culture with comprehensive lessons and real-world scenarios.",
    lessons: 110,
    duration: "6 months",
    difficulty: "Beginner to Advanced",
    available: false,
    progress: 30,
    level: 1,
  },
  {
    id: "4",
    name: "Italian",
    language: "Italian",
    flag: "🇮🇹",
    description:
      "Explore Italian through immersive content covering everyday conversations and cultural insights.",
    lessons: 105,
    duration: "5 months",
    difficulty: "Beginner to Intermediate",
    available: false,
    progress: 20,
    level: 1,
  },
  {
    id: "5",
    name: "Japanese",
    language: "Japanese",
    flag: "🇯🇵",
    description:
      "Learn Japanese writing systems, grammar, and conversation with structured lessons.",
    lessons: 130,
    duration: "8 months",
    difficulty: "Beginner to Advanced",
    available: false,
    progress: 15,
    level: 1,
  },
  {
    id: "6",
    name: "Portuguese",
    language: "Portuguese",
    flag: "🇵🇹",
    description:
      "Study Portuguese with focus on Brazilian and European variants, grammar, and vocabulary.",
    lessons: 100,
    duration: "5 months",
    difficulty: "Beginner to Intermediate",
    available: false,
    progress: 10,
    level: 1,
  },
]);

export const themeAtom = atom<"light" | "dark">("light");
