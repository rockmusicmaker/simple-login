import "./TextInput.scss";
import { HTMLInputTypeAttribute, useState } from "react";
import {
  ExclamationCircleIcon,
  EyeSlashIcon,
  EyeIcon,
} from "@heroicons/react/24/outline";

export type TextInputProps = {
  type: HTMLInputTypeAttribute;
  label: string;
  value: string;
  onChange: (type: string) => void;
  errorMessage?: string;
};

export const TextInput: React.FC<TextInputProps> = ({
  type: initialType,
  label,
  value,
  onChange,
  errorMessage,
}) => {
  const [type, setType] = useState(initialType);
  return (
    <div className="text-input">
      <label className="text-input-label" htmlFor={label}>
        {label}
      </label>
      <span className="text-input-input">
        <input
          type={type}
          name={label}
          value={value}
          onChange={(e) => onChange(e.target.value)}
        />
        {errorMessage ? (
          <ExclamationCircleIcon className="error icon" />
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
              <EyeSlashIcon className="icon" />
            ) : (
              <EyeIcon className="icon" />
            )}
          </button>
        ) : (
          <></>
        )}
      </span>
      <p className="error-message">{errorMessage}</p>
    </div>
  );
};
