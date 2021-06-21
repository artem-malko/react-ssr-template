import ReactDOM from 'react-dom';
import { App } from 'ui/main/app';

// @TODO_AFTER_REACT_18_RELEASE remove as any
const container = document.getElementById('app');

const root = (ReactDOM as any).hydrateRoot(container);
root.render(<App />);

console.log('WOOOW, IT WORKS!');
