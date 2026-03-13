import { describe, it } from "vitest";
import type { FormData } from "@/constants/fields";
import { expectPdfFieldsMatch } from "@/pdfs/utils/expectPdfFieldsMatch";
import nyAdultPetition from ".";

describe("UCSNC-1 Name Change and/or Sex Designation Change Petition for Individual Adult", () => {
  const testData: Partial<FormData> = {
    shouldChangeName: true,
    shouldChangeSexDesignation: true,
    oldFullName: "Jane A. Doe",
    newFullName: "Alex B. Smith",
    dateOfBirth: "1990-06-15",
    birthplaceCity: "Brooklyn, New York",
    residenceStreetAddress: "123 Main St",
    residenceCity: "New York",
    residenceState: "NY",
    residenceZipCode: "10001",
    courtType: "Supreme",
    courtCounty: "New York",
    hasConviction: false,
    hasBankruptcy: false,
    hasJudgementsOrLiens: false,
    isPartyToAction: false,
    isCurrentlyMarried: false,
    isPreviouslyMarried: false,
    hasChildrenUnder21: false,
    hasChildSupportObligation: false,
    hasSpousalSupportObligation: false,
    hasPreviousNameChange: true,
    previousNameReason: "Marriage",
    reasonForChangingName: "Gender identity",
    newSexDesignation: "X",
    hasPreviousSexDesignationChangePetition: false,
    sexDesignationChangeReason:
      "Gender identity does not match current designation",
    shouldSealRecords: false,
  };

  it("maps all fields correctly to the PDF", async () => {
    await expectPdfFieldsMatch(nyAdultPetition, testData);
  });
});
