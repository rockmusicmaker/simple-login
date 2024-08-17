import "./TextInput.scss";
import { HTMLInputTypeAttribute, useState } from "react";
import {
  ExclamationCircleIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";
import classnames from "classnames";

export type TextInputProps = {
  type: HTMLInputTypeAttribute;
  label: string;
  value: string;
  onChange: (type: string) => void;
  errorMessage?: string;
  width?: "fit" | "full";
};

export const TextInput: React.FC<TextInputProps> = ({
  type: initialType,
  label,
  value,
  onChange,
  errorMessage,
  width = "fit",
}) => {
  const [type, setType] = useState(initialType);

  return (
    <div className={classnames("text-input")}>
      <label className={classnames("text-input-label")} htmlFor={label}>
        {label}
      </label>
      <span className={classnames("text-input-input")}>
        <input
          type={type}
          name={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {errorMessage ? (
          <ExclamationCircleIcon className={classnames("error icon")} />
        ) : initialType === "password" ? (
          <button
            tabIndex={0}
            type="button"
            onClick={() => {
              setType(type === "password" ? "text" : "password");
            }}
            aria-label="hide & show password"
          >
            {type === "password" ? (
              <EyeSlashIcon className={classnames("icon")} />
            ) : (
              <EyeIcon className={classnames("icon")} />
            )}
          </button>
        ) : (
          <></>
        )}
      </span>
      <p className={classnames("error-message")}>{errorMessage}</p>
    </div>
  );
};
