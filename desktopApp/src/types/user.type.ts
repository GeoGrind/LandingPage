import { Session } from './session.type';

export type User = {
  uid: string;
  email: string;
  username: string;
  program: string;
  yearOfGraduation: number;
  status: string; // emoji
  bio: string;
  session: Session | null;
};
