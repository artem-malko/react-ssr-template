import React from 'react';

export type Toast = {
  id: string;
  title: string | React.ReactNode;
  type: 'default' | 'success' | 'error' | 'warning';
};
