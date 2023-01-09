export type Product = {
  id: string;
  title: string;
  imageUrl: string;
  price: string;
  description: string;
  reviews: {
    name: string;
    pictureUrl: string;
    rating: string;
    reviewTitle: string;
    review: string;
  }[];
};
