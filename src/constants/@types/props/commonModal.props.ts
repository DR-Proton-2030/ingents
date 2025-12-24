import { JSXElementConstructor, ReactElement } from "react";

export interface ICommonModalProps {
  isOpen: boolean;
  onClose: () => void;
  width?: number | string;
  height?: number | string;
  maxWidth?: number | string;
  bgColor?: string;
  borderColor?: string;
  p?: number | string;
  children?: ReactElement<unknown, string | JSXElementConstructor<unknown>>;
}
