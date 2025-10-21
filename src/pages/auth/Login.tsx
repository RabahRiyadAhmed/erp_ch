import React, { useState, useEffect ,useContext} from "react";
import { Button, Alert, Row, Col, Form } from "react-bootstrap";
import { Navigate, Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import * as yup from "yup";
import { yupResolver } from "@hookform/resolvers/yup";
import { useTranslation } from "react-i18next";
//import { AuthContext } from '../../helpers/AuthContext';
import { login, logout, setNbnotif } from '../../redux/authSlice';


// actions
import { resetAuth } from "../../redux/actions";

// store
import { RootState, AppDispatch } from "../../redux/store";

// components
import { VerticalForm, FormInput } from "../../components/";

import AuthLayout from "./AuthLayout";

interface UserData {
  email: string;
  password: string;
  verifyCode?: string;
}

/* bottom links */
const BottomLink = () => {
  const { t } = useTranslation();

  return (
    <Row className="mt-3">
      <Col className="text-center">
        <p>
          <Link to={"/auth/forget-password"} className="text-white-50 ms-1">
            {t("Forgot your password?")}
          </Link>
        </p>
        <p className="text-white-50">
          {t("Don't have an account?")}{" "}
          <Link to={"/auth/register"} className="text-white ms-1">
            <b>{t("Sign Up")}</b>
          </Link>
        </p>
      </Col>
    </Row>
  );
};

const Login = () => {
  //const { auth, login } = useContext(AuthContext);
  const auth = useSelector((state: RootState) => state.Auth);
  const { t } = useTranslation();
  const dispatch = useDispatch<AppDispatch>();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSecondStep, setIsSecondStep] = useState(false);
  const [verifyCode, setVerifyCode] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [emailSent, setEmailSent] = useState(false);
  const navigate = useNavigate();
  const { user, userLoggedIn } = useSelector((state: RootState) => ({
    user: state.Auth.user,
    userLoggedIn: state.Auth.userLoggedIn,
  }));

  useEffect(() => {
    dispatch(resetAuth());
  }, [dispatch]);

  const schemaResolver = yupResolver(
    yup.object().shape({
      email: yup.string().required(t("Please enter email")).email(),
      password: yup.string().required(t("Please enter Password")),
    })
  );

  const handleLoginSubmit = (formData: UserData) => {
    setLoading(true);
    setError("");

    fetch(`${process.env.REACT_APP_API_URL}/login`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: formData.email, password: formData.password }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.status) {
          setEmail(formData.email)
          setPassword(formData.password)
          setEmailSent(true);
          setIsSecondStep(true);
        } else {
          setError(res.message || t("Invalid login details."));
        }
      })
      .catch(() => {
        setLoading(false);
        setError(t("An unexpected error occurred."));
      });
  };

  const handleVerifyCodeSubmit = (e: React.FormEvent) => {

    e.preventDefault();
    setLoading(true);
    setError("");
    console.log(verifyCode)

    fetch(`${process.env.REACT_APP_API_URL}/verify-code`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, password, verification_code: verifyCode }),
    })
      .then((res) => res.json())
      .then((res) => {
        setLoading(false);
        if (res.status) {
          console.log(res.employee)
          dispatch(login({token:res.token,role:res.role,employeeData:res.employee,nbnotif:res.nbnotif}))
         navigate('/');
         navigate(0);
        } else {
          setError(res.message || t("Incorrect verification code."));
        }
      })
      .catch(() => {
        setLoading(false);
        setError(t("An unexpected error occurred."));
      });
  };

  const resendEmail = () => {
    setLoading(true);
    fetch(`${process.env.REACT_APP_API_URL}/resend-email`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email: verifyCode }),
    })
      .then((res) => res.json())
      .then(() => {
        setLoading(false);
        setError(t("A new verification email has been sent."));
      })
      .catch(() => {
        setLoading(false);
        setError(t("An error occurred while resending the email."));
      });
  };

  if (userLoggedIn || user) {
    return <Navigate to="/" />;
  }

  return (
    <AuthLayout
      helpText={isSecondStep ? t("Enter the code sent to your email") : t("Enter your email and password.")}
      bottomLinks={<BottomLink />}
    >
      {error && (
        <Alert variant="danger" className="my-2">
          {error}
        </Alert>
      )}

      {isSecondStep ? (
        <>
          <Form onSubmit={handleVerifyCodeSubmit}>
            <Form.Group controlId="verifyCode">
              <Form.Label>{t("Verification Code")}</Form.Label>
              <Form.Control
                type="text"
                value={verifyCode}
                onChange={(e) => setVerifyCode(e.target.value)}
                placeholder={t("Enter verification code")}
                required
              />
            </Form.Group>
            <div className="text-center mt-3">
              <Button type="submit" variant="primary" disabled={loading}>
                {loading ? t("Verifying...") : t("Verify Code")}
              </Button>
              <Button variant="link" onClick={resendEmail}>
                {t("Resend Email")}
              </Button>
            </div>
          </Form>
        </>
      ) : (
        <VerticalForm<UserData> onSubmit={handleLoginSubmit} resolver={schemaResolver}>
          <FormInput
            label={t("Email")}
            type="text"
            name="email"
            placeholder={t("Enter your email")}
            containerClass={"mb-3"}
          />
          <FormInput
            label={t("Password")}
            type="password"
            name="password"
            placeholder={t("Enter your password")}
            containerClass={"mb-3"}
          />
          <div className="text-center d-grid">
            <Button variant="primary" type="submit" disabled={loading}>
              {loading ? t("Logging in...") : t("Log In")}
            </Button>
          </div>
        </VerticalForm>
      )}
    </AuthLayout>
  );
};

export default Login;
