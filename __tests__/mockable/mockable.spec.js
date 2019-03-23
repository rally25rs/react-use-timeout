import React from 'react';
import ReactDOM from 'react-dom';
import {act} from 'react-dom/test-utils';
import {pause} from '../testUtils';
import TestComponent from './TestComponent';

// Mock the useTimeout function to execute all timeouts at 0ms
jest.mock('../../index', () => {
  return {
    useTimeout: jest.fn(callback => setTimeout(callback, 0)),
  };
});

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

  it('can be mocked', done => {
    const callback = () => {
      done();
    };

    fixture.render({
      callback
    });
  });
});
