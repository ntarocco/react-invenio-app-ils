import { connect } from 'react-redux';
import { fetchDocumentRequestDetails } from '../state/actions';
import DocumentRequestStepsComponent from './DocumentRequestSteps';

const mapStateToProps = state => ({
  ...state.documentRequestDetails,
});

const mapDispatchToProps = dispatch => ({
  fetchDocumentRequestDetails: documentRequestPid =>
    dispatch(fetchDocumentRequestDetails(documentRequestPid)),
});

export const DocumentRequestSteps = connect(
  mapStateToProps,
  mapDispatchToProps
)(DocumentRequestStepsComponent);
