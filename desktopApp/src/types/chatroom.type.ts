export type ChatRoom = {
  id: string;
  ownerIds: string[]; // Array of Users
  lastChangeTime: number;
  lastMessage: string | null;
};
