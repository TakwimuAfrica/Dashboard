import React from 'react';

import {
  Paper,
  ButtonBase,
  Popper,
  MenuList,
  MenuItem
} from '@material-ui/core';
import propTypes from './propTypes';

function Actions({ id, actions, onAction }) {
  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleClick = event => {
    setAnchorEl(prev => (prev ? null : event.currentTarget));
  };

  return (
    <div>
      <ButtonBase variant="contained" onClick={handleClick}>
        Actions
      </ButtonBase>
      <Popper id={id} open={Boolean(anchorEl)} anchorEl={anchorEl}>
        <Paper>
          <MenuList>
            {actions &&
              actions.map(action => (
                <MenuItem
                  color="secondary"
                  onClick={() => onAction(action.value)}
                >
                  {action.label}
                </MenuItem>
              ))}
          </MenuList>
        </Paper>
      </Popper>
    </div>
  );
}

Actions.propTypes = {
  id: propTypes.string.isRequired,
  actions: propTypes.arrayOf(propTypes.shape({})).isRequired,
  onAction: propTypes.func
};

Actions.defaultProps = {
  onAction: undefined
};

export default Actions;
