import { useState, useCallback, memo } from 'react';

import { DATA_T_ATTRIBUTE_NAME } from 'framework/tests/dom/dt';

type Props = {
  initiallyExpanded?: boolean;
  onToggle?: (isExpanded: boolean) => void;
  children: (isExpanded: boolean, toggle: () => void) => React.ReactNode;
  [DATA_T_ATTRIBUTE_NAME]?: string;
};
export const Spoiler = memo<Props>((props) => {
  const [isExpanded, setIsExpanded] = useState(!!props.initiallyExpanded);
  const onToggle = props.onToggle;
  const toggle = useCallback(() => {
    if (onToggle) {
      onToggle(!isExpanded);
    }
    setIsExpanded(!isExpanded);
  }, [onToggle, isExpanded]);

  const dtValue = props[DATA_T_ATTRIBUTE_NAME];

  return <div data-t={dtValue}>{props.children(isExpanded, toggle)}</div>;
});
