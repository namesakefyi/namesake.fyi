import { definePdf } from "~/forms/utils";
import { joinNames } from "~/utils/joinNames";
import pdf from "./affidavit-of-indigency.pdf";

export default definePdf({
  id: "affidavit-of-indigency",
  title: "Affidavit of Indigency",
  jurisdiction: "MA",
  pdfPath: pdf,
  fields: (data) => ({
    applicantName: joinNames(
      data.oldFirstName,
      data.oldMiddleName,
      data.oldLastName,
    ),
    residenceStreetAddress: data.residenceStreetAddress,
    residenceCity: data.residenceCity,
    residenceStateAndZip: `${data.residenceState} ${data.residenceZipCode}`,
  }),
});
