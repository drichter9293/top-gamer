export const computeQ = (rating: number): number => {
  return Math.pow(10, rating / 400);
};
