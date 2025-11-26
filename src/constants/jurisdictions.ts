import { usaStates } from "typed-usa-states/dist/states";

/**
 * Jurisdictions, a.k.a. US States and territories.
 */
export const JURISDICTIONS = usaStates.reduce(
  (acc, state) => {
    acc[state.abbreviation] = state.name;
    return acc;
  },
  {} as Record<string, string>,
);
export type Jurisdiction = keyof typeof JURISDICTIONS;

export const BIRTHPLACES: Record<Jurisdiction | "other", string> = {
  ...JURISDICTIONS,
  other: "Outside the US",
};
export type Birthplace = keyof typeof BIRTHPLACES;
