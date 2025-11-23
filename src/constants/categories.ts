import {
  CircleHelp,
  CircleUser,
  Clapperboard,
  Computer,
  FileBadge,
  Gamepad2,
  Gavel,
  Globe,
  GraduationCap,
  HeartPulse,
  House,
  IdCard,
  Landmark,
  type LucideIcon,
  Mail,
  MapPin,
  MessageCircle,
  Scale,
  ShieldCheck,
  ShoppingBag,
} from "lucide-react";

/**
 * Categories.
 * Used to filter quests in the quests list.
 */
export type Category =
  // Core Types
  | "courtOrder"
  | "stateId"
  | "socialSecurity"
  | "passport"
  | "birthCertificate"

  // Non-Core Types
  | "entertainment"
  | "devices"
  | "education"
  | "finance"
  | "gaming"
  | "government"
  | "health"
  | "housing"
  | "personal"
  | "shopping"
  | "social"
  | "subscriptions"
  | "travel"
  | "other";

export type CoreCategory =
  | "courtOrder"
  | "socialSecurity"
  | "stateId"
  | "passport"
  | "birthCertificate";

/**
 * Generic group details.
 * Used for UI display of filter groups.
 */
export type GroupDetails = {
  label: string;
  icon: LucideIcon;
  isCore?: boolean;
};

export const CATEGORIES: Record<Category, GroupDetails> = {
  courtOrder: {
    label: "Court Order",
    icon: Gavel,
    isCore: true,
  },
  socialSecurity: {
    label: "Social Security",
    icon: ShieldCheck,
    isCore: true,
  },
  stateId: {
    label: "State ID",
    icon: IdCard,
    isCore: true,
  },
  passport: {
    label: "Passport",
    icon: Globe,
    isCore: true,
  },
  birthCertificate: {
    label: "Birth Certificate",
    icon: FileBadge,
    isCore: true,
  },
  entertainment: {
    label: "Arts and Entertainment",
    icon: Clapperboard,
  },
  devices: {
    label: "Devices",
    icon: Computer,
  },
  education: {
    label: "Education",
    icon: GraduationCap,
  },
  finance: {
    label: "Finance",
    icon: Landmark,
  },
  gaming: {
    label: "Gaming",
    icon: Gamepad2,
  },
  government: {
    label: "Government",
    icon: Scale,
  },
  health: {
    label: "Health",
    icon: HeartPulse,
  },
  housing: {
    label: "Housing and Utilities",
    icon: House,
  },
  personal: {
    label: "Personal",
    icon: CircleUser,
  },
  shopping: {
    label: "Shopping",
    icon: ShoppingBag,
  },
  social: {
    label: "Social",
    icon: MessageCircle,
  },
  subscriptions: {
    label: "Subscriptions",
    icon: Mail,
  },
  travel: {
    label: "Travel",
    icon: MapPin,
  },
  other: {
    label: "Other",
    icon: CircleHelp,
  },
} as const;
