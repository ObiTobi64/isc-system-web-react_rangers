import { Dayjs } from 'dayjs';

export interface EventFormState {
  title: string;
  date: Dayjs;
  duration: number;
  scholarshipHours: string;
  location: string;
  maxParticipants: number;
  maxSubstitutes: number;
  description: string;
  endDate: Dayjs;
  responsiblePerson: string;
}
