export type Popup = {
  id: string;
  body: (params: { closePopup: () => void; popupId: string }) => JSX.Element;
  onClose?: () => void;
  options?: {
    closeOnEscape?: boolean;
    closeOnOverlayClick?: boolean;
    minWidth?: string;
    maxWidth?: string;
    minHeight?: string;
    maxHeight?: string;
  };
};
