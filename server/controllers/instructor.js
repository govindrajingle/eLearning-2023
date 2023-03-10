import User from "../models/user";
import Course from "../models/course";

const stripe = require("stripe")(process.env.STRIPE_SECRET);
//import queryString from "query-string";

export const makeInstructor = async (req, res) => {
  console.log("itheydfgd");
  try {
    //1 find user from db
    const user = await User.findById(req.auth._id).exec();
    console.log(user);

    //2 if user dont have stripe_account_id yet then create new
    if (!user.stripe_account_id) {
      const account = await stripe.accounts.create({ type: "standard" });
      console.log("ACCOUNT", account.id);
      user.stripe_account_id = account.id;
      user.save();
    }
    console.log("user saved");
    // 3 create account link based upon account id (for frntenf to complete onboarding)
    let accountLink = await stripe.accountLinks.create({
      account: user.stripe_account_id,
      refresh_url: process.env.STRIPE_REDIRECT_URL,
      return_url: process.env.STRIPE_REDIRECT_URL,
      type: "account_onboarding",
    });
    console.log(accountLink);
    //4 pre fill any info such as email {optional}
    accountLink = Object.assign(accountLink, {
      "stripe_user[email]": user.email,
    });
    //5 then send link accpunt link to respoinse to frontend
    // res.send({ ok: true });

    res.send(`${accountLink.url}?${queryString.stringify(accountLink)}`);
  } catch (err) {
    console.log(err);
    console.log("make instructor error");
  }
};

export const getAccountStatus = async (req, res) => {
  try {
    const user = await User.findById(req.auth._id).exec();
    const account = await stripe.accounts.retrive(user.ripe_account_id);

    console.log("Account", account);
    if (!account.charges_enabled) {
      return res.status(401).send("Unauthorized");
    } else {
      const statusUpdated = await User.findByIdAndUpdate(
        user._id,
        {
          stripe_seller: account,
          $addToSet: { role: "Instructor" },
        },
        { new: true }
      )
        .select("-password")
        .exec();
      // statusUpdated.password =undefined
      res.json(statusUpdated);
    }
  } catch (err) {
    console.log(err);
  }
};

export const currentInstructor = async (req, res) => {
  try {
    let user = await User.findById(req.auth._id).select("-password").exec();
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      res.json({ ok: true });
    }
  } catch (err) {
    console.log(err);
  }
};
export const instructorCourses = async (req, res) => {
  try {
    const courses = await Course.find({ instructor: req.auth._id })
      .sort({ createdAt: -1 })
      .exec();

    res.json(courses);
  } catch (err) {
    console.log(err);
  }
};
