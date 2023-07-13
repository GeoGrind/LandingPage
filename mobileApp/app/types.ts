export type User = {
    currentLocation: string;
    email: string;
    location: {
      longitude: number;
      latitude: number;
    };
    uid: string;
  };

export type Location = {
  longitude: number;
  latitude: number;
}