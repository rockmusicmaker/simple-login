import { useCallback, useMemo } from "react";
import { useLocalStorage } from "src/hooks";

const SIMPLE_HASH = (value: string, mod = 100) =>
  ((value.split("").reduce((acc, curr) => acc + curr.charCodeAt(0), 0) % mod) +
    mod) %
  mod;

export const useMockAuthServerProvider = ({
  mockNetworkDelay = 2500,
  mockUserTableLocalStorageKey = "simple_sign_in_users",
  hashUsernameAndPassword = (username, password) =>
    `${SIMPLE_HASH(`${username}`)}`,
}: {
  mockNetworkDelay?: number;
  mockUserTableLocalStorageKey?: string;
  hashUsernameAndPassword?: (username: string, password: string) => string;
} = {}) => {
  const [persistedUsersEncoded, setPersistedUsersEncoded] = useLocalStorage(
    mockUserTableLocalStorageKey
  );

  const persistedUsers = useMemo<{ [username: string]: string }>(
    () => JSON.parse(persistedUsersEncoded ?? "{}"),
    [persistedUsersEncoded]
  );

  const setPersistedUsers = useCallback(
    (
      updater:
        | { [username: string]: string }
        | ((current: { [username: string]: string }) => {
            [username: string]: string;
          })
    ) => {
      const newUsers =
        typeof updater === "function" ? updater(persistedUsers) : updater;
      setPersistedUsersEncoded(JSON.stringify(newUsers));
    },
    [persistedUsers, setPersistedUsersEncoded]
  );

  const registerUser = useCallback(
    (json: { [key: string]: string } = {}) =>
      new Promise<void>((resolve, reject) => {
        setTimeout(() => {
          if (!json.username || !json.password) {
            reject({ status: 400 }); //bad request
          } else if (persistedUsers[json.username]) {
            reject({ status: 422 }); //unprocessable content
          } else {
            try {
              setPersistedUsers((users) => ({
                ...users,
                [json.username]: hashUsernameAndPassword(
                  json.username,
                  json.password
                ),
              }));
              resolve();
            } catch (error) {
              reject(error);
            }
          }
        }, mockNetworkDelay);
      }),
    [
      hashUsernameAndPassword,
      mockNetworkDelay,
      persistedUsers,
      setPersistedUsers,
    ]
  );

  const loginUser = useCallback(
    (json: { [key: string]: string } = {}) =>
      new Promise<{ token: string }>((resolve, reject) => {
        setTimeout(() => {
          if (!json.username || !json.password) {
            reject({ status: 400 }); //bad request
          } else if (
            persistedUsers[json.username] &&
            hashUsernameAndPassword(json.username, json.password) ===
              persistedUsers[json.username]
          ) {
            resolve({ token: "" });
          } else {
            reject({ status: 401 }); //unauthorized
          }
        }, mockNetworkDelay);
      }),
    [hashUsernameAndPassword, mockNetworkDelay, persistedUsers]
  );

  const mockApiRouter = useCallback(
    ({
      route,
      json,
      routeMapping = {
        "/auth/register": registerUser,
        "/auth/authenticate": loginUser,
      },
    }: {
      route: string;
      json?: { [key: string]: string };
      routeMapping?: {
        [route: string]: (payload?: {
          [key: string]: string;
        }) => Promise<{ [key: string]: string } | void>;
      };
    }) => {
      if (!routeMapping[route]) {
        return new Promise<void>((resolve, reject) => reject({ status: 400 })); //bad request
      }
      return routeMapping[route](json);
    },
    [loginUser, registerUser]
  );

  return useCallback(
    (
      route: "/auth/register" | "/auth/authenticate",
      json: { [key: string]: string }
    ) => mockApiRouter({ route, json }),
    [mockApiRouter]
  );
};
