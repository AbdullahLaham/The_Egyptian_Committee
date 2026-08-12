// import * as SecureStore from "expo-secure-store";

// export const saveToken = async (token: string) => {
//   await SecureStore.setItemAsync("access_token", token);
// };

// export const getToken = async () => {
//   return await SecureStore.getItemAsync("access_token");
// };

// export const removeToken = async () => {
//   await SecureStore.deleteItemAsync("access_token");
// };








import * as SecureStore from "expo-secure-store";

const TOKEN_KEY = "auth_token";
const USER_KEY = "auth_user";

/* -------- TOKEN -------- */
export const saveToken = async (token: string) => {
  await SecureStore.setItemAsync(TOKEN_KEY, token);
};

export const getToken = async () => {
  return await SecureStore.getItemAsync(TOKEN_KEY);
};

export const removeToken = async () => {
  await SecureStore.deleteItemAsync(TOKEN_KEY);
};

/* -------- USER -------- */
export const saveUser = async (user: any) => {
  await SecureStore.setItemAsync(USER_KEY, JSON.stringify(user));
};

export const getUser = async () => {
  const user = await SecureStore.getItemAsync(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const logout = async () => {
  await removeToken();
  await SecureStore.deleteItemAsync(USER_KEY);

};
