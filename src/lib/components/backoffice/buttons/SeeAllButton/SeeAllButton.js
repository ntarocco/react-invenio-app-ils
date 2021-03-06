import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import { Button } from 'semantic-ui-react';
import PropTypes from 'prop-types';

export default class SeeAllButton extends Component {
  render() {
    const { fluid, disabled, to } = this.props;
    return (
      <Button as={Link} to={to} size="small" disabled={disabled} fluid={fluid}>
        See all
      </Button>
    );
  }
}

SeeAllButton.propTypes = {
  fluid: PropTypes.bool,
  disabled: PropTypes.bool,
  to: PropTypes.string.isRequired,
};

SeeAllButton.defaultProps = {
  fluid: false,
  disabled: false,
};
