import Order from "../../models/Order";
import Product from "../../models/Product";
import Review from "../../models/Review";
import CustomError from "../../utils/errors/customError";

// utitly function to calculate rating
export const recalculateProductRating = async (productID: string) => {
    const reviews = await Review.find({ productID });
  
    const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
    const averageRating = reviews.length ? totalRating / reviews.length : 0;
  
    await Product.findByIdAndUpdate(productID, { rating: averageRating });
};

// added review 
export const createReview = async (userEmail: string, productID: string, rating: number, comment: string) => {
  const hasPurchased = await Order.findOne({
    userEmail,
    'items.productID': productID,
  });
  console.log(productID);
  
  if (!hasPurchased) {
    throw new CustomError('You can only review products you have purchased.', 403);
  }

  // Create a new review
  const review = await Review.create({
    productID,
    userEmail,
    rating,
    comment,
  });

  // Recalculate and update product's overall rating
  await recalculateProductRating(productID);

  return review;
};

//  Updates an existing review.
export const updateReview = async (reviewID: string, userEmail: string, updatedData: { rating?: number; comment?: string }) => {
    const review = await Review.findOneAndUpdate({ _id: reviewID, userEmail }, updatedData, { new: true });
  
    if (!review) {
      throw new CustomError('Review not found or unauthorized.', 403);
    }
  
    // Recalculate product rating after the update
    await recalculateProductRating(review.productID.toString());
  
    return review;
  };

// Deletes a user's review by ID.
  export const deleteReviewInDb = async (reviewID: string, userEmail: string) => {
    const review = await Review.findOneAndDelete({ _id: reviewID, userEmail });
  
    if (!review) {
      throw new CustomError('Review not found or unauthorized.', 403);
    }
  
    // Recalculate product rating after deletion
    await recalculateProductRating(review.productID.toString());
  
    return review;
  };

// Retrieves all reviews for a specific product.
  export const findProductReviews = async (productID: string) => {
    return await Review.find({ productID }).select('rating comment createdAt');
  };

// Retrieves all reviews by a specific user.
  export const findUserReviews = async (userEmail: string) => {
    return await Review.find({ userEmail });
  };
  