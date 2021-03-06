import { CSSProperties, ReactElement } from "react";

export interface SeamlessIframeProps {
  sanitizedHtml: string;
  customStyle?: string;
  customScript?: string;
  customOuterStyleObject?: Record<string, CSSProperties>;
  heightCorrection?: boolean;
  heightCorrectionOnResize?: boolean;
  debounceResizeTime?: number;
  inheritParentStyle?: boolean;
  interceptLinkClicks?: boolean;
  preventIframeNavigation?: boolean;
  customLinkClickCallback?: (url: string) => void;
  customIframeNavigationInterceptedView?: ReactElement;
  title?: string;
}
