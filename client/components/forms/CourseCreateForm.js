import { Select, Button, Avatar, Badge } from "antd";
import { SaveOutlined } from "@ant-design/icons";

const { Option } = Select;
const CourseCreateForm = ({
  handleSubmit,
  handleImage,
  handleChange,
  values,
  setValues,
  preview,
  uploadButtonText,
  handleImageRemove = (f) => f,
  editPage = false,
}) => {
  const children = [];
  for (let i = 100; i <= 1000; i++) {
    children.push(<Option key={i.toFixed(2)}>₹{i.toFixed(2)}</Option>);
  }

  return (
    <>
      {values && (
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <input
              type="text"
              name="name"
              className="form-control"
              placeholder="Name"
              value={values.name}
              onChange={handleChange}
            />
          </div>
          <div className="form-group pt-3">
            <textarea
              name="description"
              cols="7"
              rows="7"
              value={values.description}
              className="form-control"
              onChange={handleChange}
            ></textarea>
          </div>
          <div className="form-row mt-2">
            <div className="col">
              <div className="form-group">
                <Select
                  style={{ width: "100%" }}
                  value={values.paid}
                  onChange={(v) => setValues({ ...values, paid: v, price: 0 })}
                >
                  <Option value={true}>Paid</Option>
                  <Option value={false}>Free</Option>
                </Select>
              </div>
            </div>

            {values.paid && (
              <div className="form-group">
                <Select
                  defaultValue="₹100"
                  style={{ width: "100%" }}
                  onChange={(v) => setValues({ ...values, price: v })}
                  tokenSeparators={[,]}
                  size="large"
                >
                  {children}
                </Select>
              </div>
            )}
          </div>

          <div className="form-group mt-2">
            <input
              type="text"
              name="Category"
              className="form-control"
              placeholder="Course Name"
              value={values.Category}
              onChange={handleChange}
            />
          </div>
          <div className="form-row mt-3">
            <div className="col">
              <div className="form-group">
                <label className="btn btn-outline-secondary btn-block text-left">
                  {uploadButtonText}

                  <input
                    type="file"
                    name="image"
                    onChange={handleImage}
                    accept="image/*"
                    hidden
                  />
                </label>
              </div>
            </div>

            {preview && (
              <Badge count="X" onClick={handleImageRemove} className="pointer">
                <Avatar
                  draggable="true"
                  size="large"
                  shape="square"
                  width={400}
                  src={preview}
                />
              </Badge>
            )}

            {editPage && values.image && (
              <Avatar
                draggable="true"
                size="large"
                shape="square"
                width={400}
                src={values.image.data.Location}
              />
            )}
          </div>

          <div className="row mt-2">
            <div className="col">
              <Button
                onClick={handleSubmit}
                disabled={values.loading || values.uploading}
                loading={values.loading}
                className="btn btn-primary"
                icon={<SaveOutlined />}
                type="primary"
                size="large"
                shape="round"
              >
                {values.loading ? "Saving...." : "Save and Continue"}
              </Button>
            </div>
          </div>
        </form>
      )}
    </>
  );
};
export default CourseCreateForm;
