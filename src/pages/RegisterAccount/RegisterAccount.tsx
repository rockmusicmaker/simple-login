import "./RegisterAccount.scss";
import { TextInput, Button, LandingContainer } from "src/components";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "src/hooks";
import classnames from "classnames";

export type RegisterAccountProps = { loginRoute: string };

export const RegisterAccount: React.FC<RegisterAccountProps> = ({
  loginRoute,
}) => {
  const navigate = useNavigate();
  const { registerUser, loading, error } = useAuthService();
  const [formValues, setFormValues] = useState<{
    userName?: string;
    password?: string;
    confirm?: string;
  }>({});

  const [formSubmitted, setFormSubmitted] = useState(false);
  const notMatchingPasswords = useMemo(
    () => formSubmitted && formValues.password !== formValues.confirm,
    [formValues, formSubmitted]
  );

  const submitForm = useCallback(
    (username: string, password: string) => {
      registerUser(
        { username, password },
        {
          onSuccess: () => {
            navigate(loginRoute);
          },
        }
      );
    },
    [loginRoute, navigate, registerUser]
  );

  return (
    <LandingContainer>
      <div className={classnames("new-account-form")}>
        <div className={classnames("heading")}>
          <h1>Register account</h1>
          <p>
            By making an account, you will be able to return to your saved
            information
          </p>
        </div>
        <form
          name="Register account"
          onSubmit={(e) => {
            e.preventDefault();
            setFormSubmitted(true);
            if (
              !loading &&
              formValues.confirm &&
              formValues.password &&
              formValues.userName &&
              !notMatchingPasswords
            ) {
              submitForm(formValues.userName, formValues.password);
            }
          }}
        >
          <TextInput
            type="text"
            label="Username"
            value={formValues.userName ?? ""}
            onChange={(c) => {
              setFormSubmitted(false);
              setFormValues((v) => ({ ...v, userName: c }));
            }}
          />
          <TextInput
            type="password"
            label="Password"
            value={formValues.password ?? ""}
            onChange={(c) => {
              setFormSubmitted(false);
              setFormValues((v) => ({ ...v, password: c }));
            }}
          />
          <TextInput
            type="password"
            label="Confirm password"
            value={formValues.confirm ?? ""}
            onChange={(c) => {
              setFormSubmitted(false);
              setFormValues((v) => ({ ...v, confirm: c }));
            }}
            errorMessage={
              notMatchingPasswords ? "Password must match" : undefined
            }
          />

          <div className={classnames("footer")}>
            <div className={classnames("button-container")}>
              <Button label="Register" type="submit" />
              <Button
                label="Home"
                variant="secondary"
                onClick={() => {
                  navigate(loginRoute);
                }}
              />
            </div>
          </div>
        </form>
        <div className={classnames("feedback")}>
          {loading && <p>Loading...</p>}
          {error && <p className={classnames("error")}>Unable to register</p>}
        </div>
      </div>
    </LandingContainer>
  );
};
