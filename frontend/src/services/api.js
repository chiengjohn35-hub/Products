// src/services/api.js
const BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_CART_ID = 1;

const handleResponse = async (response) => {
  if (!response.ok) {
    const error = await response.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(error.detail || 'Network response was not ok');
  }
  return response.json();
};

export const productApi = {
  list: (skip = 0, limit = 100) =>
    fetch(`${BASE_URL}/products/?skip=${skip}&limit=${limit}`).then(handleResponse),

  create: (productData) =>
    fetch(`${BASE_URL}/products/`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(productData),
    }).then(handleResponse),
};

export const cartApi = {
  fetch: (cartId = DEFAULT_CART_ID) =>
    fetch(`${BASE_URL}/cart/${cartId}`).then(handleResponse),

  add: (item, cartId = DEFAULT_CART_ID) =>
    fetch(`${BASE_URL}/cart/${cartId}/items`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(item),
    }).then(handleResponse),

  delete: (productId, cartId = DEFAULT_CART_ID) =>
    fetch(`${BASE_URL}/cart/${cartId}/items/${productId}`, {
      method: 'DELETE',
    }).then(handleResponse),
};
