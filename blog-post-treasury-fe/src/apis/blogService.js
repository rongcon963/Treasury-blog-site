import axiosClient from './axiosClient';

const getBlogs = async () => {
  const res = await axiosClient.get(`/blog`);

  return res.data;
};

const getBlogDetail = async (id) => {
  const res = await axiosClient.get(`/blog/${id}`);

  return res.data;
};

const createBlog = async (blog) => {
  const res = await axiosClient.post(`/blog`, blog, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });

  return res.data;
};

const editBlog = async (id, blog) => {
  const res = await axiosClient.patch(`/blog/${id}`, blog, {
    headers: {
      "Content-Type": "multipart/form-data",
    }
  });

  return res.data;
};

const deleteBlog = async (id) => {
  const res = await axiosClient.delete(`/blog/${id}`);

  return res.data;
};

export { getBlogs, getBlogDetail, createBlog, editBlog, deleteBlog };