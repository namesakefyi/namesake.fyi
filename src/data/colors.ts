type Color = {
  name: string;
  hex: string;
  forText?: boolean;
};

export type NamesakeColor =
  | "purple"
  | "pink"
  | "blue"
  | "yellow"
  | "green"
  | "brown"
  | "black"
  | "white";

export const colors: Record<NamesakeColor, Color> = {
  purple: {
    name: "Namesake Purple",
    hex: "#CDA5EF",
  },
  pink: {
    name: "Pastel Pink",
    hex: "#ECADD4",
  },
  blue: {
    name: "Pastel Blue",
    hex: "#96C7F2",
  },
  yellow: {
    name: "Pastel Yellow",
    hex: "#ECDD85",
  },
  green: {
    name: "Pastel Green",
    hex: "#97CF9C",
  },
  brown: {
    name: "Pastel Brown",
    hex: "#DDB896",
  },
  black: {
    name: "Photocopy Black",
    hex: "#111111",
    forText: true,
  },
  white: {
    name: "Photocopy White",
    hex: "#F1F1F1",
    forText: true,
  },
};
