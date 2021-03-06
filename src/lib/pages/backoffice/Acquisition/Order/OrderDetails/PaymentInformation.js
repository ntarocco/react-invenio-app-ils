import { InfoMessage } from '@components/InfoMessage';
import { formatPrice } from '@api/utils';
import { MetadataTable } from '@components/backoffice/MetadataTable';
import { invenioConfig } from '@config';
import PropTypes from 'prop-types';
import React from 'react';
import { Grid, Icon, Popup } from 'semantic-ui-react';

export class PaymentInformation extends React.Component {
  render() {
    const { order } = this.props;
    const { payment } = order;

    if (payment === undefined)
      return <InfoMessage title="There is no payment information" />;

    const leftTable = [
      {
        name: `Total (${invenioConfig.APP.DEFAULT_CURRENCY})`,
        value: formatPrice(order.grand_total_main_currency),
      },
      {
        name:
          order.grand_total && order.grand_total.currency
            ? `Total (${order.grand_total.currency})`
            : 'Total',
        value: formatPrice(order.grand_total),
      },
      { name: 'Mode', value: payment.mode },
      {
        name: (
          <>
            IPR ID{' '}
            <Popup
              content="Internal purchase requisition ID"
              trigger={<Icon name="info circle" size="large" />}
            />
          </>
        ),
        value: payment.internal_purchase_requisition_id,
      },
      { name: 'Notes', value: payment.debit_note },
    ];
    const rightTable = [
      {
        name: `Debit cost (${invenioConfig.APP.DEFAULT_CURRENCY})`,
        value: formatPrice(payment.debit_cost_main_currency),
      },
      {
        name:
          payment.debit_cost && payment.debit_cost.currency
            ? `Debit cost (${payment.debit_cost.currency})`
            : 'Debit cost',
        value: formatPrice(payment.debit_cost),
      },
      {
        name: 'Debit date',
        value: payment.debit_date ? payment.debit_date : '-',
      },
      { name: 'Funds', value: order.funds ? order.funds.join(', ') : null },
    ];
    return (
      <Grid columns={2} id="payment-info">
        <Grid.Row>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={leftTable} />
          </Grid.Column>
          <Grid.Column>
            <MetadataTable labelWidth={5} rows={rightTable} />
          </Grid.Column>
        </Grid.Row>
      </Grid>
    );
  }
}

PaymentInformation.propTypes = {
  order: PropTypes.object.isRequired,
};
