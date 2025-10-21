/* eslint-disable import/no-cycle */
import { Dayjs } from 'dayjs';
import { Event } from './eventInterface';

export interface Interns {
  id: number;
  user_profile_id: number;
  total_hours: number;
  pending_hours: number;
  completed_hours: number;
  created_at: Dayjs;
  updated_at: Dayjs;
}

export interface InternsInformation extends Interns {
  id_intern: number;
  username: string;
  name: string;
  lastname: string;
  mothername: string;
  password: string;
  email: string;
  code: number;
  phone: string;
  type: string;
  worked_hours: number;
  registration_date: Dayjs;
  last_update: Dayjs;
}

export interface EventPerIntern extends Event {
  event_id: number;
  is_supervisor: boolean;
  worked_hours: number;
  type: string;
  attendance: boolean;
  registration_date: string;
  last_update: string;
  notes: string;
}

export interface CompleteIntern extends Interns {
  name: string;
  lastname: string;
  mothername: string;
  full_name: string;
  code: number;
  events?: EventPerIntern[];
}
