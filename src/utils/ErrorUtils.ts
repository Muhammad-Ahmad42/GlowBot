export const cleanErrorMessage = (msg: string): string => {
  // Remove the leading "Firebase: " if present
  let cleaned = msg.replace(/^Firebase:\s*/i, '');
  // Optionally remove the "Error (auth/... )" wrapper
  cleaned = cleaned.replace(/^Error\s*\(/i, '').replace(/\)$/,'');
  return cleaned.trim();
};
