import { memo } from 'react';

import { useRaiseError } from './context';

type Props = {
  code: number;
};

/**
 * This component allows to raise an error code to the res.status
 * from render of any component.
 * An example, you're trying to render a component, where react-query is used.
 * Let's imagine, that your query returns a error as a result.
 * You'd like to return a correct status for document request for search bots.
 * So, you can render this component in such situation.
 * `raiseError` set the error code in a curent render context
 * and this error code will be set as a status code
 */
export const RaiseError = memo<Props>(({ code }) => {
  const { raiseError } = useRaiseError();

  raiseError(code);

  return null;
});
