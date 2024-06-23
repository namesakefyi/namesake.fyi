type SocialPlatform = "discord" | "github" | "instagram" | "linkedin";

export type SocialLink = {
  name: string;
  text: string;
  href: string;
};

export type SiteInfo = {
  name: string;
  title: string;
  description: string;
  image: {
    src: string;
    alt: string;
  };
  socialLinks: Record<SocialPlatform, SocialLink>;
};

const siteInfo: SiteInfo = {
  name: "Namesake",
  title: "Be seen for who you are",
  description:
    "Streamlining the legal name and gender marker change process in the US.",
  image: {
    src: "/og/social.png",
    alt: "Be seen for who you are",
  },
  socialLinks: {
    discord: {
      name: "Discord",
      text: "Join Namesake on Discord",
      href: "/chat",
    },
    github: {
      name: "GitHub",
      text: "Go to Namesake's GitHub repo",
      href: "https://github.com/namesakefyi",
    },
    instagram: {
      name: "Instagram",
      text: "Follow Namesake on Instagram",
      href: "https://www.instagram.com/joinnamesake/",
    },
    linkedin: {
      name: "LinkedIn",
      text: "Connect with Namesake on LinkedIn",
      href: "https://www.linkedin.com/company/namesake-collaborative/",
    },
  },
};

export default siteInfo;
