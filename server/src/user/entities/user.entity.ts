class Memberships {
  id: number;
  name: string;
  slug: string;
  descriptions: string;
  images: string[];
  gifts: number[];
  created_at: Date;
  updated_at: Date;
}

export class User {
  id: number;
  branch_id: number;
  username: string;
  password: string;
  platform: string;
  email: string;
  role: string;
  phone: string;
  memberships?: Memberships | any;
  active: boolean;
  verify_at: Date;
  created_at: Date;
  updated_at: Date;
}
