export const formatDate = (dateInput: string | Date | undefined): string => {
  if (!dateInput) return "No dates";

  const target = new Date(dateInput);
  const today = new Date();

  const oneDay = 24 * 60 * 60 * 1000;
  const diff = Math.ceil((target.getTime() - today.getTime()) / oneDay);

  if (diff > 3) {
    const options: Intl.DateTimeFormatOptions = {
      day: "2-digit",
      month: "short",
      // year: "numeric",
    };
    return target.toLocaleDateString("en-US", options);
  }

  if (diff > 1) return `${diff} days left`;
  if (diff === 1) return "1 day left";
  if (diff === 0) return "Today";
  if (diff === -1) return "1 day ago";
  if (diff < -1) return `${Math.abs(diff)} days ago`;

  return "No  dates";
};
