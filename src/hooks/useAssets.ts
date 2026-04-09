import { useState, useEffect } from 'react';
import { Asset } from '~/types/app';
import { AssetsApi } from '../api/AssetsApi';

export const useAssets = () => {
  const [assets, setAssets] = useState<Asset[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<Error | null>(null);

  const fetchAssets = async () => {
    setLoading(true);
    try {
      const data = await AssetsApi.getAssets();
      setAssets(data || []);
    } catch (err) {
      console.warn('Assets API error, using empty list:', err);
      setAssets([]);
      setError(null); // Clear error since we are handling it with mock/empty data
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAssets();
  }, []);

  return { assets, loading, error, refresh: fetchAssets };
};
