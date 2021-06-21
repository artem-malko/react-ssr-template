import axios from 'axios';
import MockAdapter from 'axios-mock-adapter';

let requestMock: MockAdapter;

/* istanbul ignore next */
if (process.env.NODE_ENV === 'test') {
  requestMock = new MockAdapter(axios);
}

export { requestMock };
