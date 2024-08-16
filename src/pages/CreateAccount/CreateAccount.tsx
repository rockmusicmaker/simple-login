import "./CreateAccount.scss";
import { TextInput, Button, LandingContainer } from "src/components";
import { useMemo, useState } from "react";
import { redirect } from "react-router-dom";

export type CreateAccountProps = { homeRoute: string };

export const CreateAccount: React.FC<CreateAccountProps> = ({ homeRoute }) => {
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
        <form name="Create account">
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

          <div className="button-container">
            <Button
              label="Create"
              onClick={(e) => {
                if (
                  !formValues.confirm ||
                  !formValues.password ||
                  !formValues.userName ||
                  !matchingPasswords
                ) {
                  e.preventDefault();
                }
              }}
              type="submit"
            />
            <Button
              label="Home"
              onClick={() => {
                redirect(homeRoute);
              }}
            />
          </div>
        </form>
      </div>
    </LandingContainer>
  );
};
