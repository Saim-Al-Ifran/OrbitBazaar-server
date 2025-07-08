import Stripe from "stripe";
import { stripeSecretKey } from "../../secret";
import { TryCatch } from "../../middlewares/TryCatch";
import { NextFunction, Request, Response } from "express";
import CustomError from "../../utils/errors/customError";

const stripe = new Stripe(stripeSecretKey as string);

export const createPaymentIntent = TryCatch(
  async (req: Request, res: Response, _next: NextFunction) => {
    const { price } = req.body;
    if (!price || isNaN(Number(price))) {
      throw new CustomError("Invalid price",404);
    }
    const amount = Math.round(parseFloat(price) * 100); 
    const paymentIntent = await stripe.paymentIntents.create({
      amount,
      currency: "usd",
      payment_method_types: ["card"],
    });

    res.status(200).send({
      clientSecret: paymentIntent.client_secret,
    });
  }
);