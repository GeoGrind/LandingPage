export type Message = {
  author: any; // object only contains id which is senderId
  createdAt: number;
  id: string;
  text: string;
  type: string; // text
};
