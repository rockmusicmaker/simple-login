import "./LandingContainer.scss";
import { ReactNode } from "react";

export type LandingContainerProps = { children?: ReactNode };

export const LandingContainer: React.FC<LandingContainerProps> = ({
  children,
}) => {
  return (
    <div className="background">
      {children}
      <img
        className="landing-image"
        src={`${process.env.PUBLIC_URL}/images/landing.jpeg`}
        alt="Landing image"
      />
    </div>
  );
};
