import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import {
  authorType,
  pageType,
  partnerType,
  postType,
  pressType,
} from "~/sanity/schema";

export default defineConfig({
  name: "namesake",
  title: "Namesake",
  projectId: "k4p1j15y",
  dataset: "production",
  plugins: [structureTool()],
  schema: {
    types: [authorType, pageType, postType, pressType, partnerType],
  },
});
