import { ComboBoxField } from "@/components/react/forms/ComboBoxField";
import { FormStep } from "@/components/react/forms/FormStep";
import { RadioGroupField } from "@/components/react/forms/RadioGroupField";
import type { Step } from "@/forms/types";

const NY_COUNTIES = [
  "Albany",
  "Allegany",
  "Bronx",
  "Broome",
  "Cattaraugus",
  "Cayuga",
  "Chautauqua",
  "Chemung",
  "Chenango",
  "Clinton",
  "Columbia",
  "Cortland",
  "Delaware",
  "Dutchess",
  "Erie",
  "Essex",
  "Franklin",
  "Fulton",
  "Genesee",
  "Greene",
  "Hamilton",
  "Herkimer",
  "Jefferson",
  "Kings",
  "Lewis",
  "Livingston",
  "Madison",
  "Monroe",
  "Montgomery",
  "Nassau",
  "New York",
  "Niagara",
  "Oneida",
  "Onondaga",
  "Ontario",
  "Orange",
  "Orleans",
  "Oswego",
  "Otsego",
  "Putnam",
  "Queens",
  "Rensselaer",
  "Richmond",
  "Rockland",
  "Saratoga",
  "Schenectady",
  "Schoharie",
  "Schuyler",
  "Seneca",
  "St. Lawrence",
  "Steuben",
  "Suffolk",
  "Sullivan",
  "Tioga",
  "Tompkins",
  "Ulster",
  "Warren",
  "Washington",
  "Wayne",
  "Westchester",
  "Wyoming",
  "Yates",
];

export const courtSelectionStep: Step = {
  id: "court-selection",
  title: "Which court are you filing in?",
  description: "File in the county where you live.",
  fields: ["courtType", "courtCounty"],
  component: ({ stepConfig }) => (
    <FormStep stepConfig={stepConfig}>
      <RadioGroupField
        name="courtType"
        label="Court type"
        options={[
          { label: "Supreme Court", value: "Supreme" },
          { label: "County Court", value: "County" },
          { label: "New York City Civil Court", value: "New York City Civil" },
        ]}
      />
      <ComboBoxField
        name="courtCounty"
        label="County"
        options={NY_COUNTIES.map((county) => ({
          label: county,
          value: county,
        }))}
      />
    </FormStep>
  ),
};
