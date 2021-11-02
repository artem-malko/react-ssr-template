export type Toast = {
  id: string;
  // Pass React.Node?
  title: string;
  type: 'default' | 'success' | 'error' | 'warning';
};
