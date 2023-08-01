export const formatTime = (timestamp: number) => {
  const date = new Date(timestamp);
  const options = {
    month: "numeric",
    day: "numeric",
    hour: "numeric",
    minute: "numeric",
  };
  return date.toLocaleString(undefined, options as any);
};
