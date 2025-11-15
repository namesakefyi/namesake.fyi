import { CreditCardIcon } from "@sanity/icons";
import type { ReferenceDefinition } from "sanity";

export const costsBlock: ReferenceDefinition = {
  type: "reference",
  name: "costs",
  title: "Costs",
  icon: CreditCardIcon,
  to: [
    {
      type: "guide",
    },
  ],
  options: {
    disableNew: true,
  },
};
