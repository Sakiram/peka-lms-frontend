export interface CreateOrgRequest {
  org_name: string;
  domain: string;
  org_email: string;
  password: string;
  firstname: string;
  lastname: string;
  username: string;
}

export interface CreateOrgResponse {
  message: string;
  org_id: string;
  user_id: string;
}