import { Request, Response, NextFunction } from "express";
import User from "../models/userModel";
import { clerkClient, RequireAuthProp } from "@clerk/clerk-sdk-node";
import { ClerkClient } from "@clerk/clerk-sdk-node";
import { verifyAppleReceipt } from "../utils/apple";

// Controller
export const verifyPurchase = async (
  req: RequireAuthProp<Request>,
  res: Response,
  next: NextFunction
) => {
  const { userId } = req.auth;
  const user = await User.findOne({ clerkId: userId });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  const { platform, receipt } = req.body;

  if (!platform || !receipt) {
    return res.status(400).json({ success: false, message: "Missing data" });
  }

  try {
    if (platform === "ios") {
      const result = await verifyAppleReceipt(receipt);

      if (result.status === 0 && result.latest_receipt_info?.length) {
        const latest =
          result.latest_receipt_info[result.latest_receipt_info.length - 1];

        const actualProductId = latest.product_id;
        const expiresDateMs = parseInt(latest.expires_date_ms || "0", 10);
        const isExpired = Date.now() > expiresDateMs;

        if (!isExpired) {
          // Update user model with subscription info
          user.subscription = {
            productId: actualProductId,
            expiresAt: new Date(expiresDateMs),
            platform: "ios",
            originalTransactionId: latest.original_transaction_id,
          };

          await user.save();

          // Update Clerk user metadata

          await clerkClient.users.updateUser(userId, {
            publicMetadata: {
              plan: actualProductId,
            },
          });

          return res.json({ success: true, productId: actualProductId });
        } else {
          return res
            .status(400)
            .json({ success: false, message: "Subscription expired" });
        }
      }

      return res
        .status(400)
        .json({ success: false, message: "Invalid iOS receipt" });
    } else {
      return res
        .status(400)
        .json({ success: false, message: "Unsupported platform" });
    }
  } catch (error) {
    console.error("IAP verification error", error);
    return res.status(500).json({ success: false });
  }
};

export const handleAppStoreNotification = async (
  req: Request,
  res: Response
) => {
  try {
    const notification = req.body;
    console.log(
      "📬 Apple Notification Received:",
      JSON.stringify(notification, null, 2)
    );

    const { notificationType, data } = notification;

    const originalTransactionId = data?.originalTransactionId;
    const productId = data?.autoRenewProductId || data?.productId;
    const isAutoRenew = data?.autoRenewStatus === 1;
    const expiresDateMs = Number(data?.expiresDate);
    const expiresAt = isNaN(expiresDateMs)
      ? undefined
      : new Date(expiresDateMs);

    if (!originalTransactionId || !productId) {
      return res.status(400).json({ message: "Missing transaction data" });
    }

    const user = await User.findOne({
      "subscription.originalTransactionId": originalTransactionId,
    });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    switch (notificationType) {
      case "DID_CHANGE_RENEWAL_PREF":
      case "DID_CHANGE_RENEWAL_STATUS":
      case "INTERACTIVE_RENEWAL":
      case "DID_RENEW":
        user.subscription = {
          ...user.subscription,
          productId,
          expiresAt,
          platform: "ios",
          originalTransactionId,
        };

        await clerkClient.users.updateUserMetadata(user.clerkId, {
          publicMetadata: {
            plan: productId,
          },
        });
        break;

      case "CANCEL":
      case "EXPIRED":
        user.subscription = {
          ...user.subscription,
          productId: "none",
          expiresAt: new Date(), // cancel immediately
          platform: "ios",
          originalTransactionId,
        };
        clerkClient.users.updateUser(user.clerkId, {
          publicMetadata: {
            plan: "none",
          },
        });
        break;

      case "DID_CHANGE_RENEWAL_PREF":
      case "DID_CHANGE_RENEWAL_STATUS":
        // Optionally track auto-renew status here if you add it to your schema
        break;

      default:
        console.log("⚠️ Unhandled notification type:", notificationType);
    }

    await user.save();
    return res.status(200).json({ success: true });
  } catch (error) {
    console.error("❌ App Store Notification Error:", error);
    return res.status(500).json({ success: false });
  }
};
