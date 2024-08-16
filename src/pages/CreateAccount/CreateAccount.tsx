import "./CreateAccount.scss";
import { TextInput, Button, LandingContainer } from "src/components";
import { useCallback, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthService } from "src/hooks";

export type CreateAccountProps = { homeRoute: string };

export const CreateAccount: React.FC<CreateAccountProps> = ({ homeRoute }) => {
  const navigate = useNavigate();
  const { registerUser, loading } = useAuthService();
  const [formValues, setFormValues] = useState<{
    userName?: string;
    password?: string;
    confirm?: string;
  }>({});

  const matchingPasswords = useMemo(
    () =>
      formValues.password === undefined ||
      formValues.confirm === undefined ||
      formValues.password === formValues.confirm,
    [formValues]
  );

  const submitForm = useCallback(
    (username: string, password: string) => {
      registerUser(
        { username, password },
        {
          onSuccess: () => {
            navigate(homeRoute);
          },
        }
      );
    },
    [homeRoute, navigate]
  );

  return (
    <LandingContainer>
      <div className="new-account-form">
        <div className="heading">
          <h1>Create account</h1>
          <p>
            By making an account, you will be able to return to your saved
            information
          </p>
        </div>
        <form
          name="Create account"
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

          <div className="footer">
            <div className="button-container">
              <Button label="Create" type="submit" />
              <Button
                label="Home"
                variant="secondary"
                onClick={() => {
                  navigate(homeRoute);
                }}
              />
            </div>
            {loading && <p>Loading...</p>}
          </div>
        </form>
      </div>
    </LandingContainer>
  );
};
