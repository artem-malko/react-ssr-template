import { render } from '@testing-library/react';
import { expect } from 'chai';

import { dt } from '..';

describe('dt util', () => {
  it('react-testing-library selects by t-attribute', () => {
    const { getAllByTestId } = render(
      <div>
        <div {...dt('link')} />
        <div {...dt('other_link')} />
        <div {...dt('other_link')} />
      </div>,
    );

    expect(getAllByTestId('link')).to.have.length(1);
    expect(getAllByTestId('other_link')).to.have.length(2);
    let error;

    try {
      getAllByTestId('no_link');
    } catch (e) {
      error = e;
    }

    expect(
      error,
      'Error should be instance of Error, cause there is no elements with no_link attr',
    ).to.be.instanceOf(Error);
  });
});
