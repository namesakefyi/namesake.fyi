import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "k4p1j15y",
    dataset: "production",
  },
  deployment: {
    appId: "z6o4lwn6d4nk10velhthn6ef",
  },
  studioHost: "namesake",
  server: {
    hostname: "localhost",
    port: 4321,
  },
});
