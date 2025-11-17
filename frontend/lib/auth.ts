export const getAccessToken = () => localStorage.getItem("accessToken");
export const setAccessToken = (token: string) =>
  localStorage.setItem("accessToken", token);

export const getRefreshToken = () => localStorage.getItem("refreshToken");
export const setRefreshToken = (token: string) =>
  localStorage.setItem("refreshToken", token);

export const setTokens = (accessToken: string, refreshToken: string) => {
  setAccessToken(accessToken);
  setRefreshToken(refreshToken);
};

export const logout = () => localStorage.clear();

export const setUserInfo = (name: string) => {
  localStorage.setItem("userName", name);
};

export const getUserInfo = () => {
  return localStorage.getItem("userName");
};
