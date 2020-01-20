import React, { useRef, useState } from 'react';

import { Toolbar, ToolbarButton, Spinner } from '@wordpress/components';

import Modal from '@material-ui/core/Modal';

import { makeStyles } from '@material-ui/core/styles';
import { Button, Box, Typography } from '@material-ui/core';
import propTypes from './propTypes';

export const PostModalAction = {
  create: 'create',
  edit: 'edit',
  delete: 'delete'
};

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

  const handleClose = e => {
    if (e === true) {
      onClose(PostModalAction.delete);
      setOpen(null);
    }

    if (loading) {
      return;
    }

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
          onClick={() => handleOpen(PostModalAction.create)}
          subscript="CREATE"
        />
        {postId && (
          <ToolbarButton
            extraProps={{ style: { width: '40px' } }}
            onClick={() => handleOpen(PostModalAction.edit)}
            subscript="EDIT"
          />
        )}
      </Toolbar>
      <Modal
        style={{ zIndex: 999999999 }}
        open={Boolean(open)}
        onClose={handleClose}
        onEscapeKeyDown={handleClose}
      >
        <div className={classes.paper}>
          <Box position="absolute" top="10px" right="10px">
            <Button
              style={{
                background: '#0085ba',
                borderColor: '#0073aa #006799 #006799',
                boxShadow: '0 1px 0 #006799',
                color: '#fff'
              }}
              onClick={handleClose}
            >
              Close
            </Button>
          </Box>
          {loading && (
            <div className={classes.spinner}>
              {typeof loading === 'string' && (
                <Typography>{loading}</Typography>
              )}
              <Spinner />
            </div>
          )}
          <iframe
            title={postId || visualType}
            src={
              open === 'create'
                ? `/wp-admin/post-new.php?post_type=hurumap-visual&visual_selector=hidden&visual_type=${visualType}`
                : `/wp-admin/post.php?post=${postId}&action=edit&visual_selector=hidden`
            }
            ref={iframeRef}
            frameBorder="0"
            width="100%"
            height="100%"
            onLoad={e => {
              if (loading === 'Deleting...') {
                handleClose(true);
                return;
              }
              const iframe = e.target;
              const doc = iframe.contentDocument;
              const css =
                'html { padding: 0; } #wpadminbar, #wpfooter, #adminmenumain, #screen-meta, #screen-meta-links, .update-nag, .preview { display: none; } #wpcontent { margin: 0; }';
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

              // On publish handler
              const publishButton = doc.getElementById('publish');
              const originalOnClick = publishButton.onclick;
              publishButton.onclick = () => {
                setLoading('Saving...');
                if (originalOnClick) {
                  originalOnClick();
                }
              };

              // On delete handler
              const moveToTrashLink = doc.getElementsByClassName(
                'submitdelete'
              )[0];
              const moveToTrashLinkOnClick = moveToTrashLink.onclick;
              moveToTrashLink.onclick = () => {
                setLoading('Deleting...');
                if (moveToTrashLinkOnClick) {
                  moveToTrashLinkOnClick();
                }
              };

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
