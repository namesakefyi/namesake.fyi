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
  resolver: (data) => ({
    petitionerFirstName: data.oldFirstName,
    petitionerMiddleName: data.oldMiddleName,
    petitionerLastName: data.oldLastName,
    county: data.residenceCounty,
    oldFirstName: data.oldFirstName,
    oldMiddleName: data.oldMiddleName,
    oldLastName: data.oldLastName,
    birthplaceCity: data.birthplaceCity,
    birthplaceState: data.birthplaceState,
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    residenceStreetAddress: data.residenceStreetAddress,
    residenceCity: data.residenceCity,
    residenceState: data.residenceState,
    residenceZipCode: data.residenceZipCode,
    mailingStreetAddress: data.isMailingAddressDifferentFromResidence
      ? data.mailingStreetAddress
      : undefined,
    mailingCity: data.isMailingAddressDifferentFromResidence
      ? data.mailingCity
      : undefined,
    mailingState: data.isMailingAddressDifferentFromResidence
      ? data.mailingState
      : undefined,
    mailingZipCode: data.isMailingAddressDifferentFromResidence
      ? data.mailingZipCode
      : undefined,
    email: data.email,
    phoneNumber: data.phoneNumber,
    hasPreviousNameChangeTrue: data.hasPreviousNameChange,
    hasPreviousNameChangeFalse: !data.hasPreviousNameChange,
    previousNameFrom: data.previousNameFrom,
    previousNameTo: data.previousNameTo,
    previousNameReason: data.previousNameReason,
    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
    hasUsedOtherNameOrAliasTrue: data.hasUsedOtherNameOrAlias,
    hasUsedOtherNameOrAliasFalse: !data.hasUsedOtherNameOrAlias,
    otherNamesOrAliases: data.otherNamesOrAliases,
    newFirstName: data.newFirstName,
    newMiddleName: data.newMiddleName,
    newLastName: data.newLastName,
    reasonForChangingName: data.reasonForChangingName,
    isInterpreterNeeded: data.isInterpreterNeeded
      ? data.isInterpreterNeeded
      : undefined,
    language:
      data.isInterpreterNeeded && data.language
        ? languageNameMap[data.language].name
        : undefined,
    isOkayToSharePronouns: data.isOkayToSharePronouns
      ? data.isOkayToSharePronouns
      : undefined,
    pronouns: data.isOkayToSharePronouns
      ? joinPronouns(data.pronouns, data.otherPronouns)
      : undefined,
  }),
});
