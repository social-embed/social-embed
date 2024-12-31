import type React from "react";
import {
  LiveEditor,
  LiveError,
  LivePreview,
  LiveProvider,
  type LiveProviderProps,
} from "react-live";

export interface ReactLiveProps {
  /**
   * Initial code snippet. If not provided, a simple default is used.
   */
  initialCode?: string;

  /**
   * If true, the component won't evaluate the function inline;
   * use this if you want to call `render(<Component />)` in your code snippet.
   */
  noInline?: boolean;
}

/**
 * Renders a live-editable code editor and preview using react-live.
 */
const ReactLive: React.FC<ReactLiveProps> = ({
  initialCode,
  noInline = false,
}) => {
  const code =
    initialCode?.trim() ||
    `
function Example() {
  return <h1>Hello, React Live (TypeScript)!</h1>;
}
render(<Example />);
`;

  // You can further customize LiveProvider (e.g., add theme or scope) if needed
  const providerProps: LiveProviderProps = {
    code,
    noInline,
  };

  return (
    <LiveProvider {...providerProps}>
      <LiveEditor className="font-mono" />
      <LiveError />
      <LivePreview />
    </LiveProvider>
  );
};

export default ReactLive;
