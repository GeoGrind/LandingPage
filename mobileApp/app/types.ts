import { MessageType } from "@flyerhq/react-native-chat-ui";

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

export type Location = {
  longitude: number;
  latitude: number;
};

export type Session = {
  course: string;
  startTime: number; // time since 1970 in milliseconds
  isPrivate: boolean;
  location: Location;
  numberOfLikers: number;
  likers: string[];
  stopTime: number;
  description: string;
};

// Two types below are for testing

// Type for the messages in the "messages" collection
export type Message = {
  id: string;
  createdAt: number;
  message: string;
  senderId: string;
};

// Type for the documents in the "groups" collection
export type ChatRoom = {
  id: string;
  ownerIds: string[]; // Array of Users
  lastChangeTime: number;
  lastMessage: MessageType.Text | null;
};

// The params need to be passed in when navigating between the screens
export type InsideRootStackParamList = {
  BottomTabs: {};
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
