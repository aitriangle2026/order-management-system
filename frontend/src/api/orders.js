import axios from 'axios';

const API_URL = 'ordermanagement-production-2dc1.up.railway.app';

export const JOB_STATUSES = [
  'Active',
  'Completed',
  'Cancelled'
];

export const ORDER_SOURCES = [
  'Website',
  'Facebook',
  'WhatsApp',
  'Referral'
];

export const fetchOrders = async (params = {}) => {
  const res = await axios.get(API_URL, { params });
  return res.data;
};

export const fetchSummary = async () => {
  const res = await axios.get(`${API_URL}/summary`);
  return res.data;
};

export const createOrder = async (data) => {
  const res = await axios.post(API_URL, data);
  return res.data;
};

export const updateOrder = async (id, data) => {
  const res = await axios.put(`${API_URL}/${id}`, data);
  return res.data;
};

export const deleteOrder = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}`);
  return res.data;
};

