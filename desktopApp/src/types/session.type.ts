export type Session = {
  course: string;
  startTime: number; // time since 1970 in milliseconds
  isVisible: boolean;
  sessionStartLocation: Location | null;
  numberOfCheerers: number;
  cheerers: string[];
};
