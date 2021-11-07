export type Popup = {
  id: string;
  body: JSX.Element;
  onClose?: () => void;
  options?: {
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
    hideCloseButton?: boolean;
    minWidth?: string;
    width?: string;
    maxWidth?: string;
    minHeight?: string;
    height?: string;
    maxHeight?: string;
  };
};
