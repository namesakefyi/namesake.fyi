import { Flex, Text } from "@sanity/ui";
import LiteYouTubeEmbed from "react-lite-youtube-embed";
import "react-lite-youtube-embed/dist/LiteYouTubeEmbed.css";
import type { PreviewProps } from "sanity";

export function YouTubePreview(props: PreviewProps) {
  const { title: url } = props;

  const videoId = typeof url === "string" ? url.split("v=")[1] : null;

  return (
    <Flex padding={3} align="center" justify="center">
      {videoId ? (
        <LiteYouTubeEmbed title="" id={videoId} />
      ) : (
        <Text>Add a YouTube URL</Text>
      )}
    </Flex>
  );
}
