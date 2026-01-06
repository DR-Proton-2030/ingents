import { ICompany } from "./company.interface";

export interface IUser {
  id: string;
  full_name: string;
  email: string;
  password: string;
  emp_id: string;
  has_joined: boolean;
  company_object_id: string;
  role: string;
  profile_picture: string;
  company_details?: ICompany;
  facebook?: {
    project_id: string;
    name: string;
    access_token: string;
  };
  instagram?: {
    project_id: string;
    name: string;
    access_token: string;
  };
}
