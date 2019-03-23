## react-use-timeout

React hooks that wrapper standard JS `setTimeout` and `setInterval`.

### Why would I use this?

#### Helps prevent memory leaks.

Normally you would have to remember to clear your unfinished timeouts before a component is detached. For example to manage a simple timeout:

```
import React, {useEffect, useRef} from 'react';

export default function Example() {
  // save off the id of the timeout so we can cancel it later.
  const timeout = useRef();

  useEffect(() => {
    // start timeout
    timeout.current = setTimeout(doSomething, 30000);

    // cleanup function to cancel the timeout if it hasn't finished.
    return () => {
      if (timeout.current) {
        clearTimeout(timeout.current);
      }
    };
  }, []);

  return <div />
}
```

If you forget to return a cleanup function from the `useEffect` that clears the timeout, then it could cause a memory leak (depending on what variables are held in the closure) or cause a react warning if the callback changes state on the component but the component is unmounted befire the timeout fires.

#### Less code

Instead of the above example of using a `setTimeout`, this is the same code with the hook:

```
import React, {useEffect} from 'react';
import {useTimeout} from 'react-use-timeout';

export default function Example() {
  const timeout = useTimeout(doSomething, 30000);

  useEffect(() => {
    timeout.start();
  }, []);

  return <div />
}
```

#### Mockable for testing

It is easier to mock these hooks then to mock `setTimeout`.

Examples in Jest:

```
// Mock the useTimeout hook to execute all timeouts at 0ms
jest.mock('react-use-timeout', () => {
  return {
    useTimeout: jest.fn(callback => setTimeout(callback, 0)),
  };
});
```

```
// Mock the hooks to never execute timeouts
jest.mock('react-use-timeout', () => {
  return {
    useTimeout: () => {},
    useInterval: () => {},
  };
});
```

### How to Use

You can install this library using

```
npm add react-use-timeout
```
or
```
yarn add react-use-timeout
```

Then you can import it into your component

```
import {useTimeout, useInterval} from 'react-use-timeout';
```

#### useTimeout

Call the hook to get an instance of a timeout. You pass a callback to execute, and optionally a timeout to execute it at (the default is 0ms). _Note that the timeout does not start yet. You need to call `.start()` on the returned object._

The returned `timeout` instance provides 2 functions:

* `.start(timeout)` : Start the timeout. Optionally you can pass a new timeout duration. If passed, this will override the duration passed to `useTimeout()`
* `.stop()` : Cancels the timeout.

```
import React, {useEffect, useCallback, useState} from 'react';
import {useTimeout} from 'react-use-timeout';

// This component would change it's text color from green to red 10 seconds after it was mounted.
export default function Example() {
  const [color, setColor] = useState('green');

  const changeColor = useCallback(() => {
    setColor('red');
  });

  const timeout = useTimeout(changeColor, 10000);

  useEffect(() => {
    timeout.start();
  }, []);

  return <div style={{color}} />
}
```

#### useInterval

Call the hook to get an instance of an interval. You pass a callback to execute, and optionally a interval to execute it at. _Note that the interval does not start yet. You need to call `.start()` on the returned object._

The returned `interval` instance provides 2 functions:

* `.start(timeout)` : Start the intrval. Optionally you can pass a new timeout duration. If passed, this will override the duration passed to `useInterval()`
* `.stop()` : Cancels the interval.

```
import React, {useEffect, useCallback, useState} from 'react';
import {useInterval} from 'react-use-timeout';

// This component would alternate it's color between green and red each 1 second after it was mounted.
export default function Example() {
  const [color, setColor] = useState('green');

  const toggleColor = useCallback(() => {
    setColor(color === 'green' ? 'red', 'green');
  });

  const interval = useInterval(toggleColor, 1000);

  useEffect(() => {
    interval.start();
  }, []);

  return <div style={{color}} />
}
```
