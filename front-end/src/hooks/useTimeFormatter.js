export const useTimeFormatter = (time) => {
  const date = new Date(time)
  // console.log(time)
  const options = {
    month: "long",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    hour12: true,
  };
  const formatted = date.toLocaleDateString("en-US", options);
  return formatted;
};

