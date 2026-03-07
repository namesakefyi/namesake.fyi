import { definePdf } from "@/pdfs/utils/definePdf";
import { joinNames } from "@/utils/joinNames";
import pdf from "./affidavit-of-indigency.pdf";
import type { PdfFieldName } from "./affidavit-of-indigency.types";

export default definePdf<PdfFieldName>({
  id: "affidavit-of-indigency",
  title: "Affidavit of Indigency",
  jurisdiction: "MA",
  pdfPath: pdf,
  fieldValueResolvers: {
    applicantName: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    residenceStreetAddress: (data) => data.residenceStreetAddress,
    residenceCity: (data) => data.residenceCity,
    residenceStateAndZip: (data) =>
      `${data.residenceState} ${data.residenceZipCode}`,
  },
});
