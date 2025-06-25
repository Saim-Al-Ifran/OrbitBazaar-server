import Wishlist from "../../models/Wishlist";

//  Add a product to the user's wishlist
export const createWishlist = async (userEmail: string, productID: string) => {
    let wishlist = await Wishlist.findOne({ userEmail });
  
    if (!wishlist) {
      wishlist = new Wishlist({ userEmail, items: [{ productID }] });
    } else {
      if (wishlist.items.some((item) => item.productID.toString() === productID)) {
        throw new Error("Product already in wishlist");
      }
      wishlist.items.push({
          productID,
          addedAt:  new Date(),
      });
    }
    return await wishlist.save();
  };

// Get all wishlist items for a user
export const findWishlist = async (userEmail: string) => {
  return await Wishlist.findOne({ userEmail }).populate({
    path: "items.productID",
    select: "price images name",  
  });
};


// Remove a specific product from the wishlist
export const deleteProductFromWishlist = async (userEmail: string, productId: string) => {
  const wishlist = await Wishlist.findOne({ userEmail });

  if (!wishlist) {
      throw new Error("Wishlist not found");
  }

  wishlist.items = wishlist.items.filter((item) => item.productID.toString() !== productId);

  return await wishlist.save();
};


// Clear the entire wishlist for a user
export const deleteAllWishlist= async (userEmail: string) => {
    return await Wishlist.findOneAndDelete({ userEmail });
};