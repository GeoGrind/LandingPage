import { Session } from './session.type';

export type User = {
  uid: string;
  expoToken: string | undefined; // If expoToken === "", it indicates that the user is not signed in
  email: string;
  username: string;
  emoji: string;
  termCourses: string[];
  session: Session | null;
  program: string | null;
  yearOfGraduation: number | null;
  university: string;
  profilePicture: string;
};
