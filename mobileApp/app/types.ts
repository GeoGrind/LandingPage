export type User = {
  uid: string;
  email: string | null;
  name: string | null;
  emoji: string | "🙂";
  termCourses: string[];
  location: Location | null;
  isInSession: boolean;
  onGoingSession: Session | null;
  profilePicture: string | null;
};

export type Location = {
  longitude: number;
  latitude: number;
};

export type Session = {
  course: string;
  startTime: number; // time since 1970 in milliseconds
  isVisible: boolean;
  sessionStartLocation: Location | null;
  numberOfCheerers: number;
  cheerers: string[];
};

// Two types below are for testing

// Type for the messages in the "messages" collection
export type Message = {
  id: string;
  createdAt: number;
  message: string;
  sender: string;
};

// Type for the documents in the "groups" collection
export type ChatRoom = {
  id: string;
  ownerIds: string[]; // Array of Users
  ownerNames: string[];
  lastChangeTime: number;
};
