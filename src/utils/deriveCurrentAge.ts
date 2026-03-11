export const deriveCurrentAge = (dateOfBirth: Date) => {
  const today = new Date();
  const birthDate = new Date(dateOfBirth);
  return today.getFullYear() - birthDate.getFullYear();
};
