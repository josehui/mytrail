// Client-side
export const handleFetchError = async (res: Response, msg: string = 'Error fetching data') => {
  if (!res.ok) {
    const error = new Error(msg);
    // Attach extra info to the error object.
    error.info = await res.text();
    error.status = res.status;
    error.statusText = res?.statusText;
    throw error;
  }
};
