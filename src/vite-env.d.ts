/// <reference types="vite/client" />

interface Window {
  Telegram?: {
    WebApp: {
      ready: () => void;
      expand: () => void;
      disableVerticalSwipes: () => void;
      backgroundColor: string;
      textColor: string;
      hintColor: string;
      linkColor: string;
      buttonColor: string;
      buttonTextColor: string;
      HapticFeedback?: {
        impactOccurred: (style: 'light' | 'medium' | 'heavy') => void;
        notificationOccurred: (type: 'error' | 'success' | 'warning') => void;
      };
      BackButton?: {
        show: () => void;
        hide: () => void;
        onClick: (callback: () => void) => void;
      };
      MainButton?: {
        setParams: (params: Record<string, unknown>) => void;
        show: () => void;
        hide: () => void;
      };
      CloudStorage?: {
        setItem: (key: string, value: string) => Promise<void>;
        getItem: (key: string) => Promise<string | null>;
      };
      openInvoice: (slug: string, callback: (status: string) => void) => void;
      showPopup: (params: {
        title: string;
        message: string;
        buttons: Array<{
          id?: string;
          type?: 'default' | 'ok' | 'close' | 'cancel' | 'destructive';
          text: string;
        }>;
      }, callback?: (buttonId: string) => void) => void;
    };
  };
}
