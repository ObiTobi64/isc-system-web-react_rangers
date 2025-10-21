/* eslint-disable camelcase */
import { GraduationProcess, Seminar } from '../models/studentProcess';
import {
  InitGraduationProcess,
  InitGraduationProcessDB,
} from '../services/models/GraduationProcess';

export const getStage = (seminar: Seminar) => {
  const { tutor_name, reviewer_name } = seminar;
  if (!tutor_name) {
    return 0;
  }
  if (!reviewer_name) {
    return 1;
  }
  return 2;
};

export function convertSeminarToGraduationProcess(seminar: Seminar): GraduationProcess {
  const graduationProcess: GraduationProcess = {
    student_id: seminar.student_id,
    modality_id: seminar.modality_id,
    project_name: seminar.project_name,
    seminar_enrollment: seminar.seminar_enrollment === 'true',
    date_seminar_enrollment: new Date(seminar.date_seminar_enrollment || ''),
    period: seminar.period,
    tutor_letter: seminar.tutor_letter || false,
    tutor_id: seminar.tutor_id || undefined,
    tutor_approval: seminar.tutor_approval || false,
    reviewer_letter: seminar.reviewer_letter || false,
    reviewer_id: seminar.reviewer_id || undefined,
    reviewer_approval: seminar.reviewer_approval || false,
    stage_id: seminar.stage_id,
    date_tutor_assignament: seminar.date_tutor_assignament ? seminar.date_tutor_assignament : null,
    tutor_approval_date: seminar.tutor_approval_date,
    reviewer_approval_date: seminar.reviewer_approval_date,
  };

  return graduationProcess;
}

export function creationProcess(values: InitGraduationProcess): InitGraduationProcessDB {
  return {
    student_code: values.studentCode,
    period: values.period,
    modality_id: values.modeId,
    project_name: values.titleProject,
    stage_id: 1,
  };
}
