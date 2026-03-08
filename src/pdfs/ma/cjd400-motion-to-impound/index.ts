import { definePdf } from "@/pdfs/utils/definePdf";
import { joinNames } from "@/utils/joinNames";
import pdf from "./cjd400-motion-to-impound.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjd400-motion-to-impound-records",
  title: "Motion to Impound Records",
  code: "CJD-400",
  jurisdiction: "MA",
  pdfPath: pdf,
  fieldValueResolvers: {
    division: (data) => data.residenceCounty,
    division2: (data) => data.residenceCounty,
    petitionerName: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    motionFor: () => "Impound Entire Case",
    motionFor2: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    date: () =>
      new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
    currentLegalName: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    petitioner: () => true,
    request: (data) => data.reasonToImpoundCourtRecords,
    printName: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    residenceStreetAddress: (data) => data.residenceStreetAddress,
    residenceCity: (data) => data.residenceCity,
    residenceState: (data) => data.residenceState,
    residenceZip: (data) => data.residenceZipCode,
    phoneNumber: (data) => data.phoneNumber,
    motionForPageTwo: () => "Impound Entire Case",
    dated: () =>
      new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
  },
});
