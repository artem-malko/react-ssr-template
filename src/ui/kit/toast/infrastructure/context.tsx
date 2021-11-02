import { createContext } from 'react';
import { ToastController } from './controller';

export const ToastControllerContext = createContext(new ToastController());
