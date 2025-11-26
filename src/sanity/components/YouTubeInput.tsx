import { Box, Card, Flex, Text } from "@sanity/ui";
import { useEffect, useState } from "react";
import type { StringInputProps } from "sanity";
import {
  fetchYouTubeVideoDetails,
  type YouTubeOEmbedResponse,
} from "../../utils/fetchYouTubeVideoDetails";

export function YouTubeInput(props: StringInputProps) {
  const { value } = props;
  const [error, setError] = useState<string | null>(null);
  const [videoData, setVideoData] = useState<YouTubeOEmbedResponse | null>(
    null,
  );

  useEffect(() => {
    if (!value) {
      setVideoData(null);
      return;
    }

    const fetchData = async () => {
      setError(null);

      try {
        const data = await fetchYouTubeVideoDetails(value);
        setVideoData(data);
      } catch (err) {
        setError("Failed to fetch video details");
        console.error("YouTube oEmbed fetch error:", err);
        setVideoData(null);
      }
    };

    const timeoutId = setTimeout(fetchData, 500);
    return () => clearTimeout(timeoutId);
  }, [value]);

  return (
    <Box>
      {props.renderDefault(props)}
      {error && (
        <Card border tone="critical" padding={2} radius={2} marginTop={2}>
          <Text size={1} color="red">
            {error}
          </Text>
        </Card>
      )}
      {videoData && (
        <Card padding={2} border radius={2} marginTop={2}>
          <Flex gap={3} align="center">
            <img
              src={videoData.thumbnail_url}
              alt="Video thumbnail"
              style={{ width: "80px", height: "auto" }}
            />
            <Flex direction="column" gap={3}>
              <Text size={2} textOverflow="ellipsis">
                {videoData.title}
              </Text>
              <Text size={1} muted textOverflow="ellipsis">
                by {videoData.author_name}
              </Text>
            </Flex>
          </Flex>
        </Card>
      )}
    </Box>
  );
}
