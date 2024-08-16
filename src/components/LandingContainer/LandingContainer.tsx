import "./LandingContainer.scss";
import { ReactNode } from "react";

export type LandingContainerProps = { children?: ReactNode };

export const LandingContainer: React.FC<LandingContainerProps> = ({
  children,
}) => {
  return (
    <div className="background">
      <div className="content">{children}</div>
      <img
        className="landing-image"
        src={`${process.env.PUBLIC_URL}/images/landing.jpeg`}
        alt="Landing image"
      />
    </div>
  );
};
