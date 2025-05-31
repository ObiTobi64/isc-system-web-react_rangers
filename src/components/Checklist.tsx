import dayjs from "dayjs";
import {
  FaEnvelope,
  FaCalendar,
  FaUserTie,
  FaUser,
  FaCheck,
  FaClock,
  FaMinus,
} from "react-icons/fa";
import { useEffect, useState } from "react";
import { Seminar } from "../models/studentProcess";
import { useProcessStore } from "../store/store";
import { getUserById } from "../services/studentService";

const Checklist = () => {
  const process = useProcessStore((state) => state.process);

  const formattedTutorDate = process?.tutor_approval_date
    ? dayjs(process.tutor_approval_date).format("DD/MM/YYYY")
    : "";

  const formattedReviewerDate = process?.reviewer_approval_date
    ? dayjs(process.reviewer_approval_date).format("DD/MM/YYYY")
    : "";

  const {
    student_name: studentName,
    tutor_fullname: tutorFullname,
    tutor_degree: tutorDegree,
    reviewer_fullname: reviewerFullname,
    reviewer_degree: reviewerDegree,
    period,
    tutor_approval: tutorApproval,
    reviewer_approval: reviewerApproval,
    stage_id: stageId,
  } = process as Seminar;

  const renderStatusIcon = (stage: number) => {
  switch (stage) {
    case 0:
      return <FaCheck className="text-green-500 ml-auto" />;

    case 1:
      if (tutorApproval) {
        return <FaCheck className="text-green-500 ml-auto" />;
      }
      if (stageId === 1) {
        return <FaClock className="text-yellow-500 ml-auto" />;
      }
      return <FaMinus className="text-gray-400 ml-auto" />;

    case 2:
      if (reviewerApproval) {
        return <FaCheck className="text-green-500 ml-auto" />;
      }
      return stageId >= 2 ? (
        <FaClock className="text-yellow-500 ml-auto" />
      ) : (
        <FaMinus className="text-gray-400 ml-auto" />
      );

    default:
      return <FaMinus className="text-gray-400 ml-auto" />;
  }
};
  const [telegramLink, setTelegramLink] = useState<string>("");

  const fetchUserData = async () => {
    try {
      const response = await getUserById(Number(process?.student_id));
      setTelegramLink(`https://t.me/+591${response.phone}`);
    } catch (error) {
      console.log(error);
    }
  };
  useEffect(() => {
    fetchUserData();
  }, []);

  return (
    <div className="space-y-4">
      <div className="bg-white rounded-lg p-4 shadow-md">
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-xl font-bold text-gray-900">{studentName}</h2>
            <p className="text-sm text-gray-500">{"Sistema de Gestión Académica"}</p>
          </div>
          <a href={telegramLink} target="_blank" rel="noopener noreferrer">
            <button className="flex items-center gap-2 bg-blue-800 hover:bg-blue-900 text-white px-4 py-2 rounded-lg text-sm">
              <FaEnvelope />
              {"Enviar Mensaje"}
            </button>
          </a>
        </div>
      </div>

      <div className="bg-white rounded-lg p-4 shadow-md">
        <h3 className="text-md font-semibold text-gray-900 mb-4 ml-2">{"Etapas de Graduación"}</h3>

        <ul className="space-y-6 relative border-s border-gray-200 ml-3">
          <li className="flex items-start gap-3 relative ms-6">
            <span className="absolute flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full -start-9 ring-8 ring-white">
              <FaCalendar className="text-blue-800" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-gray-900">{"Seminario de Grado"}</h4>
              <p className="text-sm text-gray-500">
                {period ? `Inscripción ${period}` : "No inscrito aún"}
              </p>
            </div>
            {renderStatusIcon(0)}
          </li>

          <li className="flex items-start gap-3 relative ms-6">
            <span className="absolute flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full -start-9 ring-8 ring-white">
              <FaUserTie className="text-blue-800" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                {"Tutor: "}
                {tutorDegree} {tutorFullname}
              </h4>
              {tutorApproval ? (
                <p className="text-sm text-gray-500">
                  {"Aprobación del Tutor el "}
                  {formattedTutorDate}
                </p>
              ) : (
                <p className="text-sm text-gray-500">{"Fase de Tutor no Aprobada"}</p>
              )}
            </div>
            {renderStatusIcon(1)}
          </li>

          <li className="flex items-start gap-3 relative ms-6">
            <span className="absolute flex items-center justify-center w-7 h-7 bg-blue-100 rounded-full -start-9 ring-8 ring-white">
              <FaUser className="text-blue-800" />
            </span>
            <div>
              <h4 className="text-sm font-bold text-gray-900">
                {"Revisor: "}
                {reviewerDegree} {reviewerFullname}
              </h4>
              {reviewerApproval ? (
                <p className="text-sm text-gray-500">
                  {"Aprobación del Revisor el "}
                  {formattedReviewerDate}
                </p>
              ) : (
                <p className="text-sm text-gray-500">{"Fase de Revisor no Aprobada"}</p>
              )}
            </div>
            {renderStatusIcon(2)}
          </li>
        </ul>
      </div>
    </div>
  );
};

export default Checklist;
