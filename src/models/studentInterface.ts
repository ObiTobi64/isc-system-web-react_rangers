export interface Student {
  student_name: string;
  lastName: string;
  code: number;
  name: string;
  modality: string;
  tutor_name: string;
  reviewer_name: string;
  period: string;
  id: number;
  isIntern?: boolean;

}

export interface StudentForm {
  id?: number;
  name: string;
  lastname: string;
  mothername: string;
  email: string;
  phone: string;
  code: string;
  is_scholarship?: boolean;
}
