import getError from "../getError";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import Cookie from 'js-cookie';
import { ok } from "assert";

const api = process.env.API_URL || "http://localhost:3030";

const setToken = async (token: string) => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    Cookie.set('token', token);
  } else {
    await removeToken();
  }
};

const removeToken = async () => {
  delete axios.defaults.headers.common['Authorization'];
  Cookie.remove('token');
};

export const checkToken = async () => {
  const token = Cookie.get('token');
  if (token) {
    const decodedToken = jwtDecode(token);
    if ( !decodedToken || decodedToken.exp! * 1000 < Date.now()) {
      await removeToken();
      return null;
    } else {
      await setToken(token);
      return decodedToken;
    }
  }
}

export const login = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${api}/user/login`, { username, password });
    
    if (res.status <= 200 && 299 <= res.status) return { status: res.status, error: res.statusText} // if status is not 200-299, return error

    await setToken(res.data.token);
    return res.data;
  } catch (error) {
    throw getError(error);
  }
};

export const logout = async () => {
  try {
    // await axios.post(`${api}/user/logout`); // not needed for now might need later for socket.io
    await removeToken();
  } catch (error) {
    throw getError(error);
  }
};

export const signup = async (username: string, password: string) => {
  try {
    const res = await axios.post(`${api}/user/signup`, { username, password });

    if (res.status <= 200 && 299 <= res.status) return { status: res.status, error: res.statusText} // if status is not 200-299, return error

    await setToken(res.data.token);
    return res.data;
  } catch (error) {
    throw getError(error);
  }
};