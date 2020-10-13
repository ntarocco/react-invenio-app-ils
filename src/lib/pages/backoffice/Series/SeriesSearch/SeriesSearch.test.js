import { ResultsTable } from '@components/ResultsTable/ResultsTable';
import { mount } from 'enzyme';
import { Settings } from 'luxon';
import React from 'react';
import { Button } from 'semantic-ui-react';

Settings.defaultZoneName = 'utc';
const stringDate = '2018-01-01T11:05:00+01:00';

const data = [
  {
    id: '3',
    created: stringDate,
    updated: stringDate,
    pid: '3',
    metadata: {
      pid: '3',
      authors: ['Author1'],
      title: 'This is a title',
      abstract: 'This is an abstract',
      mode_of_issuance: 'SERIAL',
      languages: ['en'],
      related_records: [],
    },
  },
];

const mockViewDetails = jest.fn();
const columns = [
  {
    title: 'view',
    field: '',
    formatter: () => <Button onClick={mockViewDetails}>View</Button>,
  },
  { title: 'Title', field: 'metadata.title' },
];

let component;
afterEach(() => {
  mockViewDetails.mockClear();
  component.unmount();
});

describe('SeriesSearch ResultsTable tests', () => {
  it('should not render when empty results', () => {
    component = mount(<ResultsTable data={[]} columns={columns} />);
    expect(component).toMatchSnapshot();
  });

  it('should render a list of results', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    expect(component).toMatchSnapshot();
    const firstResult = data[0];
    const resultRows = component
      .find('TableRow')
      .filterWhere(
        element => element.prop('data-test') === firstResult.metadata.pid
      );
    expect(resultRows).toHaveLength(1);

    const mappedStatusElements = resultRows
      .find('TableCell')
      .filterWhere(
        element => element.prop('data-test') === `1-${firstResult.metadata.pid}`
      );
    expect(mappedStatusElements).toHaveLength(1);
    expect(mappedStatusElements.text()).toEqual(firstResult.metadata.title);
  });

  it('should call click handler on view details click', () => {
    component = mount(<ResultsTable data={data} columns={columns} />);
    const firstId = data[0].pid;
    component
      .find('TableCell')
      .filterWhere(element => element.prop('data-test') === `0-${firstId}`)
      .find('button')
      .simulate('click');
    expect(mockViewDetails).toHaveBeenCalled();
  });
});
