import { useState } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import blogData from "./BlogData";
import styles from "./styles.module.scss";
import Header from "@components/Header/Header";
import { createBlog } from "@/apis/blogService";
import { toast } from "react-toastify";

export default function BlogCreate() {
  const navigate = useNavigate();
  const { containerEdit, containerEditBlog, btnBack } = styles;
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  const handleSave = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("content", content);
    if (image) {
      formData.append("image", image);
    }
    createBlog(formData).then(() => {
      navigate(`/`);
    }).catch((err) => {
      toast.error("Failed to create blog");
    });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    setImagePreview(URL.createObjectURL(file));
  };

  return (
    <div className={containerEdit}>
      <Header />
      <div className={containerEditBlog}>
        <h1>Create Blog</h1>
        <form>
          <input
            type="file"
            id="image"
            accept="image/*"
            onChange={handleImageChange}
            style={{ marginTop: "5px" }}
          />
          {imagePreview && (
            <img
              src={imagePreview}
              alt="Preview"
              style={{ maxWidth: "300px", marginTop: "10px" }}
            />
          )}
          <input
            type="text"
            value={title}
            onChange={(e) =>
              setTitle(e.target.value)
            }
            placeholder="Title"
          />
          <textarea
            value={content}
            onChange={(e) =>
              setContent(e.target.value)
            }
            placeholder="Content"
          />
          <button type="submit" onClick={handleSave}>Save</button>
        </form>

        <div className={btnBack}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}
