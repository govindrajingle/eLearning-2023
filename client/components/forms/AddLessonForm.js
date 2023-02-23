import { Button, Progress, Tooltip } from "antd";
import { CloseCircleFilled } from "@ant-design/icons";
const AddLessonForm = ({
  values,
  setValues,
  handleAddLesson,
  uploading,
  uploadButtonText,
  handleVideo,
  progress,
  handleVideoRemove,
}) => {
  return (
    <div className="container pt-3">
      <form onSubmit={handleAddLesson}>
        <textarea
          className="form-control mt-3"
          cols="1"
          rows="1"
          onChange={(e) => setValues({ ...values, title: e.target.value })}
          values={values.title}
          placeholder="Title"
        ></textarea>
        <textarea
          className="form-control mt-3"
          cols="7"
          rows="7"
          onChange={(e) => setValues({ ...values, content: e.target.value })}
          values={values.content}
          placeholder="Content"
        ></textarea>
        <div className="d-flex justify-content-center">
          <div className="d-grid gap-2">
            <label className="btn btn-dark btn-dark text-left mt-3">
              {uploadButtonText}
              <input
                onChange={handleVideo}
                type="file"
                accept="video/*"
                hidden
              />
            </label>
          </div>
          {!uploading && values.video && values.video.Location && (
            <Tooltip title="Remove">
              <span onClick={handleVideoRemove} className="pt-1 pl-3">
                <CloseCircleFilled className="text-danger d-flex justify-content-center pt-4 pointer" />
              </span>
            </Tooltip>
          )}
        </div>

        {progress > 0 && (
          <Progress
            className="d-flex justify-content-center pt-2 "
            percent={progress}
            steps={9}
          />
        )}
        <div className="d-grid gap-2">
          <Button
            onClick={handleAddLesson}
            className="col mt-3"
            size="large"
            type="primary"
            loading={uploading}
            shape="round"
          >
            Save
          </Button>
        </div>
      </form>
    </div>
  );
};

export default AddLessonForm;
