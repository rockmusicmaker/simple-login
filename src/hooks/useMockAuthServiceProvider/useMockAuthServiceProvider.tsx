import { useCallback, useMemo } from "react";
import { useLocalStorage } from "src/hooks";

export type MockApiController = (payload?: {
  [key: string]: string;
}) => Promise<{ [key: string]: string } | void>;

const SIMPLE_HASH = (username: string, password: string, mod = 100) =>
  `${
    ((`${username}${password}`
      .split("")
      .reduce((acc, curr) => acc + curr.charCodeAt(0), 0) %
      mod) +
      mod) %
    mod
  }`;

const GENERATE_TOKEN = (hash: string, expires: number) => `${hash}/${expires}`;
const DECODE_TOKEN = (token: string) => ({
  hash: token.split("/")[0],
  expires: Number(token.split("/")[1]),
});

export const useMockAuthServiceProvider = ({
  mockNetworkDelay = 250,
  mockUserTableLocalStorageKey = "simple_sign_in_users",
  hashUsernameAndPassword = SIMPLE_HASH,
  generateToken = GENERATE_TOKEN,
  decodeToken = DECODE_TOKEN,
  tokenTtlMin = 15,
}: {
  mockNetworkDelay?: number;
  mockUserTableLocalStorageKey?: string;
  hashUsernameAndPassword?: (username: string, password: string) => string;
  generateToken?: (hash: string, expires: number) => string;
  decodeToken?: (token: string) => { hash: string; expires: number };
  tokenTtlMin?: number;
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

  const registerUser = useCallback<MockApiController>(
    (json = {}) =>
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

  const loginUser = useCallback<MockApiController>(
    (json = {}) =>
      new Promise<{ token: string }>((resolve, reject) => {
        setTimeout(() => {
          if (!json.username || !json.password) {
            reject({ status: 400 }); //bad request
          } else if (
            !persistedUsers[json.username] ||
            hashUsernameAndPassword(json.username, json.password) !==
              persistedUsers[json.username]
          ) {
            reject({ status: 401 }); //unauthorized
          } else {
            resolve({
              token: generateToken(
                persistedUsers[json.username],
                new Date(new Date().getTime() + tokenTtlMin * 60000).getTime()
              ),
            });
          }
        }, mockNetworkDelay);
      }),
    [
      generateToken,
      hashUsernameAndPassword,
      mockNetworkDelay,
      persistedUsers,
      tokenTtlMin,
    ]
  );

  const authenticate = useCallback<
    (json: {
      [key: string]: string;
    }) => (
      promise: ReturnType<MockApiController>
    ) => ReturnType<MockApiController>
  >(
    (json = {}) => {
      if (
        !json.token ||
        decodeToken(json.token).expires < new Date().getTime()
      ) {
        return () =>
          new Promise<void>((_, reject) => {
            reject({ status: 401 }); //unauthorized
          });
      } else {
        return (promise) => promise;
      }
    },
    [decodeToken]
  );

  const getUser = useCallback<MockApiController>(
    (json = {}) =>
      authenticate(json)(
        new Promise<{ username: string }>((resolve, reject) => {
          setTimeout(() => {
            const { hash } = decodeToken(json.token);
            const username = Object.entries(persistedUsers)
              .find(([_, h]) => hash === h)
              ?.at(0);
            if (!username) {
              reject({ status: 400 }); //bad request
            } else {
              resolve({ username });
            }
          }, mockNetworkDelay);
        })
      ),
    [authenticate, decodeToken, mockNetworkDelay, persistedUsers]
  );

  const deleteUser = useCallback<MockApiController>(
    (json = {}) =>
      authenticate(json)(
        new Promise<void>((resolve, reject) => {
          const { hash } = decodeToken(json.token);
          const username = Object.entries(persistedUsers)
            .find(([_, h]) => hash === h)
            ?.at(0);
          if (!username) {
            reject({ status: 400 }); //bad request
          } else {
            setPersistedUsers((users) =>
              Object.fromEntries(
                Object.entries(users).filter(([user]) => user !== username)
              )
            );
            resolve();
          }
        })
      ),
    [authenticate, decodeToken, persistedUsers, setPersistedUsers]
  );

  const mockApiRouter = useCallback(
    ({
      route,
      json,
      routeMapping = {
        "/auth/register": registerUser,
        "/auth/authenticate": loginUser,
        "/user": getUser,
        "/user/delete": deleteUser,
      },
    }: {
      route: string;
      json?: { [key: string]: string };
      routeMapping?: {
        [route: string]: MockApiController;
      };
    }) => {
      if (!routeMapping[route]) {
        return new Promise<void>((_, reject) => reject({ status: 400 })); //bad request
      }
      return routeMapping[route](json);
    },
    [deleteUser, getUser, loginUser, registerUser]
  );

  return useCallback(
    (route: string, json: { [key: string]: string }) =>
      mockApiRouter({ route, json }),
    [mockApiRouter]
  );
};
