import React, { useRef, useState } from 'react';

import { Toolbar, ToolbarButton, Spinner } from '@wordpress/components';

import Modal from '@material-ui/core/Modal';

import { makeStyles } from '@material-ui/core/styles';
import propTypes from './propTypes';

const useStyles = makeStyles(theme => ({
  paper: {
    position: 'absolute',
    backgroundColor: theme.palette.background.paper,
    border: '0.125rem solid #000',
    boxShadow: theme.shadows[5],
    top: '10%',
    left: '10%',
    height: '80%',
    width: '80%'
  },
  spinner: {
    position: 'absolute',
    background: 'whitesmoke',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    zIndex: 999,
    top: 0,
    left: 0,
    right: 0,
    bottom: 0
  }
}));

export default function PostModal({ postId, visualType, onClose }) {
  const classes = useStyles();
  const iframeRef = useRef();

  const [open, setOpen] = useState(null);
  const [loading, setLoading] = useState(true);

  const handleOpen = action => {
    setLoading(true);
    setOpen(action);
  };

  const handleClose = () => {
    const iframe = iframeRef.current;
    const doc = iframe.contentDocument;

    const id = doc.getElementById('post_ID').value;
    const postStatusEl = doc.getElementById('post-status-display');
    const isPublished =
      (postStatusEl.value || postStatusEl.innerHTML || '')
        .trim()
        .toLowerCase() === 'published';

    onClose(open, isPublished, id);
    setOpen(null);
  };

  return (
    <div>
      <Toolbar>
        <ToolbarButton
          extraProps={{ style: { width: '65px' } }}
          onClick={() => handleOpen('create')}
          subscript="CREATE"
        />
        {postId && (
          <ToolbarButton
            extraProps={{ style: { width: '40px' } }}
            onClick={() => handleOpen('edit')}
            subscript="EDIT"
          />
        )}
      </Toolbar>
      <Modal
        style={{ zIndex: 999999999 }}
        open={Boolean(open)}
        onClose={handleClose}
      >
        <div className={classes.paper}>
          {loading && (
            <div className={classes.spinner}>
              <Spinner />
            </div>
          )}
          <iframe
            title={postId || visualType}
            src={
              open === 'create'
                ? `http://localhost:8080/wp-admin/post-new.php?post_type=hurumap-visual&visual_selector=hidden&visual_type=${visualType}`
                : `http://localhost:8080/wp-admin/post.php?post=${postId}&action=edit&visual_selector=hidden`
            }
            ref={iframeRef}
            frameBorder="0"
            width="100%"
            height="100%"
            onLoad={e => {
              const iframe = e.target;
              const doc = iframe.contentDocument;
              const css =
                'html { padding: 0; } #wpadminbar, #wpfooter, #adminmenumain, #screen-meta, #screen-meta-links, .update-nag { display: none; } #wpcontent { margin: 0; }';
              const head = doc.head || doc.getElementsByTagName('head')[0];
              const style = doc.createElement('style');

              head.appendChild(style);

              style.type = 'text/css';
              if (style.styleSheet) {
                // This is required for IE8 and below.
                style.styleSheet.cssText = css;
              } else {
                style.appendChild(document.createTextNode(css));
              }

              setLoading(false);
            }}
          />
        </div>
      </Modal>
    </div>
  );
}

PostModal.propTypes = {
  postId: propTypes.oneOfType([propTypes.string, propTypes.number]),
  visualType: propTypes.oneOf(['hurumap', 'flourish']).isRequired,
  onClose: propTypes.func.isRequired
};

PostModal.defaultProps = {
  postId: undefined
};
