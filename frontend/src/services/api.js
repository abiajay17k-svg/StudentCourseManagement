const API_BASE_URL = 'http://localhost:8080/api';

async function handleResponse(response) {
  if (!response.ok) {
    let errorMessage = `Request failed with status ${response.status}`;
    try {
      const errorData = await response.json();
      if (errorData.message) {
        errorMessage = errorData.message;
      } else if (errorData.errors) {
        errorMessage = Object.values(errorData.errors).join(', ');
      }
    } catch {
      // Non-JSON response
    }
    throw new Error(errorMessage);
  }
  return response.json();
}

// User API calls
export async function getUsers() {
  const response = await fetch(`${API_BASE_URL}/users`);
  return handleResponse(response);
}

export async function createUser(userData) {
  const response = await fetch(`${API_BASE_URL}/users`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(userData),
  });
  return handleResponse(response);
}

// Product API calls
export async function getProducts() {
  const response = await fetch(`${API_BASE_URL}/products`);
  return handleResponse(response);
}

export async function createProduct(productData) {
  const response = await fetch(`${API_BASE_URL}/products`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(productData),
  });
  return handleResponse(response);
}

// Bid API calls
export async function placeBid(bidData) {
  const response = await fetch(`${API_BASE_URL}/bids`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(bidData),
  });
  return handleResponse(response);
}

export async function getBidsByProduct(productId) {
  const response = await fetch(`${API_BASE_URL}/bids/product/${productId}`);
  return handleResponse(response);
}

export async function getHighestBid(productId) {
  const response = await fetch(`${API_BASE_URL}/bids/product/${productId}/highest`);
  if (response.status === 404) {
    return null; // No bids yet for this product
  }
  return handleResponse(response);
}
