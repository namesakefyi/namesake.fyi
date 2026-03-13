import { definePdf } from "@/pdfs/utils/definePdf";
import { formatDateMMDDYYYY } from "@/utils/formatDateMMDDYYYY";
import type { PdfFieldName } from "./schema";
import pdf from "./ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult.pdf";

function calculateAge(dateOfBirth?: string): string {
  if (!dateOfBirth) return "";
  const dob = new Date(dateOfBirth);
  const today = new Date();
  let age = today.getFullYear() - dob.getFullYear();
  const monthDiff = today.getMonth() - dob.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--;
  }
  return String(age);
}

function boolToYesNo(value?: boolean): string | undefined {
  if (value === undefined) return undefined;
  return value ? "Yes" : "No";
}

function formatResidenceAddress(data: {
  residenceStreetAddress?: string;
  residenceCity?: string;
  residenceState?: string;
  residenceZipCode?: string;
}): string {
  return [
    data.residenceStreetAddress,
    data.residenceCity,
    data.residenceState,
    data.residenceZipCode,
  ]
    .filter(Boolean)
    .join(", ");
}

function getSignatureDay(): string {
  const day = new Date().getDate();
  const suffixes: Record<number, string> = {
    1: "st",
    2: "nd",
    3: "rd",
    21: "st",
    22: "nd",
    23: "rd",
    31: "st",
  };
  return `${day}${suffixes[day] || "th"}`;
}

function getSignatureMonth(): string {
  return new Date().toLocaleString("en-US", { month: "long" });
}

function getSignatureYearEnding(): string {
  return String(new Date().getFullYear()).slice(-2);
}

export default definePdf<PdfFieldName>({
  id: "ucsnc1-name-change-and-or-sex-designation-change-petition-for-individual-adult",
  title:
    "Name Change and/or Sex Designation Change Petition for Individual Adult",
  code: "UCSNC-1",
  jurisdiction: "NY",
  pdfPath: pdf,
  resolver: (data) => ({
    // Court info
    courtType: data.courtType,
    courtCounty: data.courtCounty,

    // Petition type
    shouldChangeName: data.shouldChangeName,
    shouldChangeSexDesignation: data.shouldChangeSexDesignation,

    // Names
    oldName: data.oldFullName,
    newName: data.newFullName,

    // Personal info
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    age: calculateAge(data.dateOfBirth),
    birthplace: data.birthplaceCity,
    residenceAddress: formatResidenceAddress(data),

    // Criminal history
    hasConviction: boolToYesNo(data.hasConviction),
    courtOfConviction: data.courtOfConviction,
    crime: data.crime,

    // Financial disclosures
    hasBankruptcy: boolToYesNo(data.hasBankruptcy),
    hasJudgementsOrLiens: boolToYesNo(data.hasJudgementsOrLiens),
    partyToAction: boolToYesNo(data.isPartyToAction),
    partyToActionDetails: data.partyToActionDetails,

    // Marriage and family
    currentlyMarried: boolToYesNo(data.isCurrentlyMarried),
    previouslyMarried: boolToYesNo(data.isPreviouslyMarried),
    childrenUnder21: boolToYesNo(data.hasChildrenUnder21),

    // Child support
    childSupport: boolToYesNo(data.hasChildSupportObligation),
    childSupportPayments: boolToYesNo(data.isChildSupportPaymentsCurrent),
    childSupportOwed: data.childSupportOwed,
    courtIssuingChildSupportOrder: data.courtIssuingChildSupportOrder,
    childSupportCollectionsUnit: data.childSupportCollectionsUnit,

    // Spousal support
    spousalSupport: boolToYesNo(data.hasSpousalSupportObligation),
    SpousalSupportPayments: boolToYesNo(data.isSpousalSupportPaymentsCurrent),
    spousalSupportOwed: data.spousalSupportOwed,
    courtIssuingSpousalSupportOrder: data.courtIssuingSpousalSupportOrder,

    // Previous name change
    hasPreviousNameChange: data.hasPreviousNameChange ? "Yes" : undefined,
    previousNameReason: data.previousNameReason,
    reasonForChangingName: data.reasonForChangingName,

    // Sex designation change
    newSex: data.newSexDesignation,
    previousSexDesignationChangePetition: boolToYesNo(
      data.hasPreviousSexDesignationChangePetition,
    ),
    previousSexDesignationChangePetitionReason:
      data.previousSexDesignationChangePetitionReason,
    providesSexChangeDesignationReason: data.sexDesignationChangeReason
      ? "6"
      : undefined,
    sexChangeDesignationReason: data.sexDesignationChangeReason,

    // Sealing request
    SealingRequest: data.shouldSealRecords ? "10" : "29",
    "SealingRequest-specify": data.sealingRequestDetails,

    // Signature date (auto-fill with today's date)
    signatureDay: getSignatureDay(),
    signatureMonth: getSignatureMonth(),
    signatureYearEnding: getSignatureYearEnding(),
  }),
});
