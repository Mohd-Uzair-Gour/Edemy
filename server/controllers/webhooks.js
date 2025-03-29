import { Webhook } from "svix";
import User from "../models/userModel.js";

// Api Controller function to manage Clerk User with database
export const clerkWebhooks = async (req, res) => {
  try {
    console.log("✅ Webhook Request Received:", req.body); // Debugging log

    const Whook = new Webhook(process.env.CLERK_WEBHOOK_SECRET);
    await Whook.verify(JSON.stringify(req.body), {
      "svix-id": req.headers["svix-id"],
      "svix-timestamp": req.headers["svix-timestamp"],  // ✅ Fix Typo
      "svix-signature": req.headers["svix-signature"],
    });

    const { data, type } = req.body;
    console.log("✅ Webhook Type:", type);

    switch (type) {
      case "user.created": {
        const userData = {
          _id: data.id,
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        console.log("✅ Creating User in Database:", userData);
        const newUser = await User.create(userData);
        console.log("✅ User Created Successfully:", newUser);

        return res.json({ success: true, message: "User Created" });  // ✅ Fix Json() to json()
      }

      case "user.updated": {
        const userData = {
          email: data.email_addresses[0].email_address,
          name: `${data.first_name} ${data.last_name}`,
          imageUrl: data.image_url,
        };

        console.log("✅ Updating User:", data.id);
        const updatedUser = await User.findByIdAndUpdate(data.id, userData, { new: true });
        console.log("✅ User Updated Successfully:", updatedUser);

        return res.json({ success: true, message: "User Updated" });
      }

      case "user.deleted": {
        console.log("✅ Deleting User:", data.id);
        await User.findByIdAndDelete(data.id);
        console.log("✅ User Deleted Successfully");

        return res.json({ success: true, message: "User Deleted" });
      }

      default:
        console.log("❌ Unknown Webhook Type:", type);
        return res.status(400).json({ success: false, message: "Unknown Event Type" });
    }
  } catch (error) {
    console.error("❌ Webhook Error:", error);
    return res.status(500).json({ success: false, message: error.message });
  }
};
