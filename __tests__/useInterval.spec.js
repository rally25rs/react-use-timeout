import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import {pause} from './testUtils';
import useInterval from '../src/useInterval';

function TestComponent(props) {
  const {callback, duration, perform} = props;
  const interval = useInterval(callback, duration);

  React.useEffect(() => {
    perform(interval);

    return () => {
      interval.stop();
    };
  }, []);

  return <span>test</span>;
}

describe('useInterval hook', () => {
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

  it('does not auto start interval', done => {
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

  it('start() begins interval', done => {
    let callbackWasCalled = false;

    const callback = () => {
      callbackWasCalled = true;
    };

    const perform = async interval => {
      interval.start();
      await pause(10);
      expect(callbackWasCalled).toEqual(true);
      done();
    };

    fixture.render({callback, duration: 0, perform});
  });

  it('stop() cancels interval', done => {
    let callbackWasCalled = false;

    const callback = () => {
      callbackWasCalled = true;
    };

    const perform = async interval => {
      interval.start();
      interval.stop();
      await pause(20);
      expect(callbackWasCalled).toEqual(false);
      done();
    };

    fixture.render({callback, duration: 10, perform});
  });
});
