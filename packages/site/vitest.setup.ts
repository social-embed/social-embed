// Enable React act() environment for testing
// Required for React 18+ to properly detect test environment
declare global {
  var IS_REACT_ACT_ENVIRONMENT: boolean;
}
globalThis.IS_REACT_ACT_ENVIRONMENT = true;

export {};
