import express from "express";
import formidable from "express-formidable"; // npm i express-formidable
const router = express.Router();

//controllers
import { isInstructor, requireSignin } from "../middlewares";

import {
  uploadImage,
  removeImage,
  create,
  read,
  uploadVideo,
  removeVideo,
  addLesson,
  update,
} from "../controllers/course";
//image
router.post("/course/upload-image", uploadImage);
router.post("/course/remove-image", removeImage);
// course
router.post("/course", requireSignin, isInstructor, create);
router.put("/course/:slug", requireSignin, update);
router.get("/course/:slug", read);
router.post(
  "/course/video-upload/:instructorId",
  requireSignin,
  formidable(),
  uploadVideo
);
router.post("/course/video-remove/:instructorId", requireSignin, removeVideo);

router.post("/course/lesson/:slug/:instructorId", requireSignin, addLesson);
module.exports = router;
