import { PlayIcon } from "@sanity/icons";
import type { ObjectDefinition, Rule } from "sanity";
import { YouTubeInput } from "../../components/YouTubeInput";
import { YouTubePreview } from "../../components/YouTubePreview";

export const youtubeBlock: ObjectDefinition = {
  type: "object",
  name: "youtube",
  title: "YouTube Video",
  icon: PlayIcon,
  fields: [
    {
      name: "url",
      type: "url",
      components: {
        input: YouTubeInput,
      },
      validation: (Rule: Rule) =>
        Rule.required().uri({
          scheme: ["https"],
          allowRelative: false,
        }),
    },
  ],
  preview: {
    select: {
      title: "url",
    },
  },
  components: {
    preview: YouTubePreview,
  },
};
