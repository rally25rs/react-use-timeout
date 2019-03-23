'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

function _interopDefault (ex) { return (ex && (typeof ex === 'object') && 'default' in ex) ? ex['default'] : ex; }

var React = _interopDefault(require('react'));

function useTimeout(callback, timeout = 0) {
  const timeoutId = React.useRef();
  const handler = React.useMemo(() => {
    return {
      start(overrideTimeout) {
        handler.stop();
        timeoutId.current = setTimeout(callback, overrideTimeout === undefined ? timeout : overrideTimeout);
      },

      stop() {
        if (timeoutId.current) {
          clearTimeout(timeoutId.current);
        }
      },

      restart() {
        handler.stop();
        handler.start();
      }

    };
  }, [callback, timeout]);
  React.useEffect(() => {
    return () => {
      handler.stop();
    };
  }, []);
  return handler;
}

function useInterval(callback, interval) {
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
      }

    };
  }, [callback, interval]);
  React.useEffect(() => {
    return () => {
      handler.stop();
    };
  }, []);
  return handler;
}

exports.useInterval = useInterval;
exports.useTimeout = useTimeout;
