export function formatStateList(stateNames: string[]): string {
  if (stateNames.length === 0) return "";
  if (stateNames.length === 1) return `<strong>${stateNames[0]}</strong>`;
  if (stateNames.length === 2)
    return `<strong>${stateNames[0]}</strong> and <strong>${stateNames[1]}</strong>`;

  const lastState = stateNames[stateNames.length - 1];
  const otherStates = stateNames.slice(0, -1);
  return `${otherStates.map((name) => `<strong>${name}</strong>`).join(", ")}, and <strong>${lastState}</strong>`;
}
