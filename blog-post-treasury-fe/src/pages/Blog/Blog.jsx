import { Link } from "react-router-dom";
import blogData from "./BlogData";
import styles from "./styles.module.scss";
import Header from "@components/Header/Header";
import classNames from "classnames";
import { deleteBlog, getBlogs } from "@/apis/blogService";
import { useContext, useEffect, useState } from "react";
import { IoTrashOutline } from "react-icons/io5";
import { toast } from "react-toastify";
import { StoreContext } from "@contexts/storeProvider";

function Blog() {
  const {
    containerHome,
    containerTitle,
    homeTitle,
    containerHomeBlog,
    titleBlogContent,
    blogContent,
    blogCard,
    buttons,
    btn,
    read,
    edit,
    create,
    deleteBtn,
  } = styles;
  const [blogs, setBlogs] = useState([]);
  const { userInfo } = useContext(StoreContext);

  useEffect(() => {
    getBlogs()
      .then((res) => {
        setBlogs(res.data);
      })
      .catch((err) => {
        toast.error("Failed to fetch blogs");
      });
  }, []);

  const handelDelete = (id) => {
    try {
      deleteBlog(id).then((res) => {
        if (res.success) {
          toast.success("Delete success");
          setBlogs(blogs.filter((blog) => blog.id !== id));
        } else {
          toast.error("Delete failed");
        }
      });
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <>
      <div className={containerHome}>
        <Header />
        <div className={containerHomeBlog}>
          <div className={titleBlogContent}>
            <h2>Latest Posts</h2>
            {userInfo && (
              <Link to={`/create`} className={classNames(btn, create)}>
                Create Blog
              </Link>
            )}
          </div>
          <div className={blogContent}>
            {blogs.map((blog) => (
              <div key={blog.id} className={blogCard}>
                <h2>{blog.title}</h2>
                <p>{blog.excerpt}</p>
                <div className={buttons}>
                  <Link
                    to={`/blog/${blog.id}`}
                    className={classNames(btn, read)}
                  >
                    Read More
                  </Link>
                  {userInfo && (
                    <>
                      <Link
                        to={`/edit/${blog.id}`}
                        className={classNames(btn, edit)}
                      >
                        Edit
                      </Link>
                      <IoTrashOutline
                        className={classNames(btn, deleteBtn)}
                        onClick={() => handelDelete(blog.id)}
                      />
                    </>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </>
  );
}

export default Blog;
