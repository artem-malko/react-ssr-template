export function lineClamped(linesCount: number, lineHeight: number): React.CSSProperties {
  return {
    display: '-webkit-box',
    lineHeight: `${lineHeight}px`,
    WebkitBoxOrient: 'vertical',
    WebkitLineClamp: linesCount,
    overflow: 'hidden',
    textOverflow: 'ellipsis',
    maxHeight: `${linesCount * lineHeight}px`,
  };
}
