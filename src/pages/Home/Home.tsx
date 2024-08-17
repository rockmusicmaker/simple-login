import "./Home.scss";
import React, { useCallback, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { LandingContainer } from "src/components";
import { useAuthService } from "src/hooks";
import { Button } from "src/components";
import classnames from "classnames";

export type HomeProps = { loginRoute: string };

export const Home: React.FC<HomeProps> = ({ loginRoute }) => {
  const navigate = useNavigate();
  const { loggedIn, user, error, loading, logout, getUser, deleteUser } =
    useAuthService();

  useEffect(() => {
    if (!loggedIn) {
      navigate(loginRoute);
    }
  }, [loggedIn, loginRoute, navigate]);

  const signOff = useCallback(() => {
    logout();
    navigate(loginRoute);
  }, [loginRoute, logout, navigate]);

  useEffect(() => {
    getUser({
      onFailure: signOff,
    });
  }, [getUser, signOff]);

  return (
    <LandingContainer>
      <div className={classnames("home-container")}>
        {user && <h1>Hello {user.username}</h1>}
        <div className={classnames("actions")}>
          <Button label="Logout" onClick={signOff} />
          {user && (
            <Button
              label="Delete account"
              variant="secondary"
              onClick={() => {
                deleteUser({
                  onSuccess: signOff,
                });
              }}
            />
          )}
        </div>

        {loading && <p>Loading...</p>}
        {error && <p className={classnames("error")}>Error</p>}
      </div>
    </LandingContainer>
  );
};
