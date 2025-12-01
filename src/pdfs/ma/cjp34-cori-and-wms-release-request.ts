import { definePdf } from "@/pdfs/utils/definePdf";
import { formatDateMMDDYYYY } from "@/utils/formatDateMMDDYYYY";
import { joinNames } from "@/utils/joinNames";
import pdf from "./cjp34-cori-and-wms-release-request.pdf";

export default definePdf({
  id: "cjp34-cori-and-wms-release-request",
  title: "Court Activity Record Request Form",
  code: "CJP-34",
  jurisdiction: "MA",
  pdfPath: pdf,
  fields: (data) => ({
    county: data.residenceCounty,
    caseName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    isChangeOfNameProceeding: true, // Constant
    oldName: joinNames(data.oldFirstName, data.oldMiddleName, data.oldLastName),
    dateOfBirth: formatDateMMDDYYYY(data.dateOfBirth),
    mothersMaidenName: data.mothersMaidenName,
    otherNamesOrAliases: data.otherNamesOrAliases,
  }),
});
