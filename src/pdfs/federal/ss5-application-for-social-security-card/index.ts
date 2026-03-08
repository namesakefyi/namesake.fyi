import { definePdf } from "@/pdfs/utils/definePdf";
import { formatBirthplaceCountryOrState } from "@/utils/formatBirthplaceCountryOrState";
import { formatDateMMDDYYYY } from "@/utils/formatDateMMDDYYYY";
import type { PdfFieldName } from "./schema";
import pdf from "./ss5-application-for-social-security-card.pdf";

export default definePdf<PdfFieldName>({
  id: "ss5-application-for-social-security-card",
  title: "Application for Social Security Card",
  code: "SS-5",
  pdfPath: pdf,
  resolver: {
    newFirstName: (data) => data.newFirstName,
    newMiddleName: (data) => data.newMiddleName,
    newLastName: (data) => data.newLastName,
    oldFirstName: (data) => data.oldFirstName,
    oldMiddleName: (data) => data.oldMiddleName,
    oldLastName: (data) => data.oldLastName,
    otherNames: (data) => data.previousLegalNames,
    birthplaceCity: (data) => data.birthplaceCity,
    birthplaceState: (data) =>
      formatBirthplaceCountryOrState(
        data.birthplaceCountry,
        data.birthplaceState,
      ),
    dateOfBirth: (data) => formatDateMMDDYYYY(data.dateOfBirth),
    usCitizen: (data) => data.citizenshipStatus === "usCitizen",
    legalAlienAllowedToWork: (data) =>
      data.citizenshipStatus === "legalAlienAllowedToWork",
    legalAlienNotAllowedToWork: (data) =>
      data.citizenshipStatus === "legalAlienNotAllowedToWork",
    citizenshipOther: (data) => data.citizenshipStatus === "other",
    isHispanicOrLatino: (data) => data.isHispanicOrLatino === true,
    isNotHispanicOrLatino: (data) => data.isHispanicOrLatino === false,
    isNativeHawaiian: (data) => data.race?.includes("nativeHawaiian"),
    isAlaskaNative: (data) => data.race?.includes("alaskaNative"),
    isAsian: (data) => data.race?.includes("asian"),
    isAmericanIndian: (data) => data.race?.includes("americanIndian"),
    isBlack: (data) => data.race?.includes("black"),
    isOtherPacificIslander: (data) =>
      data.race?.includes("otherPacificIslander"),
    isWhite: (data) => data.race?.includes("white"),
    isMale: (data) => data.sexAssignedAtBirth === "male",
    isFemale: (data) => data.sexAssignedAtBirth === "female",
    mothersFirstName: (data) => data.mothersFirstName,
    mothersMiddleName: (data) => data.mothersMiddleName,
    mothersLastName: (data) => data.mothersLastName,
    fathersFirstName: (data) => data.fathersFirstName,
    fathersMiddleName: (data) => data.fathersMiddleName,
    fathersLastName: (data) => data.fathersLastName,
    hasPreviousSocialSecurityCard: (data) =>
      data.hasPreviousSocialSecurityCard === true,
    hasNoPreviousSocialSecurityCard: (data) =>
      data.hasPreviousSocialSecurityCard === false,
    previousSocialSecurityCardFirstName: (data) =>
      data.previousSocialSecurityCardFirstName,
    previousSocialSecurityCardMiddleName: (data) =>
      data.previousSocialSecurityCardMiddleName,
    previousSocialSecurityCardLastName: (data) =>
      data.previousSocialSecurityCardLastName,
    todaysDate: () =>
      new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
    phoneNumber: (data) => data.phoneNumber,
    mailingStreetAddress: (data) => data.mailingStreetAddress,
    mailingCity: (data) => data.mailingCity,
    mailingState: (data) => data.mailingState,
    mailingZipCode: (data) => data.mailingZipCode,
    isSelf: (data) => data.isFilingForSomeoneElse === false,
    isParent: (data) => data.relationshipToFilingFor === "parent",
    isGuardian: (data) => data.relationshipToFilingFor === "legalGuardian",
    isFilingOther: (data) => data.relationshipToFilingFor === "other",
    otherSpecify: (data) => data.relationshipToFilingForOther,
  },
});
