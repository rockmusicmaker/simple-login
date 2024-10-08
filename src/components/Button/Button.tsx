import { MouseEventHandler } from "react";
import "./Button.scss";
import classnames from "classnames";

export type ButtonProps = {
  label: string;
  className?: string;
  variant?: "primary" | "secondary";
} & (
  | {
      type?: "button" | undefined;
      onClick: MouseEventHandler<HTMLButtonElement>;
    }
  | {
      type: "submit";
      onClick?: MouseEventHandler<HTMLButtonElement>;
    }
);

export const Button: React.FC<ButtonProps> = ({
  label,
  onClick,
  type = "button",
  className,
  variant = "primary",
}) => {
  return (
    <button
      className={classnames("button", variant, className)}
      type={type}
      onClick={onClick}
      tabIndex={0}
    >
      <p>{label}</p>
    </button>
  );
};
