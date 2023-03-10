import AWS from "aws-sdk";
import { nanoid } from "nanoid";
import Course from "../models/course";
import slugify from "slugify";
import { readFileSync } from "fs";

const awsConfig = {
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: process.env.AWS_REGION,
  apiVersion: process.env.AWS_API_VERSION,
};

const S3 = new AWS.S3(awsConfig);
export const uploadImage = async (req, res) => {
  // console.log(req.body);
  console.log("shubham");
  try {
    const { image } = req.body;
    if (!image) return res.status(400).send("No Image");

    //prepare the image

    const base64Data = new Buffer.from(
      image.replace(/^data:image\/\w+;base64,/, ""),
      "base64"
    );
    const type = image.split(";")[0].split("/")[1];

    const params = {
      Bucket: "learnmyway-bucket",
      Key: ` ${nanoid()}.${type}`,
      Body: base64Data,
      ACL: "public-read",
      ContentEncoding: "base64",
      ContentType: `image/${type}`,
    };

    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        return res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeImage = async (req, res) => {
  try {
    console.log("shubhajm");

    const { image } = req.body;
    console.log(image);
    const params = {
      Bucket: image.data.Bucket,

      Key: image.data.Key,
    };
    console.log(req.body.Bucket);
    console.log(req.body.Key);
    //send remove request to s3
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      res.send({ ok: true });
    });
  } catch (err) {
    console.log(err);
  }
};
//
export const create = async (req, res) => {
  // console.log("in controller create course,js");
  // console.log("create course", req.body);
  // return;
  // console.log(req);
  console.log(req.body.values.name);
  try {
    const alreadyExist = await Course.findOne({
      slug: slugify(req.body.values.name.toLowerCase()),
    });

    if (alreadyExist) return res.status(400).send("Title is taken");

    const course = await new Course({
      slug: slugify(req.body.values.name),
      instructor: req.auth._id,
      ...req.body.values,
      image: req.body.image.data,
    }).save();

    res.json(course);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Course create failed. Try again");
  }
};

export const read = async (req, res) => {
  try {
    const course = await Course.findOne({ slug: req.params.slug })
      .populate("instructor", "_id name")
      .exec();
    res.json(course);
  } catch (err) {
    console.log(err);
  }
};

export const uploadVideo = async (req, res) => {
  try {
    console.log("req.user._id", req.auth._id);
    console.log("req.params.instructorId::;", req.params.instructorId);

    if (req.auth._id != req.params.instructorId) {
      return res.status(400).send("Unauthoruzed");
    }
    const { video } = req.files;
    // console.log(video);
    if (!video) return res.status(400).send("No Video");

    const params = {
      Bucket: "learnmyway-bucket",
      Key: ` ${nanoid()}.${video.type.split("/")[1]}`, //split video/mp4 take mp4
      Body: readFileSync(video.path),
      ACL: "public-read",
      ContentType: video.type,
    };
    S3.upload(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send(data);
    });
  } catch (err) {
    console.log(err);
  }
};

export const removeVideo = async (req, res) => {
  try {
    if (req.auth._id != req.params.instructorId) {
      return res.status(400).send("Unauthorized");
    }
    const { Bucket, Key } = req.body;

    const params = {
      Bucket,
      Key, //split video/mp4 take mp4
    };
    S3.deleteObject(params, (err, data) => {
      if (err) {
        console.log(err);
        res.sendStatus(400);
      }
      console.log(data);
      res.send({ ok: true });
    });
  } catch (err) {
    console.log("direct error madhe");
    console.log(err);
  }
};

export const addLesson = async (req, res) => {
  try {
    console.log(req);
    const { slug, instructorId } = req.params;
    const { title, content, video } = req.body;
    console.log(title);
    console.log(typeof title);
    if (req.auth._id != instructorId) {
      return res.status(400).send("Unauthorized");
    }

    const updated = await Course.findOneAndUpdate(
      { slug },
      {
        $push: { lessons: { title, content, video, slug: slugify(title) } },
      },

      {
        new: true,
      }
    )
      .populate("instructor", "_id name")
      .exec();
    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send("Add Lesson failed");
  }
};

export const update = async (req, res) => {
  try {
    console.log("in update");
    const { slug } = req.params;
    console.log(slug);

    const course = await Course.findOne({ slug }).exec();
    console.log("course found =>> ", course);
    console.log(req.auth._id);
    console.log(req);
    if (req.auth._id != course.instructor) {
      return res.status(400).send("Unauthorized");
    }
    const updated = await Course.findOneAndUpdate({ slug }, req.body, {
      new: true,
    }).exec();

    res.json(updated);
  } catch (err) {
    console.log(err);
    return res.status(400).send(err.message);
  }
};
