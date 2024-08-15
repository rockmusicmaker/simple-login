import "./NewAccountForm.scss";
import { TextInput, Button } from "../";
import { useMemo, useState } from "react";

export type NewAccountFormProps = {};

export const NewAccountForm: React.FC<NewAccountFormProps> = ({}) => {
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
    <div className="newAccountForm">
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
          errorMessage={!matchingPasswords ? "Password must match" : undefined}
        />
        <Button
          className="submit"
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
      </form>
    </div>
  );
};
