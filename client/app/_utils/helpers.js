export const capitalize = (str) => {
  if (!str) return;
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export async function tryCatchWrapper(callback, options) {
  try {
    return await callback();
  } catch (error) {
    console.error(`Error caught: ${error.message}`);
    return Promise.resolve({
      success: false,
      message: options?.errorMessage || "Error occurred",
    });
  }
}

export const fetchData = async (
  dispatch,
  apiCall,
  { loadingAction, successAction, errorAction }
) => {
  dispatch(loadingAction());

  try {
    const data = await apiCall();
    dispatch(successAction(data));
  } catch (err) {
    dispatch(errorAction(err.message));
  }
};
