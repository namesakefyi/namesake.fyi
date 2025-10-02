import type {
  RoughAnnotationConfig,
  RoughAnnotationType,
} from "rough-notation/lib/model";

export function formatStateList(stateNames: string[]): string {
  if (stateNames.length === 0) return "";
  if (stateNames.length === 1) return `<strong>${stateNames[0]}</strong>`;
  if (stateNames.length === 2)
    return `<strong>${stateNames[0]}</strong> and <strong>${stateNames[1]}</strong>`;

  const lastState = stateNames[stateNames.length - 1];
  const otherStates = stateNames.slice(0, -1);
  return `${otherStates.map((name) => `<strong>${name}</strong>`).join(", ")}, and <strong>${lastState}</strong>`;
}

export const smartquotes = (str: string) => {
  return str
    .replace(/(^|[-\u2014\s(["])'/g, "$1\u2018") // opening singles
    .replace(/'/g, "\u2019") // closing singles & apostrophes
    .replace(/(^|[-\u2014/[(\u2018\s])"/g, "$1\u201c") // opening doubles
    .replace(/"/g, "\u201d") // closing doubles
    .replace(/--/g, "\u2014") // em-dashes
    .replace(/\.\.\./g, "\u2026"); // ellipses
};

export const annotationConfig: Record<
  RoughAnnotationType,
  Omit<RoughAnnotationConfig, "type">
> = {
  highlight: {
    multiline: true,
    iterations: 1,
    padding: 0,
  },
  underline: {
    multiline: true,
    iterations: 3,
    padding: 0,
  },
  box: {
    multiline: false,
    iterations: 3,
    padding: [0, 8, 0, 8],
  },
  bracket: {
    multiline: false,
    iterations: 1,
    padding: [0, 4, 0, 4],
    brackets: ["left", "right"],
  },
  circle: {
    multiline: false,
    iterations: 2,
    padding: [0, 16, 0, 16],
  },
  "strike-through": {
    multiline: true,
    iterations: 3,
    padding: 0,
  },
  "crossed-off": {
    multiline: false,
    iterations: 4,
    padding: 0,
  },
};
