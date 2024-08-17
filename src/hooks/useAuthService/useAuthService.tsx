import { useCallback, useMemo, useState } from "react";
import { useMockAuthServerProvider } from "src/hooks";

export type AuthServiceUser = { username: string; password: string };
export type AuthServiceHandlers = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const useAuthService = () => {
  const makeRequest = useMockAuthServerProvider();
  const [loading, setLoading] = useState(false);

  const registerUser = useCallback(
    (
      { username, password }: AuthServiceUser,
      { onFailure, onSuccess }: AuthServiceHandlers = {}
    ) => {
      console.log({ username, password });
      setLoading(true);
      makeRequest("/auth/register", { username, password })
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(() => {
          if (onFailure) {
            onFailure();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [makeRequest]
  );

  const loginUser = useCallback(
    (
      { username, password }: AuthServiceUser,
      { onFailure, onSuccess }: AuthServiceHandlers = {}
    ) => {
      setLoading(true);
      makeRequest("/auth/authenticate", { username, password })
        .then(() => {
          if (onSuccess) {
            onSuccess();
          }
        })
        .catch(() => {
          if (onFailure) {
            onFailure();
          }
        })
        .finally(() => {
          setLoading(false);
        });
    },
    [makeRequest]
  );

  return useMemo(
    () => ({ loading, loginUser, registerUser }),
    [loginUser, registerUser, loading]
  );
};
