import type { IconType } from "react-icons/lib";
import {
  RiDiscordFill,
  RiGithubFill,
  RiInstagramFill,
  RiLinkedinBoxFill,
  RiMailSendFill,
} from "react-icons/ri";

type SocialPlatform = "discord" | "github" | "instagram" | "linkedin" | "email";

export type SocialLink = {
  name: string;
  text: string;
  href: string;
  Icon: IconType;
};

export type SiteInfo = {
  name: string;
  fullName: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  urls: {
    app: string;
    chat: string;
    status: string;
    donate: string;
  };
  socialLinks: Record<SocialPlatform, SocialLink>;
};

const siteInfo: SiteInfo = {
  name: "Namesake",
  fullName: "Namesake Collaborative",
  title: "Your name is yours to change",
  description:
    "Streamlining the legal name and gender marker change process in the US.",
  urls: {
    app: "https://app.namesake.fyi",
    chat: "/chat",
    status: "/status",
    donate: "/donate",
  },
  image: {
    src: "/og/social.png",
    alt: "Your name is yours to change",
  },
  socialLinks: {
    discord: {
      name: "Discord",
      text: "Join Namesake on Discord",
      href: "/chat",
      Icon: RiDiscordFill,
    },
    github: {
      name: "GitHub",
      text: "Go to Namesake's GitHub repo",
      href: "https://github.com/namesakefyi",
      Icon: RiGithubFill,
    },
    instagram: {
      name: "Instagram",
      text: "Follow Namesake on Instagram",
      href: "https://www.instagram.com/namesake.fyi",
      Icon: RiInstagramFill,
    },
    linkedin: {
      name: "LinkedIn",
      text: "Connect with Namesake on LinkedIn",
      href: "https://www.linkedin.com/company/namesake-fyi",
      Icon: RiLinkedinBoxFill,
    },
    email: {
      name: "Email",
      text: "Email Namesake",
      href: "mailto:hey@namesake.fyi",
      Icon: RiMailSendFill,
    },
  },
};

export default siteInfo;
