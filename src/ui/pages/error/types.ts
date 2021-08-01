import { HttpCode } from 'core/shared/httpCode';
import { CommonPage } from 'core/store/types';

export interface ErrorPage extends CommonPage {
  name: 'error';
  params: {
    code: HttpCode;
  };
}
