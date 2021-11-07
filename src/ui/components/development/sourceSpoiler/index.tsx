import { memo } from 'react';
import { Fade } from 'ui/kit/fade';
import { Spoiler } from 'ui/kit/spoiler';

type Props = {
  source: Record<string, any>;
};
export const SourceSpoiler = memo<Props>(({ source }) => {
  return (
    <Spoiler>
      {(isExpanded, toggle) => {
        return (
          <div style={{ paddingBottom: 20 }}>
            <div onClick={toggle} style={{ paddingBottom: 8, cursor: 'pointer' }}>
              {isExpanded ? <button>Hide source</button> : <button>Show source</button>}
            </div>
            <Fade isShown={isExpanded} transition={300}>
              <table>
                <tbody>
                  {source &&
                    Object.keys(source).map((key) => {
                      return (
                        <tr key={key}>
                          <td>
                            <strong>{key}</strong>&nbsp;
                          </td>
                          <td>{JSON.stringify(source[key], null, 4)}</td>
                        </tr>
                      );
                    })}
                </tbody>
              </table>
            </Fade>
          </div>
        );
      }}
    </Spoiler>
  );
});
