import Order from "../../models/Order";
import Product from "../../models/Product";
import Review from "../../models/Review";
import CustomError from "../../utils/errors/customError";
import paginate from "../../utils/paginate";

// utitly function to calculate rating
export const recalculateProductRating = async (productID: string) => { 
  const reviews = await Review.find({ productID });

  const totalRating = reviews.reduce((sum, review) => sum + review.rating, 0);
  const averageRating = reviews.length ? totalRating / reviews.length : 0;
  const ratingCount = reviews.length;  

  await Product.findByIdAndUpdate(productID, { 
      ratings: { 
          average: averageRating, 
          count: ratingCount 
      }
  });
};


// added review 
export const createReview = async (userEmail: string, productID: string, rating: number, comment: string) => {
  const hasPurchased = await Order.findOne({
    userEmail,
    'items.productID': productID,
  });
  const existingReview = await Review.exists({ userEmail, productID });
  if(existingReview){
    throw new CustomError('You have already reviewed this product', 400);
  }
  
  if (!hasPurchased) {
    throw new CustomError('You can only review products you have purchased.', 403);
  }


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
      throw new CustomError('Review not found', 403);
    }
  
    // Recalculate product rating after the update
    await recalculateProductRating(review.productID.toString());
  
    return review;
  };

// Deletes a user's review by ID.
export const deleteReviewInDb = async (reviewID: string, userEmail: string) => {
    const review = await Review.findOneAndDelete({ _id: reviewID, userEmail });
  
    if (!review) {
      throw new CustomError('Review not found  ', 403);
    }
  
    // Recalculate product rating after deletion
    await recalculateProductRating(review.productID.toString());
  
    return review;
  };

// Retrieves all reviews for a specific product.
 
export const findProductReviews = async (
  productID: string,
  page: number,
  limit: number,
  sortField = 'createdAt',
  sortOrder = 'dsc'
) => {
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };
 
  return await paginate(
    Review,
    { productID },
    page,
    limit,
    sort,
    'rating comment createdAt user', 
     {
      path: 'user',
      select: 'name email image', 
     }
  );

};

// Retrieves all reviews by a specific user.
export const findUserReviews = async (
  userEmail: string,
  page: number,
  limit: number,
  sortField: string = 'createdAt',
  sortOrder: string = 'dsc'
) => {
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  return await paginate(Review, { userEmail }, page, limit, sort, 'rating comment createdAt');
};

export const findUserReview = async(userEmail:string,reviewId:string) =>{
  return await Review.findOne({userEmail, _id: reviewId});
}