import { useState, useEffect } from "react";
import axios from "axios";
import InstructorRoute from "../../components/routes/InstructorRoute";
import { Avatar } from "antd";
import Link from "next/link";
import { CheckCircleOutlined, CloseCircleOutlined } from "@ant-design/icons";

const InstructorIndex = () => {
  const [courses, setCourses] = useState([]);

  useEffect(() => {
    loadCourses();
  }, []);

  const loadCourses = async () => {
    const { data } = await axios.get("/api/instructor-courses");
    setCourses(data);
  };
  const myStyle = { marginTop: "-15px", fontSize: "10px" };
  return (
    <InstructorRoute>
      <h1 className="jumbotron text-center square">Instructor dashboard</h1>
      {/* {courses.map((course) => {
        <h1>{course}</h1>;
      })}
      <Link href={`/instructor/course/view/node-js`}>
        <h1>click here for node js</h1>
      </Link> */}

      {courses &&
        courses.map((course) => {
          return (
            <div className="media pt-2">
              <Avatar
                size={80}
                src={course.image ? course.image.Location : "/course.png"}
              />

              <div className="media-body pt-2">
                <div className="row">
                  <div className="col">
                    <Link
                      href={`/instructor/course/view/${course.slug}`}
                      className="pointer"
                    >
                      <h5 className="pt-2">{course.name}</h5>
                    </Link>
                    <p style={{ marginTop: "-10px" }}>
                      {course.lessons.length} Lessons
                    </p>
                    {course.lessons.length < 5 ? (
                      <p style={myStyle} className="text-danger">
                        At least 5 lessons are required to publish a course
                      </p>
                    ) : course.published ? (
                      <p style={myStyle} className="text-success">
                        Your Course is live on LEARN-MY-WAY
                      </p>
                    ) : (
                      <p style={myStyle} className="text-success">
                        Your Course is ready to be published
                      </p>
                    )}
                  </div>

                  <div className="col-md-3 mt-3 text-center">
                    {course.published ? (
                      <div>
                        <CheckCircleOutlined className="h5 pointer text-success" />
                      </div>
                    ) : (
                      <div>
                        <CloseCircleOutlined className="h5 pointer text-danger" />
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
    </InstructorRoute>
  );
};

export default InstructorIndex;
