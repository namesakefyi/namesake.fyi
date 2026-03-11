import { definePdf } from "@/pdfs/utils/definePdf";
import { deriveCurrentAge } from "@/utils/deriveCurrentAge";
import { formatDateMMDDYYYY } from "@/utils/formatDateMMDDYYYY";
import { joinPronouns } from "@/utils/joinPronouns";
import pdf from "./cjp25-petition-to-change-name-of-minor.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp25-petition-to-change-name-of-minor",
  title: "Petition to Change Name of Minor",
  code: "CJP-25",
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
    isPresentedByLegalMotherParent1: data.isPresentedByLegalMotherParent1,
    isPresentedByLegalFatherParent2: data.isPresentedByLegalFatherParent2,
    isPresentedByCourtAppointedGuardian:
      data.isPresentedByCourtAppointedGuardian,
    birthplaceCity: data.birthplaceCity,
    birthplaceState: data.birthplaceState,
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    currentAge: data.dateOfBirth
      ? deriveCurrentAge(new Date(data.dateOfBirth)).toString()
      : undefined,
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
    hasPreviousNameChangeTrue: data.hasPreviousNameChange,
    hasPreviousNameChangeFalse: !data.hasPreviousNameChange,
    previousNameFrom: data.previousNameFrom,
    previousNameTo: data.previousNameTo,
    previousNameReason: data.previousNameReason,
    isUnderSupervisionOfMassDeptOfYouthServices:
      data.isUnderSupervisionOfMassDeptOfYouthServices,
    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,
    parent1FullName: data.parent1FullName,
    parent2FullName: data.parent2FullName,
    parent1StreetAddress: data.parent1StreetAddress,
    parent1City: data.parent1City,
    parent1State: data.parent1State,
    parent1ZipCode: data.parent1ZipCode,
    parent2StreetAddress: data.parent2StreetAddress,
    parent2City: data.parent2City,
    parent2State: data.parent2State,
    parent2ZipCode: data.parent2ZipCode,
    parent1Phone: data.parent1Phone,
    parent2Phone: data.parent2Phone,
    parent1Email: data.parent1Email,
    parent2Email: data.parent2Email,
    isOnlyOneParentListedOnBirthCertificate:
      data.isOnlyOneParentListedOnBirthCertificate,
    isALegalParentDeceased: data.isALegalParentDeceased,
    hasLegalParentHadParentalRightsTerminated:
      data.hasLegalParentHadParentalRightsTerminated,
    hasCountAppointedGuardianFalse: !data.hasCourtAppointedGuardian,
    hasCourtAppointedGuardianTrue: data.hasCourtAppointedGuardian,
    guardianFullName: data.guardianFullName,
    coGuardianFullName: data.coGuardianFullName,
    guardianStreetAddress: data.guardianStreetAddress,
    coGuardianStreetAddress: data.coGuardianStreetAddress,
    guardianCity: data.guardianCity,
    guardianState: data.guardianState,
    guardianZipCode: data.guardianZipCode,
    coGuardianCity: data.coGuardianCity,
    coGuardianState: data.coGuardianState,
    coGuardianZipCode: data.coGuardianZipCode,
    guardianPhone: data.guardianPhone,
    coGuardianPhone: data.coGuardianPhone,
    guardianEmail: data.guardianEmail,
    coGuardianEmail: data.coGuardianEmail,
    isChildUnder12: data.dateOfBirth
      ? deriveCurrentAge(new Date(data.dateOfBirth)) < 12
      : undefined,
    isParent1AssentingTrue: data.isParent1Assenting === true,
    isParent1AssentingFalse: !data.isParent1Assenting,
    parent1DissentReason: !data.isParent1Assenting
      ? data.parent1DissentReason
      : undefined,
    isParent2AssentingTrue: data.isParent2Assenting === true,
    isParent2AssentingFalse: !data.isParent2Assenting,
    parent2DissentReason: !data.isParent2Assenting
      ? data.parent2DissentReason
      : undefined,
    isAllGuardiansAssentingTrue: data.isAllGuardiansAssenting === true,
    isAllGuardiansAssentingFalse: !data.isAllGuardiansAssenting,
    hasNoCountAppointedGuardian: !data.hasCourtAppointedGuardian,
    guardianDissentReason: !data.isAllGuardiansAssenting
      ? data.guardianDissentReason
      : undefined,
    newFirstName: data.newFirstName,
    newMiddleName: data.newMiddleName,
    newLastName: data.newLastName,
    reasonForChangingName: data.reasonForChangingName,
    isInterpreterNeededForChild: data.isInterpreterNeededForChild,
    isInterpreterNeededForParent1: data.isInterpreterNeededForParent1,
    isInterpreterNeededForParent2: data.isInterpreterNeededForParent2,
    isInterpreterNeededForGuardian: data.isInterpreterNeededForGuardian,
    languages: data.language,
    isOkayToSharePronouns: data.isOkayToSharePronouns,
    pronouns: data.isOkayToSharePronouns
      ? joinPronouns(data.pronouns, data.otherPronouns)
      : undefined,
  }),
});
