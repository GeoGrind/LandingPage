import { Location } from 'types/location.type';

export type Session = {
  course: string;
  startTime: number; // time since 1970 in milliseconds
  isPrivate: boolean; // not used rn, set default to false
  location: Location;
  numberOfLikers: number;
  likers: string[];
  stopTime: number;
  description: string;
};
