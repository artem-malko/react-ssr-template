export const DATA_T_ATTRIBUTE_NAME = 'data-t';

/**
 * data-t — label for element for dom-tests
 * Used with react-testing-library in method getByTestId and getAllByTestId
 *
 * @example
 * <div {...dt('el') }>{children}</div>
 */
export function dt(label: string) {
  if (process.env.NODE_ENV === 'production') {
    return {};
  }

  return { [DATA_T_ATTRIBUTE_NAME]: label };
}
