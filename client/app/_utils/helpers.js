import jwt from "jsonwebtoken";

/**
 * Decodes a JWT access token and returns the payload.
 * @param {string} token - The JWT access token to decode.
 * @returns {object|null} - The decoded payload or null if the token is invalid.
 */
export const decodeJwt = (token) => {
  try {
    // Decode the token without verifying the signature
    const decoded = jwt.decode(token);
    return decoded; // Return the decoded payload
  } catch (error) {
    console.error("Error decoding JWT:", error);
    return null; // Return null if decoding fails
  }
};

/**
 * Capitalizes the first letter of a string.
 * @param {string} str - The string to capitalize.
 * @returns {string} - The capitalized string.
 */
export const capitalize = (str) => {
  if (!str) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
};
