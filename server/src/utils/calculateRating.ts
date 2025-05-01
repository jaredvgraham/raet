export const calculateRating = (ratings: number[]) => {
  if (ratings.length === 0) {
    return 0;
  }

  const total = ratings.reduce((acc, rating) => acc + rating, 0);
  const average = total / ratings.length;

  return parseFloat(average.toFixed(1));
};
