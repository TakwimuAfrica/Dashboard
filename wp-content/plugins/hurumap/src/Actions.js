import React from 'react';

import Paper from '@material-ui/core/Paper';
import ButtonBase from '@material-ui/core/ButtonBase';
import Popper from '@material-ui/core/Popper';
import MenuList from '@material-ui/core/MenuList';
import MenuItem from '@material-ui/core/MenuItem';
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
