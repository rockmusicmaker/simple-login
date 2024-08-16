import "./Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LandingContainer } from "src/components";
import { TextInput, Button } from "src/components";

export type LoginProps = {
  registerRoute: string;
};

export const Login: React.FC<LoginProps> = ({ registerRoute }) => {
  const navigate = useNavigate();
  const [formValues, setFormValues] = useState<{
    userName?: string;
    password?: string;
  }>({});

  return (
    <LandingContainer>
      <div className="login-container">
        <div className="heading">
          <h1>Login</h1>
          <p>Login to access your account</p>
        </div>

        <div className="create-account">
          <Button
            variant="secondary"
            label="Register"
            onClick={() => {
              navigate(registerRoute);
            }}
          />
        </div>

        <div className="divider">
          <div className="divider-line" />
          <p>or</p>
          <div className="divider-line" />
        </div>

        <form className="login-form">
          <TextInput
            type="text"
            label="Username"
            value={formValues.userName ?? ""}
            onChange={(c) => setFormValues((v) => ({ ...v, userName: c }))}
          />
          <TextInput
            type="password"
            label="Password"
            value={formValues.password ?? ""}
            onChange={(c) => setFormValues((v) => ({ ...v, password: c }))}
          />
          <Button
            className="submit"
            label="Login"
            onClick={(e) => {
              if (!formValues.password || !formValues.userName) {
                e.preventDefault();
              }
            }}
            type="submit"
          />
        </form>
      </div>
    </LandingContainer>
  );
};
