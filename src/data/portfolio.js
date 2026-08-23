export const PORTFOLIO_CATEGORIES = [
  "Advertising",
  "Fashion",
  "Jewellery",
  "Art",
  "Food",
  "Movies",
  "Travel",
  "Calendar",
  "Personalities"
];

export const portfolioData = PORTFOLIO_CATEGORIES.map((category) => ({
  category,
  images: []
}));
