import { Location } from './location.type';
import { Session } from './session.type';

export type User = {
  uid: string;
  email: string;
  location: Location | null;
  isInSession: boolean;
  onGoingSession: Session | null;
  profilePicture: string | null;
};
