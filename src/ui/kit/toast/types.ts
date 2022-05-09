import React from 'react';

export type Toast = {
  id: string;
  body: (p: { hideToast: () => void }) => React.ReactNode;
  options?: {
    hideOnClick?: boolean;
    freezeOnHover?: boolean;
    freezeOnVisibilitychange?: boolean;
    toastLiveTime?: number;
  };
};
