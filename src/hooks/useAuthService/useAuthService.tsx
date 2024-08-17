import { useCallback, useMemo, useState } from "react";
import { useMockAuthServiceProvider, useLocalStorage } from "src/hooks";

export type AuthServiceUser = { username: string; password: string };
export type AuthServiceHandlers = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const useAuthService = (authTokenKey = "simple_sign_in_auth_token") => {
  const makeRequest = useMockAuthServiceProvider();
  const [state, setState] = useState<"loading" | "error" | undefined>();
  const [authToken, setAuthToken] = useLocalStorage(authTokenKey);
  const [user, setUser] = useState<{ username: string }>();

  const registerUser = useCallback(
    (
      { username, password }: AuthServiceUser,
      { onFailure, onSuccess }: AuthServiceHandlers = {}
    ) => {
      setState("loading");
      makeRequest("/auth/register", { username, password })
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
          setState(undefined);
        })
        .catch(() => {
          setState("error");
          if (onFailure) {
            onFailure();
          }
        });
    },
    [makeRequest]
  );

  const loginUser = useCallback(
    (
      { username, password }: AuthServiceUser,
      { onFailure, onSuccess }: AuthServiceHandlers = {}
    ) => {
      setState("loading");
      makeRequest("/auth/authenticate", { username, password })
        .then(({ token } = {}) => {
          if (!token) {
            setState("error");
            if (onFailure) {
              onFailure();
            }
            return;
          }
          setAuthToken(token);

          if (onSuccess) {
            onSuccess();
          }
          setState(undefined);
        })
        .catch(() => {
          setState("error");
          if (onFailure) {
            onFailure();
          }
        });
    },
    [makeRequest, setAuthToken]
  );

  const logout = useCallback(() => {
    setAuthToken(undefined);
  }, [setAuthToken]);

  const getUser = useCallback(
    ({ onFailure, onSuccess }: AuthServiceHandlers = {}) => {
      if (!authToken) {
        setState("error");
        if (onFailure) {
          onFailure();
        }
        return;
      }

      setState("loading");
      makeRequest("/user", { token: authToken })
        .then(({ username } = {}) => {
          if (!username) {
            if (onFailure) {
              onFailure();
            }
            setState("error");
          }
          if (onSuccess) {
            onSuccess();
          }
          setUser({ username });
          setState(undefined);
        })
        .catch(() => {
          if (onFailure) {
            onFailure();
          }
          setState("error");
        });
    },
    [authToken, makeRequest]
  );

  const deleteUser = useCallback(
    ({ onFailure, onSuccess }: AuthServiceHandlers = {}) => {
      if (!authToken) {
        setState("error");
        if (onFailure) {
          onFailure();
        }
        return;
      }

      setState("loading");
      makeRequest("/user/delete", { token: authToken })
        .then(() => {
          setState(undefined);
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(() => {
          setState("error");
          if (onFailure) {
            onFailure();
          }
        });
    },
    [authToken, makeRequest]
  );

  return useMemo(
    () => ({
      loading: state === "loading",
      error: state === "error",
      loginUser,
      registerUser,
      loggedIn: authToken !== undefined,
      logout,
      user,
      getUser,
      deleteUser,
    }),
    [
      state,
      loginUser,
      registerUser,
      authToken,
      logout,
      user,
      getUser,
      deleteUser,
    ]
  );
};
