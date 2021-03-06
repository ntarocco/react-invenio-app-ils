import { connect } from 'react-redux';
import { sendSuccessNotification } from '@components/Notifications/actions';
import { ItemForm as ItemFormComponent } from './ItemForm';

const mapDispatchToProps = dispatch => ({
  sendSuccessNotification: (title, content) =>
    dispatch(sendSuccessNotification(title, content)),
});

export const ItemForm = connect(null, mapDispatchToProps)(ItemFormComponent);
