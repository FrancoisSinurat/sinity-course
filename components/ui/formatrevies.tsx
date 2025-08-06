export function formatTotalReviews(totalreviews: number): string {
  if (totalreviews >= 1_000_000) {
    return (totalreviews / 1_000_000).toFixed(1).replace(/\.0$/, '') + 'M';
  } else if (totalreviews >= 1_000) {
    return (totalreviews / 1_000).toFixed(1).replace(/\.0$/, '') + 'K';
  } else {
    return totalreviews.toString();
  }
}
