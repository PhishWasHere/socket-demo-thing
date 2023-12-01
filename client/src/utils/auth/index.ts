import getError from "../getError";
import axios, { AxiosError } from "axios";
import { jwtDecode } from "jwt-decode";
import Cookie from 'js-cookie';

const api = process.env.API_URL || "http://localhost:3030";

const setToken = async (token: string) => {
  if (token) {
    // this default header doesnt work reeeeeeeeeeeeeeeeeeeeeeeeeeee
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

type TokenType = {
  exp: number | null;
  iat: number | null;
  _id: string | null;
  username: string | null;
}

export const checkToken = async () => {
  const token = Cookie.get('token');
  if (token) {
    const decodedToken: TokenType = jwtDecode(token);
    if ( !decodedToken || decodedToken.exp! * 1000 < Date.now()) {
      await removeToken();
      return null;
    } 

    await setToken(token);
    return { token, decodedToken };
    
  }
}

export const login = async (username: string, password: string) => {
  try {
    const { data } = await axios.post(`${api}/user/login`, { username, password });
    await setToken(data.token);
    return data;
  } catch (error) {
    throw getError(error);
  }
};

export const logout = async () => {
  try {
    await axios.post(`${api}/user/logout`);
    await removeToken();
  } catch (error) {
    throw getError(error);
  }
};

export const signup = async (username: string, password: string) => {
  try {
    const { data } = await axios.post(`${api}/user/signup`, { username, password });
    await setToken(data.token);
    return data;
  } catch (error) {
    throw getError(error);
  }
};