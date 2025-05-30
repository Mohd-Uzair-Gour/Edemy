import { Webhook } from "svix";
import User from "../models/userModel.js";
import Stripe from "stripe";
import { Purchase } from "../models/purchaseModel.js";
import Course from "../models/courseModel.js";

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

//stripe webhooks
const stripeInstance = new Stripe(process.env.STRIPE_SECRET_KEY)
export const stripeWebhooks = async(request,response) => {
             const sig = request.headers['stripe-signature'];
             let event;
             try {
              event = Stripe.webhooks.constructEvent(request.body,sig,process.env.STRIPE_WEBHOOK_SECRET)
             } catch (error) {
              response.status(400).send(`Webhook Error:${error.message}`)
             }
             //handle event 
      switch (event.type) {
              case 'payment_intent.succeeded':{
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                const session = await stripeInstance.checkout.sessions.list({
                  payment_intent: paymentIntentId
                })
                const {purchaseId} =session.data[0].metadata;
                const purchaseData = await Purchase.findById(purchaseId)
                const userData = await User.findById(purchaseData.userId)
                const courseData = await Course.findById(purchaseData.courseId.toString())

                courseData.enrolledStudents.push(userData)
                await courseData.save()

                userData.enrolledCourses.push(courseData._id)
                await userData.save()

                purchaseData.status = 'completed'
                await purchaseData.save()
                break;
              }
              case 'payment_intent.payment_failed':{
                const paymentIntent = event.data.object;
                const paymentIntentId = paymentIntent.id;
                const session = await stripeInstance.checkout.sessions.list({
                  payment_intent: paymentIntentId
                })
                const {purchaseId} =session.data[0].metadata;
                const purchaseData = await Purchase.findById(purchaseId)
                purchaseData.status = 'failed'
                await purchaseData.save()
                break;
              }
              default:
                console.log(`Unhandled event type ${event.type}`);
             }
             response.json({received:true});
}