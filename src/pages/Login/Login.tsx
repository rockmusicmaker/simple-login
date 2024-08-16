import { useState } from "react";
import { LandingContainer } from "src/components";
import { TextInput, Button } from "src/components";

export type LoginProps = {};

export const Login: React.FC<LoginProps> = ({}) => {
  const [formValues, setFormValues] = useState<{
    userName?: string;
    password?: string;
    confirm?: string;
  }>({});

  return (
    <LandingContainer>
      <div className="login-form">
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
          />
          <Button
            className="submit"
            label="Create"
            onClick={(e) => {
              if (
                !formValues.confirm ||
                !formValues.password ||
                !formValues.userName
              ) {
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
