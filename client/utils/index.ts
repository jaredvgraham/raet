export const formatError = (error: any) => {
  return error.toString().split(":")[1];
};
