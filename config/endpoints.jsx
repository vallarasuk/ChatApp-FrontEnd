// src/config/endpoints.js
import { REACT_APP_BACKEND_URL } from "@env";
export const BASE_URL = REACT_APP_BACKEND_URL;

export const USER_API = {
  VALIDATE_SESSION: `${BASE_URL}api/users/validate-session`,
  LOGIN_SESSION: `${BASE_URL}api/users/login`,
  USER_CREATE: `${BASE_URL}api/users`,
  USER_LIST: `${BASE_URL}api/users`,
};
