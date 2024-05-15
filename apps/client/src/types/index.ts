export type ApiResponse<T> = {
  data: T;
  error: null;
} | {
  data: null;
  error: {
    message: string | string[];
  }
}

export interface Event {
  id: string;
  title: string;
  description: string;
  date: Date;
  organizer: string;
}

export interface Participant {
  id: string;
  fullName: string;
  email: string;
  dateOfBirth: Date;
  heardFrom: string;
}

export type EventActivity = Record<string, number>