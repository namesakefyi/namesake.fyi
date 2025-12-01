import { sanityClient } from "sanity:client";
import { createImageUrlBuilder, type SanityAsset } from "@sanity/image-url";

export const imageBuilder = createImageUrlBuilder(sanityClient);

export function urlForImage(source: SanityAsset) {
  return imageBuilder.image(source);
}
