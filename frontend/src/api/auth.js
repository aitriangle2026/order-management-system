import axios from 'axios';

const API_URL =
  "https://order-management-system-production-72c4.up.railway.app/api/auth";

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
export const forgotPassword = async (email) => {
  const res = await axios.post(
    `${API_URL}/forgot-password`,
    { email }
  );

  return res.data;
};
