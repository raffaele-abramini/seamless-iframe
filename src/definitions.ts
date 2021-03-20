import { CSSProperties } from "react";

export interface SeamlessIframeProps {
  sanitizedHtml: string;
  customStyle?: string;
  customScript?: string;
  customOuterStyleObject?: Record<string, CSSProperties>;
  heightCorrection?: boolean;
  heightCorrectionOnResize?: boolean;
  debounceResizeTime?: number;
  inheritParentStyle?: boolean;
  listenToLinkClicks?: boolean;
  customLinkClickCallback?: (url: string) => void;
  title?: string;
}
