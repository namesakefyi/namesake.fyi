import { definePdf } from "@/pdfs/utils/definePdf";
import { formatDateMMDDYYYY } from "@/utils/formatDateMMDDYYYY";
import { joinNames } from "@/utils/joinNames";
import pdf from "./cjp34-cori-and-wms-release-request.pdf";
import type { PdfFieldName } from "./schema";

export default definePdf<PdfFieldName>({
  id: "cjp34-cori-and-wms-release-request",
  title: "Court Activity Record Request Form",
  code: "CJP-34",
  jurisdiction: "MA",
  pdfPath: pdf,
  resolver: {
    county: (data) => data.residenceCounty,
    caseName: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    isChangeOfNameProceeding: () => true,
    oldName: (data) =>
      joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    dateOfBirth: (data) => formatDateMMDDYYYY(data.dateOfBirth),
    mothersMaidenName: (data) => data.mothersMaidenName,
    otherNamesOrAliases: (data) => data.otherNamesOrAliases,
  },
});
