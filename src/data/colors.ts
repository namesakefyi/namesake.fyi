type Color = {
  name: string;
  slug: string;
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
    slug: "purple",
    hex: "#CDA5EF",
  },
  pink: {
    name: "Pastel Pink",
    slug: "pink",
    hex: "#ECADD4",
  },
  blue: {
    name: "Pastel Blue",
    slug: "blue",
    hex: "#96C7F2",
  },
  yellow: {
    name: "Pastel Yellow",
    slug: "yellow",
    hex: "#ECDD85",
  },
  green: {
    name: "Pastel Green",
    slug: "green",
    hex: "#97CF9C",
  },
  brown: {
    name: "Pastel Brown",
    slug: "brown",
    hex: "#DDB896",
  },
  black: {
    name: "Photocopy Black",
    slug: "black",
    hex: "#111111",
    forText: true,
  },
  white: {
    name: "Photocopy White",
    slug: "white",
    hex: "#E1E1E1",
    forText: true,
  },
};
