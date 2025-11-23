import { describe, expect, it } from "vitest";
import { COUNTRIES } from "~/constants/countries";
import { BIRTHPLACES } from "~/constants/jurisdictions";
import { formatBirthplaceStateOrCountry } from "../formatBirthplaceStateOrCountry";

describe("formatBirthplaceStateOrCountry", () => {
  it("returns state name when valid state is provided", () => {
    expect(formatBirthplaceStateOrCountry("CA", undefined)).toBe(
      BIRTHPLACES.CA,
    );
  });

  it("returns country name when state is 'other' and country is provided", () => {
    expect(formatBirthplaceStateOrCountry("other", "US")).toBe(COUNTRIES.US);
  });

  it("returns empty string when no state or country is provided", () => {
    expect(formatBirthplaceStateOrCountry(undefined, undefined)).toBe("");
  });

  it("returns empty string when state is 'other' but no country is provided", () => {
    expect(formatBirthplaceStateOrCountry("other", undefined)).toBe("");
  });

  it("returns state name when both state and country are provided but state is not 'other'", () => {
    expect(formatBirthplaceStateOrCountry("NY", "US")).toBe(BIRTHPLACES.NY);
  });
});
