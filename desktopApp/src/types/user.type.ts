import { Session } from './session.type';

export type User = {
  uid: string;
  email: string;
  username: string;
  yearOfGraduation: number;
  university: string | null;
  program: string;
  termCourses: string[];

  bio: string;
  session: Session | null;
};
