import { memo, PropsWithChildren, Children } from 'react';

type Props = {
  children: React.ReactElement<FlexItemProps> | Array<React.ReactElement<FlexItemProps, 'div'>>;
  flexDirection?: React.CSSProperties['flexDirection'];
};
export const FlexBox = memo<Props>(({ children }) => {
  return (
    <div style={{ display: 'flex' }}>
      {Children.map(children, (child) => {
        const isFlexItem =
          typeof child.type !== 'string' &&
          'displayName' in child.type &&
          child.type.displayName === FlexItem.displayName;

        return isFlexItem ? child : <FlexItem>{child}</FlexItem>;
      })}
    </div>
  );
});
FlexBox.displayName = 'flexBox';

type FlexItemProps = {
  flex?: React.CSSProperties['flex'];
};
export const FlexItem = memo<PropsWithChildren<FlexItemProps>>(({ children, flex = '1 1 auto' }) => {
  return <div style={{ flex }}>{children}</div>;
});
FlexItem.displayName = 'flexItem';

export const A = memo(() => {
  return (
    <FlexBox>
      <span>qwe</span>
      <FlexItem>
        <div>asd</div>
      </FlexItem>
      <div>zxc</div>
    </FlexBox>
  );
});
