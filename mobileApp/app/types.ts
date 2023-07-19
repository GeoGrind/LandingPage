export type User = {
    uid: string;
    email: string | null;
    location: Location | null;
    isInSession: boolean;
    onGoingSession: Session | null;
    profilePicture: string | null;
};

// Null location is defined as (0,0)
export type Location = {
  longitude: number;
  latitude: number;
}

export type Session = {
  course: string;
  startTime: number; // time since 1970 in milliseconds
  isVisible: boolean;
  sessionStartLocation: Location | null;
  numberOfCheerers: number;
  cheerers: string[];
}