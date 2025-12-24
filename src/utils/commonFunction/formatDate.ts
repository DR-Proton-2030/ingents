export const formatDate = (dateString: string | Date | undefined): string => {
    if (!dateString) return "N/A";
  const date = new Date(dateString);
  return date.toLocaleDateString();
};
