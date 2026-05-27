import { useCallback, useState } from 'react';
import { printElement, printUrl } from '@/utils/printUtils.js';

export const usePrint = () => {
  const [isPrinting, setIsPrinting] = useState(false);

  const handlePrintElement = useCallback((elementId) => {
    setIsPrinting(true);
    try {
      printElement(elementId);
    } catch (error) {
      console.error('Error during printing element:', error);
    } finally {
      setIsPrinting(false);
    }
  }, []);

  const handlePrintUrl = useCallback((url) => {
    setIsPrinting(true);
    try {
      printUrl(url);
    } catch (error) {
      console.error('Error during printing URL:', error);
    } finally {
      setIsPrinting(false);
    }
  }, []);

  return {
    isPrinting,
    printElement: handlePrintElement,
    printUrl: handlePrintUrl,
  };
};

export default usePrint;
