import "./RegisterAccount.scss";
import { TextInput, Button, LandingContainer } from "src/components";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "src/hooks";
import classnames from "classnames";

export type RegisterAccountProps = { homeRoute: string };

export const RegisterAccount: React.FC<RegisterAccountProps> = ({
  homeRoute,
}) => {
  const navigate = useNavigate();
  const { registerUser, loading } = useAuthService();
  const [formValues, setFormValues] = useState<{
    userName?: string;
    password?: string;
    confirm?: string;
  }>({});

  const [registerError, setRegisterError] = useState<string>();

  const matchingPasswords = useMemo(
    () =>
      formValues.password === undefined ||
      formValues.confirm === undefined ||
      formValues.password === formValues.confirm,
    [formValues]
  );

  const submitForm = useCallback(
    (username: string, password: string) => {
      setRegisterError(undefined);
      registerUser(
        { username, password },
        {
          onSuccess: () => {
            navigate(homeRoute);
          },
          onFailure: () => {
            setRegisterError("Unable to register user");
          },
        }
      );
    },
    [homeRoute, navigate, registerUser]
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
            if (
              !loading &&
              formValues.confirm &&
              formValues.password &&
              formValues.userName &&
              matchingPasswords
            ) {
              submitForm(formValues.userName, formValues.password);
            }
          }}
        >
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
          <TextInput
            type="password"
            label="Confirm password"
            value={formValues.confirm ?? ""}
            onChange={(c) => setFormValues((v) => ({ ...v, confirm: c }))}
            errorMessage={
              !matchingPasswords ? "Password must match" : undefined
            }
          />

          <div className={classnames("footer")}>
            <div className={classnames("button-container")}>
              <Button label="Register" type="submit" />
              <Button
                label="Home"
                variant="secondary"
                onClick={() => {
                  navigate(homeRoute);
                }}
              />
            </div>
          </div>
        </form>
        <div className={classnames("feedback")}>
          {loading && <p>Loading...</p>}
          {registerError && (
            <p className={classnames("error")}>{registerError}</p>
          )}
        </div>
      </div>
    </LandingContainer>
  );
};
