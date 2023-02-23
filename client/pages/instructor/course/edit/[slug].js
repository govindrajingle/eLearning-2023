import { useState, useEffect } from "react";
import InstructorRoute from "../../../../components/routes/InstructorRoute";
import axios from "axios";
import CourseCreateForm from "../../../../components/forms/CourseCreateForm";
import Resizer from "react-image-file-resizer";
import { toast } from "react-toastify";

import { useRouter } from "next/router";

const CourseEdit = () => {
  //state
  const [values, setValues] = useState({
    name: "",
    description: "",
    price: "100",
    uploading: false,
    paid: true,
    Category: "",
    loading: false,
  });
  const [image, setImage] = useState({});
  const [preview, setPreview] = useState("");
  const [uploadButtonText, setUploadButtonText] = useState("Upload Image");

  const router = useRouter();
  const { slug } = router.query;
  useEffect(() => {
    loadCourse();
  }, [slug]);

  const loadCourse = async () => {
    console.log("in load course");
    const { data } = await axios.get(`/api/course/${slug}`);
    console.log("data is your", data);
    setValues(data);

    if (data && data.image) {
      setImage(data.image);
    }
  };

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleImage = (e) => {
    let file = e.target.files[0];

    setPreview(window.URL.createObjectURL(file));
    setUploadButtonText(file.name);
    setValues({ ...values, loading: true });

    //resize
    Resizer.imageFileResizer(file, 720, 500, "JPEG", 100, 0, async (uri) => {
      try {
        console.log("image rezie");
        let data = await axios.post("/api/course/upload-image", {
          image: uri,
        });
        console.log("Image Uploaded", data);

        //set image in the state
        setImage(data);
        setValues({ ...values, loading: false });
      } catch (err) {
        console.log("ithe aala");
        console.log(err);
        setValues({ ...values, loading: false });
        toast.error("Image upload failed, later");
      }
    });
  };

  const handleImageRemove = async () => {
    console.log("REMOVE IMAGE");
    try {
      setValues({ ...values, loading: true });
      const res = await axios.post("/api/course/remove-image", { image });
      console.log(res);
      setImage({});
      setPreview();
      setUploadButtonText("Upload Image");
      setValues({ ...values, loading: false });
    } catch (err) {
      setValues({ ...values, loading: false });
      console.log(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      console.log("in handle submit");

      const { data } = await axios.put(`/api/course/${slug}`, {
        ...values,
        image,
      });
      console.log(data);
      console.log(image);
      console.log("below handle submit");
      toast.success("Course Updated");
      console.log("ka route hot nhiy");
      //   router.push("/instructor");
    } catch (err) {
      // toast.error("hihhdhfibfn");
      toast.error(err.response.data);
    }
  };

  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Update Course</h1>
      {/* {JSON.stringify(values)} */}

      <div className="pt-3 pb-3">
        <CourseCreateForm
          handleSubmit={handleSubmit}
          handleImage={handleImage}
          handleChange={handleChange}
          values={values}
          setValues={setValues}
          preview={preview}
          uploadButtonText={uploadButtonText}
          handleImageRemove={handleImageRemove}
          editPage={true}
        />
      </div>
    </InstructorRoute>
  );
};

export default CourseEdit;
