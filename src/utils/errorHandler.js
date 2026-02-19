/**
 * Utility function to extract user-friendly error messages from API errors
 * @param {Error} error - The error object from API call
 * @returns {string} - User-friendly error message
 */
export const getErrorMessage = (error) => {
  if (!error) {
    return "An unexpected error occurred. Please try again.";
  }

  // Check for network errors
  if (error.message === "Network Error" || !error.response) {
    return "Unable to connect to the server. Please check your internet connection and try again.";
  }

  // Check for specific HTTP status codes
  const status = error.response?.status;
  if (status === 401) {
    return "Your session has expired. Please log in again.";
  }
  if (status === 403) {
    return "You don't have permission to perform this action.";
  }
  if (status === 404) {
    return "The requested resource was not found.";
  }
  if (status === 500) {
    return "Server error occurred. Please try again later.";
  }
  if (status >= 500) {
    return "Server error occurred. Please try again later.";
  }

  // Check for custom error messages from API
  const apiMessage = error.response?.data?.message || 
                     error.response?.data?.error ||
                     error.response?.data?.msg;

  if (apiMessage) {
    return typeof apiMessage === 'string' ? apiMessage : "An error occurred. Please try again.";
  }

  // Fallback to generic message
  return error.message || "An unexpected error occurred. Please try again.";
};

/**
 * Creates a standardized error object with user-friendly message
 * @param {Error} error - The original error
 * @param {string} defaultMessage - Default message if error parsing fails
 * @returns {Error} - Error with user-friendly message
 */
export const createUserFriendlyError = (error, defaultMessage = "An error occurred. Please try again.") => {
  const message = getErrorMessage(error) || defaultMessage;
  const friendlyError = new Error(message);
  friendlyError.originalError = error;
  friendlyError.status = error?.response?.status;
  return friendlyError;
};

