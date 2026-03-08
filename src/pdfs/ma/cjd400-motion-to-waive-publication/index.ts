import { definePdf } from "@/pdfs/utils/definePdf";
import { joinNames } from "@/utils/joinNames";
import pdf from "./cjd400-motion-to-waive-publication.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjd400-motion-to-waive-publication",
  title: "Motion to Waive Publication",
  code: "CJD-400",
  jurisdiction: "MA",
  pdfPath: pdf,
  fieldValueResolvers: {
    division: (data) => data.residenceCounty,
    division2: (data) => data.residenceCounty,
    petitionerName: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    motionFor: () => "Waive Publication for Name Change",
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
    request: (data) => data.reasonToWaivePublication,
    printName: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    residenceStreetAddress: (data) => data.residenceStreetAddress,
    residenceCity: (data) => data.residenceCity,
    residenceState: (data) => data.residenceState,
    residenceZip: (data) => data.residenceZipCode,
    phoneNumber: (data) => data.phoneNumber,
    motionForPageTwo: () => "Waive Publication for Name Change",
    dated: () =>
      new Date().toLocaleDateString("en-US", {
        month: "2-digit",
        day: "2-digit",
        year: "numeric",
      }),
  },
});
