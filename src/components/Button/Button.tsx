import { MouseEventHandler } from "react";
import "./Button.scss";

export type ButtonProps = {
  label: string;
  onClick: MouseEventHandler<HTMLButtonElement>;
  type?: "button" | "submit";
  className?: string;
  variant?: "primary" | "secondary";
};

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  className,
  variant = "primary",
}) => {
  return (
    <button
      className={`button ${variant} ${className ?? ""}`}
      type={type}
      onClick={onClick}
      tabIndex={0}
    >
      <p>{label}</p>
    </button>
  );
};
