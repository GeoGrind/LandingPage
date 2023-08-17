export type User = {
  uid: string;
  expoToken: string | undefined; // If expoToken === "", it indicates that the user is not signed in
  email: string | null;
  name: string | null;
  emoji: string | "🙂";
  termCourses: string[];
  location: Location | null;
  isInSession: boolean;
  onGoingSession: Session | null;
  program: string | null;
  yearOfGraduation: number | null;
  region: string | null;
  gender: string | null;
  university: string | null;
  profilePicture:
    | string
    | "https://www.tenforums.com/geek/gars/images/2/types/thumb_15951118880user.png";
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

  stopTime: number;
  description: string;
};

// Two types below are for testing

// Type for the messages in the "messages" collection
export type Message = {
  id: string;
  createdAt: number;
  message: string;
  sender: string;
  isHeader: boolean;
};

// Type for the documents in the "groups" collection
export type ChatRoom = {
  id: string;
  ownerIds: string[]; // Array of Users
  lastChangeTime: number;
};

// The params need to be passed in when navigating between the screens
export type InsideRootStackParamList = {
  Map: {};
  Setting: {};
  Test: {};
  ListView: {};
  AllChats: {};
  SingleChat: {
    id: string;
    chatRoomOwner1Id: string;
    chatRoomOwner2Id: string;
  };
  UpdateEmoji: {};
  UpdateName: {};
  UpdateBase: {
    field: string;
  };
  UpdateProfilePicture: {};

  Profile: {
    id: string;
  };
  UpdateTermCourses: {};
};

export type OutsideRootStackParamList = {
  Login: {};
  ResetPassword: {};
};
