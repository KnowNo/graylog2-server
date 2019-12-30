import React, { forwardRef, useMemo } from 'react';
import PropTypes from 'prop-types';
import styled, { css } from 'styled-components';
// eslint-disable-next-line no-restricted-imports
import { ListGroupItem as BootstrapListGroupItem } from 'react-bootstrap';
import { darken } from 'polished';

import { colorLevel } from 'theme/util';
import contrastingColor from 'util/contrastingColor';
import bsStyleThemeVariant from './variants/bsStyle';

const listGroupItemStyles = (hex) => {
  const backgroundColor = colorLevel(hex, -9);
  const textColor = colorLevel(hex, 6);

  return css`
    && {
      color: ${textColor};
      background-color: ${backgroundColor};

      &.list-group-item-action {
        &:hover,
        &:focus {
          color: ${textColor};
          background-color: ${darken(0.05, backgroundColor)};
        }

        &.active {
          color: ${contrastingColor(textColor)};
          background-color: ${textColor};
          border-color: ${textColor};
        }
      }

      &.list-group-item {
        &.active {
          color: ${contrastingColor(hex)};
          background-color: ${hex};
          border-color: ${hex};
        }
      }
    }
  `;
};

const ListGroupItem = forwardRef(({ bsStyle, ...props }, ref) => {
  const StyledListGroupItem = useMemo(
    () => {
      return styled(BootstrapListGroupItem)(({ theme }) => css`
        &.list-group-item-action {
          color: ${theme.color.primary.tre};

          &:hover,
          &:focus {
            color: ${theme.color.primary.tre};
            background-color: ${theme.color.secondary.due};
          }

          &:active {
            color: ${contrastingColor(theme.color.secondary.tre)};
            background-color: ${theme.color.secondary.tre};
          }
        }

        &.list-group-item {
          background-color: ${theme.color.primary.due};
          border-color: ${theme.color.secondary.tre};

          &.disabled,
          &:disabled {
            color: ${theme.color.primary.tre};
            background-color: ${theme.color.primary.due};
          }
        }

        ${bsStyleThemeVariant(listGroupItemStyles)}
      `);
    },
    [bsStyle],
  );

  return (
    <StyledListGroupItem bsStyle={bsStyle} ref={ref} {...props} />
  );
});

ListGroupItem.propTypes = {
  /* Bootstrap `bsStyle` variant name */
  bsStyle: PropTypes.oneOf(['success', 'warning', 'danger', 'info']),
};

ListGroupItem.defaultProps = {
  bsStyle: undefined,
};

export default ListGroupItem;
