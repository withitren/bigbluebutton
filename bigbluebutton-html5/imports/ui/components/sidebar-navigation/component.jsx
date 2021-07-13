import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import Resizable from 're-resizable';
import { ACTIONS } from '../layout/enums';
import UserListContainer from '../user-list/container';

const propTypes = {
  top: PropTypes.number.isRequired,
  left: PropTypes.number.isRequired,
  zIndex: PropTypes.number.isRequired,
  minWidth: PropTypes.number.isRequired,
  width: PropTypes.number.isRequired,
  maxWidth: PropTypes.number.isRequired,
  height: PropTypes.number.isRequired,
  isResizable: PropTypes.bool.isRequired,
  resizableEdge: PropTypes.objectOf(PropTypes.bool).isRequired,
  contextDispatch: PropTypes.func.isRequired,
};

const SidebarNavigation = (props) => {
  const {
    // display,
    top,
    left,
    zIndex,
    minWidth,
    width,
    maxWidth,
    height,
    isResizable,
    resizableEdge,
    contextDispatch,
  } = props;

  const [resizableWidth, setResizableWidth] = useState(width);
  const [isResizing, setIsResizing] = useState(false);
  const [resizeStartWidth, setResizeStartWidth] = useState(0);

  useEffect(() => {
    if (!isResizing) setResizableWidth(width);
  }, [width]);

  useEffect(() => {
  }, [resizeStartWidth]);

  const setSidebarNavWidth = (dWidth) => {
    const newWidth = resizeStartWidth + dWidth;

    setResizableWidth(newWidth);

    contextDispatch({
      type: ACTIONS.SET_SIDEBAR_NAVIGATION_SIZE,
      value: {
        width: newWidth,
        browserWidth: window.innerWidth,
        browserHeight: window.innerHeight,
      },
    });
  };

  return (
    <Resizable
      minWidth={minWidth}
      maxWidth={maxWidth}
      size={{
        width,
        height,
      }}
      enable={{
        top: isResizable && resizableEdge.top,
        left: isResizable && resizableEdge.left,
        bottom: isResizable && resizableEdge.bottom,
        right: isResizable && resizableEdge.right,
      }}
      handleWrapperClass="resizeSidebarNavWrapper"
      onResizeStart={() => {
        setIsResizing(true);
        setResizeStartWidth(resizableWidth);
      }}
      onResize={(...[,,, delta]) => setSidebarNavWidth(delta.width)}
      onResizeStop={() => {
        setIsResizing(false);
        setResizeStartWidth(0);
      }}
      style={{
        position: 'absolute',
        top,
        left,
        zIndex,
        width,
        height,
      }}
    >
      <UserListContainer />
    </Resizable>
  );
};

SidebarNavigation.propTypes = propTypes;
export default SidebarNavigation;
