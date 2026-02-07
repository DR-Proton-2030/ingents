/**
 * Formats a number into a shorter string representation (K, Lakh, M, Cr)
 * Example: 1500 -> 1.5K, 100000 -> 1 Lakh, 1000000 -> 1M
 */
export const formatCompactNumber = (num: number | string | undefined): string => {
  if (num === undefined || num === null || num === "") return "0";
  
  const n = Number(num);
  if (isNaN(n)) return "0";

  // Indian/Mixed numbering for better readability as requested
  if (n >= 10000000) {
    return (n / 10000000).toFixed(n % 10000000 === 0 ? 0 : 1) + " Cr";
  }
  if (n >= 1000000) {
    return (n / 1000000).toFixed(n % 1000000 === 0 ? 0 : 1) + " M";
  }
  if (n >= 100000) {
    return (n / 100000).toFixed(n % 100000 === 0 ? 0 : 1) + " Lakh";
  }
  if (n >= 1000) {
    return (n / 1000).toFixed(n % 1000 === 0 ? 0 : 1) + " K";
  }
  
  return n.toLocaleString();
};
