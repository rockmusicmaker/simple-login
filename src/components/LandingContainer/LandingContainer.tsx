import "./LandingContainer.scss";
import { ReactNode } from "react";
import classnames from "classnames";

export type LandingContainerProps = { children?: ReactNode };

export const LandingContainer: React.FC<LandingContainerProps> = ({
  children,
}) => {
  return (
    <div className={classnames("background")}>
      <div className={classnames("content")}>{children}</div>
      <img
        className={classnames("landing-image")}
        src={`${process.env.PUBLIC_URL}/images/landing.jpeg`}
        alt="Landing image"
      />
    </div>
  );
};
