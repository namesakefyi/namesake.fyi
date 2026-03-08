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
  resolver: (data) => {
    const today = new Date().toLocaleDateString("en-US", {
      month: "2-digit",
      day: "2-digit",
      year: "numeric",
    });
    return {
      division: data.residenceCounty,
      division2: data.residenceCounty,
      petitionerName: joinNames(
        data.oldFirstName,
        data.oldMiddleName,
        data.oldLastName,
      ),
      motionFor: "Waive Publication for Name Change",
      motionFor2: joinNames(
        data.oldFirstName,
        data.oldMiddleName,
        data.oldLastName,
      ),
      date: today,
      currentLegalName: joinNames(
        data.oldFirstName,
        data.oldMiddleName,
        data.oldLastName,
      ),
      petitioner: true,
      request: data.reasonToWaivePublication,
      printName: joinNames(
        data.oldFirstName,
        data.oldMiddleName,
        data.oldLastName,
      ),
      residenceStreetAddress: data.residenceStreetAddress,
      residenceCity: data.residenceCity,
      residenceState: data.residenceState,
      residenceZip: data.residenceZipCode,
      phoneNumber: data.phoneNumber,
      motionForPageTwo: "Waive Publication for Name Change",
      dated: today,
    };
  },
});
