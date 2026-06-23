import axios from 'axios';

const API_URL =
  'https://ordermanagement-production-2dc1.up.railway.app/';

export const login = async (
  username,
  password
) => {
  const res = await axios.post(
    `${API_URL}/login`,
    {
      username,
      password
    }
  );

  return res.data;
};

export const register = async (
  username,
  password
) => {
  const res = await axios.post(
    `${API_URL}/register`,
    {
      username,
      password
    }
  );

  return res.data;
};