import { Link, useParams } from "react-router-dom";
import blogData from "./BlogData";
import styles from "./styles.module.scss";
import Header from "@components/Header/Header";
import { getBlogDetail } from "@/apis/blogService";
import { useState, useEffect } from "react";
import { toast } from "react-toastify";

function BlogDetail() {
  const { id } = useParams();
  const { containerDetailPage, containerDetailPageContent, containerDetailImageContent } = styles;
  const [blogDetail, setBlogDetail] = useState(null);

  useEffect(() => {
    getBlogDetail(id)
      .then((res) => {
        setBlogDetail(res.data);
      })
      .catch((err) => {
        toast.error("Failed to fetch blog detail");
      });
  }, []);

  return (
    <div className={containerDetailPage}>
      <Header />
      {blogDetail ? (
        <div className={containerDetailPageContent}>
          <h1>{blogDetail.title}</h1>
          {blogDetail.image && (
            <div className={containerDetailImageContent}>
              <img src={blogDetail.image} alt="Blog detail image" />
            </div>
          )}
          <p>{blogDetail.content}</p>
          <Link to="/">← Back to Home</Link>
        </div>
      ) : (
        <p>Blog not found.</p>
      )}
    </div>
  );
}

export default BlogDetail;
