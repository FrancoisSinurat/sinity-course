function formatTotalReviews(totalreviews: number): string {
    return totalreviews >= 1000 ? `${(totalreviews / 1000).toFixed(1)}k` : totalreviews.toString();
}
