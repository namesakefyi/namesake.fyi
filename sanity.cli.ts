import { defineCliConfig } from "sanity/cli";

export default defineCliConfig({
  api: {
    projectId: "k4p1j15y",
    dataset: "production",
  },
  studioHost: "namesake",
  server: {
    hostname: "losthost",
    port: 4321,
  },
});
