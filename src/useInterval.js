import React from 'react';

export default function useInterval(callback, interval) {
  const intervalId = React.useRef();
  const handler = React.useMemo(() => {
    return {
      start(overrideInterval) {
        handler.stop();
        intervalId.current = setInterval(callback, overrideInterval === undefined ? interval : overrideInterval);
      },

      stop() {
        if (intervalId.current) {
          clearInterval(intervalId.current);
        }
      },

      restart() {
        handler.stop();
        handler.start();
      },
    };
  }, [callback, interval]);

  React.useEffect(() => {
    return () => {
      handler.stop();
    };
  }, []);

  return handler;
}
