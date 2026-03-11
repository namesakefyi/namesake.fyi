import languageNameMap from "language-name-map/map";
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
    // Header
    petitionerFirstName: data.oldFirstName,
    petitionerMiddleName: data.oldMiddleName,
    petitionerLastName: data.oldLastName,
    county: data.residenceCounty,

    // 1. Petitioner (minor)
    oldFirstName: data.oldFirstName,
    oldMiddleName: data.oldMiddleName,
    oldLastName: data.oldLastName,

    // 2. Petition presented by
    isPresentedByLegalMotherParent1: data.isPresentedByLegalMotherParent1,
    isPresentedByLegalFatherParent2: data.isPresentedByLegalFatherParent2,
    isPresentedByCourtAppointedGuardian:
      data.isPresentedByCourtAppointedGuardian,

    // 3. Minor's info
    birthplaceCity: data.birthplaceCity,
    birthplaceState: data.birthplaceState,
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    currentAge: data.dateOfBirth
      ? deriveCurrentAge(new Date(data.dateOfBirth)).toString()
      : undefined,

    // 4. Minor's address
    mailingStreetAddress: data.residenceStreetAddress,
    mailingCity: data.residenceCity,
    mailingState: data.residenceState,
    mailingZipCode: data.residenceZipCode,
    isUnderSupervisionOfMassDeptOfYouthServices:
      data.isUnderSupervisionOfMassDeptOfYouthServices,

    // 5. Has previous name change?
    hasPreviousNameChangeTrue: data.hasPreviousNameChange,
    hasPreviousNameChangeFalse: !data.hasPreviousNameChange,
    previousNameFrom: data.previousNameFrom,
    previousNameTo: data.previousNameTo,
    previousNameReason: data.previousNameReason,

    shouldReturnOriginalDocuments: data.shouldReturnOriginalDocuments,

    // 6. Legal parents
    parent1FullName: data.parent1FullName,
    parent1StreetAddress: data.parent1StreetAddress,
    parent1City: data.parent1City,
    parent1State: data.parent1State,
    parent1ZipCode: data.parent1ZipCode,
    parent1Phone: data.parent1Phone,
    parent1Email: data.parent1Email,

    parent2FullName: data.parent2FullName,
    parent2StreetAddress: data.parent2StreetAddress,
    parent2City: data.parent2City,
    parent2State: data.parent2State,
    parent2ZipCode: data.parent2ZipCode,
    parent2Phone: data.parent2Phone,
    parent2Email: data.parent2Email,

    // Parental info
    isOnlyOneParentListedOnBirthCertificate:
      data.isOnlyOneParentListedOnBirthCertificate,
    isALegalParentDeceased: data.isALegalParentDeceased,
    hasLegalParentHadParentalRightsTerminated:
      data.hasLegalParentHadParentalRightsTerminated,

    // 7. Court-appointed guardian
    hasCountAppointedGuardianFalse: !data.hasCourtAppointedGuardian,
    hasCourtAppointedGuardianTrue: data.hasCourtAppointedGuardian,

    guardianFullName: data.hasCourtAppointedGuardian
      ? data.guardianFullName
      : undefined,
    guardianStreetAddress: data.hasCourtAppointedGuardian
      ? data.guardianStreetAddress
      : undefined,
    guardianCity: data.hasCourtAppointedGuardian
      ? data.guardianCity
      : undefined,
    guardianState: data.hasCourtAppointedGuardian
      ? data.guardianState
      : undefined,
    guardianZipCode: data.hasCourtAppointedGuardian
      ? data.guardianZipCode
      : undefined,
    guardianPhone: data.hasCourtAppointedGuardian
      ? data.guardianPhone
      : undefined,
    guardianEmail: data.hasCourtAppointedGuardian
      ? data.guardianEmail
      : undefined,

    coGuardianFullName: data.hasCourtAppointedGuardian
      ? data.coGuardianFullName
      : undefined,
    coGuardianStreetAddress: data.hasCourtAppointedGuardian
      ? data.coGuardianStreetAddress
      : undefined,
    coGuardianCity: data.hasCourtAppointedGuardian
      ? data.coGuardianCity
      : undefined,
    coGuardianState: data.hasCourtAppointedGuardian
      ? data.coGuardianState
      : undefined,
    coGuardianZipCode: data.hasCourtAppointedGuardian
      ? data.coGuardianZipCode
      : undefined,
    coGuardianPhone: data.hasCourtAppointedGuardian
      ? data.coGuardianPhone
      : undefined,
    coGuardianEmail: data.hasCourtAppointedGuardian
      ? data.coGuardianEmail
      : undefined,

    // 8. Child under 12?
    isChildUnder12: data.dateOfBirth
      ? deriveCurrentAge(new Date(data.dateOfBirth)) < 12
      : undefined,

    // 9. Legal parent 1 consents?
    isParent1AssentingTrue: data.isParent1Assenting === true,
    isParent1AssentingFalse: !data.isParent1Assenting,
    parent1DissentReason: !data.isParent1Assenting
      ? data.parent1DissentReason
      : undefined,

    // 10. Legal parent 2 consents?
    isParent2AssentingTrue: data.isParent2Assenting === true,
    isParent2AssentingFalse: !data.isParent2Assenting,
    parent2DissentReason: !data.isParent2Assenting
      ? data.parent2DissentReason
      : undefined,

    // 11. All court-appointed guardians consent?
    isAllGuardiansAssentingTrue: data.isAllGuardiansAssenting === true,
    isAllGuardiansAssentingFalse: !data.isAllGuardiansAssenting,
    hasNoCountAppointedGuardian: !data.hasCourtAppointedGuardian,
    guardianDissentReason: !data.isAllGuardiansAssenting
      ? data.guardianDissentReason
      : undefined,

    // 12. New name
    newFirstName: data.newFirstName,
    newMiddleName: data.newMiddleName,
    newLastName: data.newLastName,

    // 13. Reason for changing name
    reasonForChangingName: data.reasonForChangingName,

    // 14. Text-only

    // 15. Interpreters needed?
    isInterpreterNeededForChild: data.isInterpreterNeededForChild,
    isInterpreterNeededForParent1: data.isInterpreterNeededForParent1,
    isInterpreterNeededForParent2: data.isInterpreterNeededForParent2,
    isInterpreterNeededForGuardian: data.isInterpreterNeededForGuardian,
    languages:
      (data.isInterpreterNeededForChild ||
        data.isInterpreterNeededForParent1 ||
        data.isInterpreterNeededForParent2 ||
        data.isInterpreterNeededForGuardian) &&
      data.language
        ? languageNameMap[data.language].name
        : undefined,

    // 16. Okay to share pronouns?
    isOkayToSharePronouns: data.isOkayToSharePronouns,
    pronouns: data.isOkayToSharePronouns
      ? joinPronouns(data.pronouns, data.otherPronouns)
      : undefined,
  }),
});
