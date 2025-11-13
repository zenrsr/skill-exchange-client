import { useCallback, useState } from 'react';

const useApi = (initialValue = null) => {
  const [data, setData] = useState(initialValue);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const request = useCallback(async (promiseFactory) => {
    setLoading(true);
    setError(null);
    try {
      const response = await promiseFactory();
      setData(response.data);
      return response.data;
    } catch (err) {
      const message = err.response?.data?.message || 'Something went wrong';
      setError(message);
      throw err;
    } finally {
      setLoading(false);
    }
  }, []);

  return { data, loading, error, setData, request };
};

export default useApi;
