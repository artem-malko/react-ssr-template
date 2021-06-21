import reactDom from 'react-dom';
import { App } from 'ui/main/app';

// @TODO_AFTER_REACT_18_RELEASE remove as any
(reactDom as any).hydrateRoot(document, <App />);
