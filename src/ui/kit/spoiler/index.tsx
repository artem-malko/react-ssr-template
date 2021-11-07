import { useState, useCallback, memo } from 'react';
import * as React from 'react';
import { DATA_T_ATTRIBUTE_NAME } from 'tests/dom/dt';

type Props = {
  initiallyExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  children: (isExpanded: boolean, toggle: () => void) => React.ReactNode;
  [DATA_T_ATTRIBUTE_NAME]?: string;
};
export const Spoiler = memo<Props>((props) => {
  const [isExpanded, setIsExpanded] = useState(!!props.initiallyExpanded);
  const toggle = useCallback(() => {
    if (props.onToggle) {
      props.onToggle(!isExpanded);
    }
    setIsExpanded(!isExpanded);
  }, [props.onToggle, isExpanded]);

  const dtValue = props[DATA_T_ATTRIBUTE_NAME];

  return <div data-t={dtValue}>{props.children(isExpanded, toggle)}</div>;
});
