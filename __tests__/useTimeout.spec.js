import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import {pause} from './testUtils';
import useTimeout from '../src/useTimeout';

function TestComponent(props) {
  const {callback, duration, perform} = props;
  const timeout = useTimeout(callback, duration);

  React.useEffect(() => {
    perform(timeout);

    return () => {
      timeout.stop();
    };
  }, []);

  return <span>test</span>;
}

describe('useTimeout hook', () => {
  let fixture;

  beforeEach(() => {
    fixture = {
      render(props) {
        fixture.el = document.createElement('div');

        act(() => {
          ReactDOM.render(<TestComponent {...props} />, fixture.el);
        });
      },
    };
  });

  afterEach(() => {
    fixture = undefined;
  });

  it('does not auto start timeout', done => {
    let callbackWasCalled = false;

    const callback = () => {
      callbackWasCalled = true;
    };

    const perform = async () => {
      await pause(10);
      expect(callbackWasCalled).toEqual(false);
      done();
    };

    fixture.render({callback, duration: 0, perform});
  });

  it('start() begins timeout', done => {
    let callbackWasCalled = false;

    const callback = () => {
      callbackWasCalled = true;
    };

    const perform = async timeout => {
      timeout.start();
      await pause(10);
      expect(callbackWasCalled).toEqual(true);
      done();
    };

    fixture.render({callback, duration: 0, perform});
  });

  it('start() can override duration', done => {
    let callbackWasCalled = false;

    const callback = () => {
      callbackWasCalled = true;
    };

    const perform = async timeout => {
      timeout.start(100);
      await pause(10);
      timeout.stop();
      expect(callbackWasCalled).toEqual(false);
      done();
    };

    fixture.render({callback, duration: 0, perform});
  });

  it('stop() cancels timeout', done => {
    let callbackWasCalled = false;

    const callback = () => {
      callbackWasCalled = true;
    };

    const perform = async timeout => {
      timeout.start();
      await pause(0);
      timeout.stop();
      await pause(20);
      expect(callbackWasCalled).toEqual(false);
      done();
    };

    fixture.render({callback, duration: 10, perform});
  });
});
