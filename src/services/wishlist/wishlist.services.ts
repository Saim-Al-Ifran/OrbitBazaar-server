import Wishlist from "../../models/Wishlist";

//  Add a product to the user's wishlist
export const addToWishlist = async (userEmail: string, productID: string) => {
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
export const getWishlist = async (userEmail: string) => {
    return await Wishlist.findOne({ userEmail }).populate("items.productID");
  };

// Remove a specific product from the wishlist
export const deleteWishlist = async (userEmail: string): Promise<void> => {
    await Wishlist.deleteOne({ userEmail });
};

// Clear the entire wishlist for a user
export const deleteAllWishlist= async (userEmail: string) => {
    return await Wishlist.findOneAndDelete({ userEmail });
};