
export interface IUser {
  _id: string;
  full_name: string;
  email: string;
  role: "company_admin" | "employee" | "manager";
  has_joined: boolean;
  avatar?: string;
}