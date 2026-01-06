const STATUS_OPTIONS: {
  value: string;
  label: string;
  bg: string;
  text: string;
}[] = [
  { value: "to do", label: "To Do", bg: "bg-gray-100", text: "text-gray-700" },
  { value: "in progress", label: "In Progress", bg: "bg-blue-100", text: "text-blue-700" },
  { value: "testing", label: "Testing", bg: "bg-red-100", text: "text-red-700" },
  { value: "complete", label: "Complete", bg: "bg-green-100", text: "text-green-700" },
];
export default STATUS_OPTIONS;