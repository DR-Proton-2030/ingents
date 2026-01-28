export interface IProject {
  _id: string;
  name: string;
  detail: string;
  company_object_id: string;
  created_by_user_object_id: string;
  createdAt: string;
  updatedAt: string;
}

export interface CreateProjectPayload {
  name: string;
  detail: string;
}

export interface UpdateProjectPayload {
  name?: string;
  detail?: string;
}
