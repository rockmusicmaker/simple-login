import "./Login.scss";
import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { LandingContainer } from "src/components";
import { TextInput, Button } from "src/components";
import classnames from "classnames";
import { useAuthService } from "src/hooks";

export type LoginProps = {
  registerRoute: string;
  homeRoute: string;
};

export const Login: React.FC<LoginProps> = ({ registerRoute, homeRoute }) => {
  const navigate = useNavigate();
  const { loading, loginUser, error } = useAuthService();
  const [formValues, setFormValues] = useState<{
    userName?: string;
    password?: string;
  }>({});

  return (
    <LandingContainer>
      <div className={classnames("login-container")}>
        <div className={classnames("heading")}>
          <h1>Login</h1>
          <p>Login to access your account</p>
        </div>

        <div className={classnames("create-account")}>
          <Button
            variant="secondary"
            label="Register"
            onClick={() => {
              navigate(registerRoute);
            }}
          />
        </div>

        <div className={classnames("divider")}>
          <div className={classnames("divider-line")} />
          <p>or</p>
          <div className={classnames("divider-line")} />
        </div>

        <form
          className={classnames("login-form")}
          onSubmit={(e) => {
            e.preventDefault();
            if (!formValues.password || !formValues.userName) {
              return;
            }
            loginUser(
              {
                username: formValues.userName,
                password: formValues.password,
              },
              {
                onSuccess: () => {
                  navigate(homeRoute);
                },
              }
            );
          }}
        >
          <TextInput
            type="text"
            label="Username"
            value={formValues.userName ?? ""}
            onChange={(c) => setFormValues((v) => ({ ...v, userName: c }))}
            width="full"
          />
          <TextInput
            type="password"
            label="Password"
            value={formValues.password ?? ""}
            onChange={(c) => setFormValues((v) => ({ ...v, password: c }))}
            width="full"
          />
          <Button
            className={classnames("submit")}
            label="Login"
            type="submit"
          />
        </form>
        <div className={classnames("feedback")}>
          {loading && <p>Loading...</p>}
          {error && <p className={classnames("error")}>Unable to login</p>}
        </div>
      </div>
    </LandingContainer>
  );
};
