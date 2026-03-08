import languageNameMap from "language-name-map/map";
import { definePdf } from "@/pdfs/utils/definePdf";
import { formatDateMMDDYYYY } from "@/utils/formatDateMMDDYYYY";
import { joinPronouns } from "@/utils/joinPronouns";
import pdf from "./cjp27-petition-to-change-name-of-adult.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp27-petition-to-change-name-of-adult",
  title: "Petition to Change Name of Adult",
  code: "CJP-27",
  jurisdiction: "MA",
  pdfPath: pdf,
  fieldValueResolvers: {
    petitionerFirstName: (data) => data.oldFirstName,
    petitionerMiddleName: (data) => data.oldMiddleName,
    petitionerLastName: (data) => data.oldLastName,
    county: (data) => data.residenceCounty,
    oldFirstName: (data) => data.oldFirstName,
    oldMiddleName: (data) => data.oldMiddleName,
    oldLastName: (data) => data.oldLastName,
    birthplaceCity: (data) => data.birthplaceCity,
    birthplaceState: (data) => data.birthplaceState,
    dateOfBirth: (data) => formatDateMMDDYYYY(data.dateOfBirth),
    residenceStreetAddress: (data) => data.residenceStreetAddress,
    residenceCity: (data) => data.residenceCity,
    residenceState: (data) => data.residenceState,
    residenceZipCode: (data) => data.residenceZipCode,
    mailingStreetAddress: (data) =>
      data.isMailingAddressDifferentFromResidence
        ? data.mailingStreetAddress
        : undefined,
    mailingCity: (data) =>
      data.isMailingAddressDifferentFromResidence
        ? data.mailingCity
        : undefined,
    mailingState: (data) =>
      data.isMailingAddressDifferentFromResidence
        ? data.mailingState
        : undefined,
    mailingZipCode: (data) =>
      data.isMailingAddressDifferentFromResidence
        ? data.mailingZipCode
        : undefined,
    email: (data) => data.email,
    phoneNumber: (data) => data.phoneNumber,
    hasPreviousNameChangeTrue: (data) => data.hasPreviousNameChange,
    hasPreviousNameChangeFalse: (data) => !data.hasPreviousNameChange,
    previousNameFrom: (data) => data.previousNameFrom,
    previousNameTo: (data) => data.previousNameTo,
    previousNameReason: (data) => data.previousNameReason,
    shouldReturnOriginalDocuments: (data) => data.shouldReturnOriginalDocuments,
    hasUsedOtherNameOrAliasTrue: (data) => data.hasUsedOtherNameOrAlias,
    hasUsedOtherNameOrAliasFalse: (data) => !data.hasUsedOtherNameOrAlias,
    otherNamesOrAliases: (data) => data.otherNamesOrAliases,
    newFirstName: (data) => data.newFirstName,
    newMiddleName: (data) => data.newMiddleName,
    newLastName: (data) => data.newLastName,
    reasonForChangingName: (data) => data.reasonForChangingName,
    isInterpreterNeeded: (data) =>
      data.isInterpreterNeeded ? data.isInterpreterNeeded : undefined,
    language: (data) =>
      data.isInterpreterNeeded && data.language
        ? languageNameMap[data.language].name
        : undefined,
    isOkayToSharePronouns: (data) =>
      data.isOkayToSharePronouns ? data.isOkayToSharePronouns : undefined,
    pronouns: (data) =>
      data.isOkayToSharePronouns
        ? joinPronouns(data.pronouns, data.otherPronouns)
        : undefined,
  },
});
