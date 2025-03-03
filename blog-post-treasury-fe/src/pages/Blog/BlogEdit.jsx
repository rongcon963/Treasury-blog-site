import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import blogData from "./BlogData";
import styles from "./styles.module.scss";
import Header from "@components/Header/Header";
import { editBlog, getBlogDetail } from "@/apis/blogService";
import { toast } from "react-toastify";

export default function BlogEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { containerEdit, containerEditBlog } = styles;
  const [blogEdit, setBlogEdit] = useState([]);
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);

  useEffect(() => {
    getBlogDetail(id)
      .then((res) => {
        setBlogEdit(res.data);
        setImagePreview(res.data.image);
      })
      .catch((err) => {
        toast.error("Failed to fetch blog detail");
      });
  }, []);

  const handleInput = (e) => {
    e.preventDefault();
    const { name, value } = e.target;
    setBlogEdit({ ...blogEdit, [name]: value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append("title", blogEdit.title);
    formData.append("content", blogEdit.content);
    if (image) {
      formData.append("image", image);
    } else {
      formData.append("image", blogEdit.image);
    }
    editBlog(id, formData).then((res) => {
      navigate(`/blog/${id}`);
    }).catch((err) => {
      toast.error("Failed to edit blog");
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
        <h1>Edit Blog</h1>
        <form onSubmit={handleSubmit}>
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
            id="title"
            name="title"
            value={blogEdit.title}
            onChange={handleInput}
            placeholder="Title"
          />
          <textarea
            id="content"
            name="content"
            value={blogEdit.content}
            onChange={handleInput}
            placeholder="Content"
          />
          <button type="submit">Save</button>
        </form>
      </div>
    </div>
  );
}
