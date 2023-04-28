import { useEffect } from 'react';

const useScript = (url, callback) => {
  useEffect(() => {
    const script = document.createElement('script');

    script.src = url;
    script.async = false;

    document.body.appendChild(script);

    script.onload = function () {
      callback();
    };

    return () => {
      document.body.removeChild(script);
    };

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [url]);
};

export default useScript;
