import React from 'react';
import PropTypes from 'prop-types';
import lodash from 'lodash';

import { Button, ButtonToolbar, Col, FormGroup } from 'components/graylog';

import { emptyBooleanExpressionConfig } from 'logic/alerts/AggregationExpressionConfig';

import NumberExpression from './AggregationConditionExpressions/NumberExpression';
import NumberRefExpression from './AggregationConditionExpressions/NumberRefExpression';
/* eslint-disable import/no-cycle */
// We render the expression tree recursively, so complex expressions need to refer back to this component
import BooleanExpression from './AggregationConditionExpressions/BooleanExpression';
import ComparisonExpression from './AggregationConditionExpressions/ComparisonExpression';
/* eslint-enable import/no-cycle */

import styles from './AggregationConditionExpression.css';

class AggregationConditionExpression extends React.Component {
  static propTypes = {
    eventDefinition: PropTypes.object.isRequired,
    validation: PropTypes.object.isRequired,
    formattedFields: PropTypes.array.isRequired,
    aggregationFunctions: PropTypes.array.isRequired,
    onChange: PropTypes.func.isRequired,
    expression: PropTypes.shape({
      expr: PropTypes.string,
      left: PropTypes.object,
      right: PropTypes.object,
    }).isRequired,
    level: PropTypes.number, // Internal use only
    renderLabel: PropTypes.bool,
  };

  static defaultProps = {
    level: 0,
    renderLabel: true,
  };

  handleAddExpression = () => {
    const { expression, onChange } = this.props;
    const nextExpression = emptyBooleanExpressionConfig({ operator: '&&', expression });
    onChange('conditions', nextExpression);
  };

  handleDeleteExpression = () => {
    const { onChange } = this.props;
    onChange('conditions', null);
  };

  handleChildChange = (branch) => {
    return (key, update) => {
      const { expression, onChange } = this.props;

      let nextUpdate = update;
      if (key === 'conditions') {
        if (update === null) {
          // This happens when one of the branches got removed. Replace the current tree with the still existing branch.
          nextUpdate = expression[(branch === 'left' ? 'right' : 'left')];
        } else {
          // Propagate the update in the expression tree.
          const nextExpression = lodash.cloneDeep(expression);
          nextExpression[branch] = update;
          nextUpdate = nextExpression;
        }
      }

      onChange(key, nextUpdate);
    };
  };

  render() {
    const { expression, renderLabel } = this.props;
    switch (expression.expr) {
      case 'number-ref':
        return <NumberRefExpression {...this.props} />;
      case 'number':
        return <NumberExpression {...this.props} />;
      case '&&':
      case '||':
        return <BooleanExpression {...this.props} onChildChange={this.handleChildChange} />;
      case '<':
      case '<=':
      case '>':
      case '>=':
      case '==':
      default:
        return (
          <>
            <ComparisonExpression {...this.props} onChildChange={this.handleChildChange} />
            <Col md={2}>
              <FormGroup>
                <div className={renderLabel ? styles.formControlNoLabel : undefined}>
                  <ButtonToolbar>
                    <Button bsSize="sm" onClick={this.handleDeleteExpression}><i className="fa fa-minus fa-fw" /></Button>
                    <Button bsSize="sm" onClick={this.handleAddExpression}><i className="fa fa-plus fa-fw" /></Button>
                  </ButtonToolbar>
                </div>
              </FormGroup>
            </Col>
          </>
        );
    }
  }
}

export default AggregationConditionExpression;