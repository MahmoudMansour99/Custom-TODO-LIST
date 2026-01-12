// Local shim to silence missing `@types/react` / JSX diagnostics while deps are installed.
// Prefer installing `@types/react` and `@types/react-dom` as a permanent fix: `npm i -D @types/react @types/react-dom`

declare module "react";
declare module "react/jsx-runtime";

import * as React from "react";

declare global {
  namespace JSX {
    interface IntrinsicElements {
      [elemName: string]: any;
    }
  }
}

export {};
