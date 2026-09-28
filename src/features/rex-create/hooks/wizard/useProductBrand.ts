import { useCallback, useState } from 'react';

export function useProductBrand() {
  const [brandName, setBrandName] = useState('');
  const [productName, setProductName] = useState('');

  const reset = useCallback(() => {
    setBrandName('');
    setProductName('');
  }, []);

  const prefillFrom = useCallback(
    (source: {
      brand_name: string | null | undefined;
      product_name: string | null | undefined;
    }) => {
      setBrandName(source.brand_name ?? '');
      setProductName(source.product_name ?? '');
    },
    [],
  );

  return { brandName, setBrandName, productName, setProductName, reset, prefillFrom };
}
