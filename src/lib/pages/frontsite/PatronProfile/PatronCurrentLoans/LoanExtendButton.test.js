import testData from '@testData/loans.json';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import React from 'react';
import { LoanExtendButton } from './LoanExtendButton';
import { DateTime } from 'luxon';

jest.mock('@config');
Settings.defaultZoneName = 'utc';
const dateTime = DateTime.fromISO('2020-01-01T11:05:00+01:00');
const endDate = dateTime.plus({ months: 1 });

describe('Extend loan button tests', () => {
  let component;
  afterEach(() => {
    if (component) {
      component.unmount();
    }
  });

  it('should match snapshot', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        end_date: endDate,
        extension_count: 0,
      },
    };

    const component = mount(
      <LoanExtendButton loan={loan} onSuccess={() => {}} onError={() => {}} />
    );
    expect(component).toMatchSnapshot();
  });

  it('should be disabled if the document is overbooked', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        end_date: endDate,
        extension_count: 0,
        document: { circulation: { overbooked: true } },
      },
    };

    const component = mount(
      <LoanExtendButton loan={loan} onSuccess={() => {}} onError={() => {}} />
    );
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });

  it('should be disabled if patron has reached maximum extensions', () => {
    const loan = {
      availableActions: { extend: 'url/extend' },
      metadata: {
        ...testData[0],
        end_date: endDate,
        extension_count: 3,
      },
    };

    const component = mount(
      <LoanExtendButton loan={loan} onSuccess={() => {}} onError={() => {}} />
    );
    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });

  it('should be disabled if extend action is not in available actions', () => {
    const loan = {
      availableActions: {},
      metadata: {
        ...testData[0],
        end_date: endDate,
        extension_count: 0,
      },
    };

    const component = mount(
      <LoanExtendButton loan={loan} onSuccess={() => {}} onError={() => {}} />
    );

    const btn = component.find('Button');
    expect(btn.props().disabled).toBe(true);
  });
});
