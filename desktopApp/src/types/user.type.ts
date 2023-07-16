import { Location } from './location.type';
import { Session } from './session.type';

export type User = {
  uid: string;
  email: string;
  location: Location | null; // 0,0 means null location
  isInSession: boolean;
  onGoingSession: Session | null;
};
