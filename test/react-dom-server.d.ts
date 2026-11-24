// The root package doesn't depend on @types/react-dom; the breadcrumb test needs only this.
declare module "react-dom/server" {
  export function renderToStaticMarkup(element: import("react").ReactNode): string;
}
