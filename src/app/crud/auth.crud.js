import axios from "axios";
import qs from "qs";


export const LOGIN_URL = "api/auth/login";
export const REGISTER_URL = "api/auth/register";
export const REQUEST_PASSWORD_URL = "api/auth/forgot-password";

export const ME_URL = "api/me";

export const USER_API_URL = process.env.REACT_APP_HOST + "/EuclideV2/api/user";
export const USER_FORGOTPASSWORD_URL = process.env.REACT_APP_HOST + "/EuclideV2/api/user/forgot-password";

export function login(username, password, remember = true) {
  return axios.post(
    process.env.REACT_APP_HOST + "/EuclideV2/j_spring_security_check",
    qs.stringify({
      j_username: username,
      j_password: password,
      _spring_security_remember_me: remember,
    })
  )
}

export function register({email, firstname, lastname, username, ...otherUserValues}) {
  return axios.post(USER_API_URL+'/register',  qs.stringify({ email, firstname, lastname, username, ...otherUserValues }));
}

export function forgotPassword(email) {
  return axios.post(USER_FORGOTPASSWORD_URL, qs.stringify({ email }));
}

export function requestPassword(email) {
  return axios.post(REQUEST_PASSWORD_URL, { email });
}

export function getUserByToken() {
  // Authorization head should be fulfilled in interceptor.
  return axios.get(USER_API_URL);
}
