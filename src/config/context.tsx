import { createContext } from 'react';
import { defaultApplicationConfig } from './defaults/application';

export const ConfigContext = createContext(defaultApplicationConfig);
