export const joinPronouns = (pronouns?: string[], otherPronouns?: string) => {
  const pronounList = Array.isArray(pronouns) ? pronouns : [];
  return [...pronounList, otherPronouns].filter(Boolean).join(", ");
};
