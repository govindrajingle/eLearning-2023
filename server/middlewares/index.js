import UserNav from "../../client/components/nav/UserNav";
import User from "../models/user";

var { expressjwt: jwt } = require("express-jwt");

export const requireSignin = jwt({
  getToken: (req, res) => req.cookies.token,
  secret: process.env.JWT_SECRET,

  algorithms: ["HS256"],
});

// default requireSignin;

export const isInstructor = async (req, res, next) => {
  try {
    console.log("in isinstructor");
    const user = await User.findById(req.auth._id).exec();
    console.log(user);
    if (!user.role.includes("Instructor")) {
      return res.sendStatus(403);
    } else {
      next();
    }
    // if (user === null) {
    //   return res.sendStatus(403);
    // } else {
    //   next();
    // }
    console.log("end isinstructor");
  } catch (err) {
    console.log(err);
  }
};
