import { Flex, Text } from "@sanity/ui";
import ReactPlayer from "react-player";
import type { PreviewProps } from "sanity";

export function YouTubePreview(props: PreviewProps) {
  const { title: url } = props;

  return (
    <Flex padding={3} align="center" justify="center">
      {typeof url === "string" ? (
        <ReactPlayer src={url} />
      ) : (
        <Text>Add a YouTube URL</Text>
      )}
    </Flex>
  );
}
