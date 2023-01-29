import { memo } from 'react';

import { popoverContainerId } from './shared';

const popoverContainerStyles: React.CSSProperties = {
  pointerEvents: 'none',
  position: 'absolute',
  minHeight: '100%',
  top: 0,
  left: 0,
  right: 0,
};

export const PopoverContainer = memo(() => {
  return <div id={popoverContainerId} style={popoverContainerStyles} />;
});
PopoverContainer.displayName = 'PopoverContainer';
