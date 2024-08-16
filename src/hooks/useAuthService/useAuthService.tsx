import { useCallback, useMemo, useState } from "react";

export type AuthServiceUser = { username: string; password: string };
export type AuthServiceHandlers = {
  onSuccess?: () => void;
  onFailure?: () => void;
};

export const useAuthService = (mockNetworkDelay = 2500) => {
  const [loading, setLoading] = useState(false);
  const registerUser = useCallback(
    (
      { username, password }: AuthServiceUser,
      { onFailure, onSuccess }: AuthServiceHandlers = {}
    ) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (onSuccess) {
          onSuccess();
        }
      }, mockNetworkDelay);
    },
    []
  );

  const loginUser = useCallback(
    (
      { username, password }: AuthServiceUser,
      { onFailure, onSuccess }: AuthServiceHandlers
    ) => {
      setLoading(true);
      setTimeout(() => {
        setLoading(false);
        if (onSuccess) {
          onSuccess();
        }
      }, mockNetworkDelay);
    },
    []
  );

  return useMemo(
    () => ({ loading, loginUser, registerUser }),
    [loginUser, registerUser, loading]
  );
};
