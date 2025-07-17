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
export const createReview = async (
  userEmail: string,
  userId: string,
  productID: string,
  rating: number,
  comment: string
) => {
  // Check if user purchased the product
  const hasPurchased = await Order.findOne({
    userEmail:userEmail,
    'items.productID': productID,
  });

  if (!hasPurchased) {
    throw new CustomError('You can only review products you have purchased.', 403);
  }

  // Check if user already reviewed the product
  const existingReview = await Review.exists({ user: userId, productID });
  if (existingReview) {
    throw new CustomError('You have already reviewed this product', 400);
  }

  // Create review
  const review = await Review.create({
    productID,
    user: userId,
    rating,
    comment,
  });

  // Update product rating
  await recalculateProductRating(productID);

  return review;
};

//  Updates an existing review.
export const updateReview = async (
  reviewID: string,
  userId: string,
  updatedData: { rating?: number; comment?: string }
) => {
  const review = await Review.findOneAndUpdate(
    { _id: reviewID, user: userId },
    updatedData,
    { new: true }
  );

  if (!review) {
    throw new CustomError('Review not found', 403);
  }

  // Recalculate product rating after the update
  await recalculateProductRating(review.productID.toString());

  return review;
};


// Deletes a user's review by ID.
export const deleteReviewInDb = async (reviewID: string, userId: string) => {
  const review = await Review.findOneAndDelete({ _id: reviewID, user: userId });

  if (!review) {
    throw new CustomError('Review not found', 403);
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
  userId: string ,
  page: number,
  limit: number,
  sortField: string = 'createdAt',
  sortOrder: string = 'dsc'
) => {
  const sort = { [sortField]: sortOrder === 'asc' ? 1 : -1 };

  return await paginate(
    Review,
    { user: userId },
    page,
    limit,
    sort,
    'rating comment createdAt',
    {
      path: 'productID',
      select: 'name images'
    }
  );
};



export const findUserReview = async (userId: string, reviewId: string) => {
  return await Review.findOne({ user: userId, _id: reviewId })
                     .select('rating comment createdAt productID')
                     .populate('productID', 'name images');                 
};

export const getReviewIdsByUser = async (userId: string): Promise<string[]> => {
    const reviews = await Review.find({ user: userId }).select('productID');
    const productIds = reviews.map((review) => review.productID.toString());

    // Remove duplicates
    return [...new Set(productIds)];
};