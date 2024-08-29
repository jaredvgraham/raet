export const calculateAge = (dob: string | Date): number => {
  const dateOfBirth = new Date(dob); // Convert to Date object if it's a string
  const diffMs = Date.now() - dateOfBirth.getTime();
  const ageDt = new Date(diffMs);

  return Math.abs(ageDt.getUTCFullYear() - 1970);
};
