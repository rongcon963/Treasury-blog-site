import Header from "@components/Header/Header";
import styles from "./styles.module.scss";
import classNames from "classnames";
import { useNavigate, Link } from "react-router-dom";
import * as Yup from "yup";
import { useFormik } from "formik";
import { useContext, useState } from "react";
import InputCommon from "@components/InputCommon/InputCommon";
import { register, signIn } from "@/apis/authService";
import { ToastContext } from "@/contexts/ToastProvider";
import { StoreContext } from "@contexts/storeProvider";
import Cookies from "js-cookie";

function Login() {
  const {
    containerLogin,
    containerLoginContent,
    btnBack,
    btnLogin,
    btnRegister,
  } = styles;
  const [isRegister, setIsRegister] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useContext(ToastContext);
  const { setUserId } = useContext(StoreContext);
  const navigate = useNavigate();

  const registerSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
    cfmpassword: Yup.string()
      .required("Confirm password is required")
      .oneOf([Yup.ref("password"), null], "Passwords must match"),
  });

  const loginSchema = Yup.object({
    username: Yup.string().required("Username is required"),
    password: Yup.string()
      .min(6, "Password must be at least 6 characters")
      .required("Password is required"),
  });

  const formik = useFormik({
    initialValues: {
      username: "",
      password: "",
      cfmpassword: "",
    },
    validationSchema: isRegister ? registerSchema : loginSchema,
    onSubmit: async (values) => {
      if (isLoading) return;

      const { username: username, password } = values;
      setIsLoading(true);

      if (isRegister) {
        await register({ username, password })
          .then((res) => {
            const { success } = res.data;
            if (success) {
              toast.success(res.data.message);
              setIsLoading(false);
              setIsRegister(false);
            } else {
              toast.error(res.data.message);
              setIsLoading(false);
            }
          })
          .catch((error) => {
            toast.error(error.response.data.message);
            setIsLoading(false);
          });
      }

      if (!isRegister) {
        await signIn({ username, password })
          .then((res) => {
            setIsLoading(false);

            const { currentUser, accessToken, refreshToken } = res.data;
            setUserId(currentUser?.id);

            if (currentUser?.id) {
              Cookies.set("token", accessToken);
              Cookies.set("refreshToken", refreshToken);
              Cookies.set("userId", currentUser?.id);

              toast.success(res.data.message);
              navigate("/");
            } else {
              toast.error(res.data.message);
            }
          })
          .catch((error) => {
            toast.error("error");
            setIsLoading(false);
          });
      }
    },
  });

  const handleToggle = () => {
    setIsRegister(!isRegister);
    formik.resetForm();
  };

  return (
    <div className={containerLogin}>
      <Header />
      <div className={containerLoginContent}>
        <h1>{isRegister ? "SIGN UP" : "SIGN IN"}</h1>
        <form onSubmit={formik.handleSubmit}>
          <InputCommon
            id="username"
            label="Username"
            type="text"
            isRequired
            formik={formik}
          />
          <InputCommon
            id="password"
            label="Password"
            type="password"
            isRequired
            formik={formik}
          />
          {isRegister && (
            <InputCommon
              id="cfmpassword"
              label="Confirm Password"
              type="password"
              isRequired
              formik={formik}
            />
          )}
          <button className={btnLogin} type="submit">
            {isLoading ? "LOADING..." : isRegister ? "REGISTER" : "LOGIN"}
          </button>
        </form>
        <button type="submit" className={btnRegister} onClick={handleToggle}>
          {isRegister ? "Already have an account" : `Don't have an account?`}
        </button>

        <div className={btnBack}>
          <Link to="/">← Back to Home</Link>
        </div>
      </div>
    </div>
  );
}

export default Login;
