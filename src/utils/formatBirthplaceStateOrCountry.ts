import { COUNTRIES } from "@/constants/countries";
import { BIRTHPLACES } from "@/constants/jurisdictions";

export const formatBirthplaceStateOrCountry = (
  birthplaceState?: string,
  birthplaceCountry?: string,
) => {
  if (birthplaceState === "other" && birthplaceCountry) {
    return COUNTRIES[birthplaceCountry];
  }
  if (birthplaceState && birthplaceState !== "other") {
    return BIRTHPLACES[birthplaceState];
  }
  return "";
};
