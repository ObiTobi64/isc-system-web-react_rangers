import { useState, useCallback, FC, ChangeEvent, FormEvent } from "react";
import dayjs from "dayjs";
import { EventFormState } from "../../models/formEventInterface.ts";

interface EventFormProps {
  onSubmit: () => void;
  onCancel: () => void;
}

const EventForm: FC<EventFormProps> = ({ onSubmit, onCancel }) => {
  const [eventDetails, setEventDetails] = useState<EventFormState>({
    title: "",
    date: dayjs(),
    duration: 0,
    scholarshipHours: "",
    location: "",
    maxParticipants: 0,
    maxSubstitutes: 0,
    description: "",
    endDate: dayjs(),
    responsiblePerson: "",
  });

  const inputStyle = {
    width: "100%",
    padding: "8px",
    boxSizing: "border-box" as const
  };

  dayjs.locale("es");

  const handleInputChange = useCallback((event: ChangeEvent<HTMLInputElement>) => {
    const { name, value } = event.target;
    setEventDetails((prevData) => ({ ...prevData, [name]: value }));
  }, []);

  const handleSubmit = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      onSubmit();
      setEventDetails({
        title: "",
        date: dayjs(),
        duration: 0,
        scholarshipHours: "",
        location: "",
        maxParticipants: 0,
        maxSubstitutes: 0,
        description: "",
        endDate: dayjs(),
        responsiblePerson: "",
      });
    },
    [onSubmit]
  );

  return (
    <form
      onSubmit = {handleSubmit}
      style = {{
        display: "flex",
        flexDirection: "column",
        gap: "16px",
        width: "100%",
        maxWidth: "600px",
        margin: "0 auto",
      }}
    >
      <div style = {{ display: "flex", flexDirection: "column", gap: "12px" }}>
        <label>
          {"Título del evento:\r"}
          <input
            type = "text"
            name = "title"
            placeholder = "Título del evento"
            value = {eventDetails.title}
            onChange = {handleInputChange}
            style = {inputStyle}
          />
        </label>
        <label>
          {"Fecha:\r"}
          <input
            type = "date"
            name = "date"
            value = {eventDetails.date.format("DD/MM/YYYY")}
            onChange = {handleInputChange}
            style = {inputStyle}
          />
        </label>
        <label>
          {"Duración:\r"}
          <input
            type = "text"
            name = "duration"
            placeholder = "Duración"
            value = {eventDetails.duration}
            onChange = {handleInputChange}
            style = {inputStyle}
          />
        </label>
        <label>
          {"Horas de beca:\r"}
          <input
            type = "text"
            name = "scholarshipHours"
            placeholder = "Horas de beca"
            value = {eventDetails.scholarshipHours}
            onChange = {handleInputChange}
            style = {inputStyle}
          />
        </label>
        <label>
          {"Ubicación:\r"}
          <input
            type = "text"
            name = "location"
            placeholder = "Ubicación"
            value = {eventDetails.location}
            onChange = {handleInputChange}
            style = {inputStyle}
          />
        </label>
        <label>
          {"Máximo de participantes:\r"}
          <input
            type = "number"
            name = "maxParticipants"
            placeholder = "Máximo de participantes"
            value = {eventDetails.maxParticipants}
            onChange = {handleInputChange}
            style = {inputStyle}
          />
        </label>
        <label>
          {"Máximo de suplentes:\r"}
          <input
            type = "number"
            name = "maxSubstitutes"
            placeholder = "Máximo de suplentes"
            value = {eventDetails.maxSubstitutes}
            onChange = {handleInputChange}
            style = {inputStyle}
          />
        </label>
        <label>
          {"Descripción:\r"}
          <input
            type = "text"
            name = "description"
            placeholder = "Descripción"
            value = {eventDetails.description}
            onChange = {handleInputChange}
            style = {inputStyle}
          />
        </label>
      </div>

      <div style = {{ display: "flex", justifyContent: "flex-end", gap: "8px" }}>
        <button
          type = "button"
          onClick = {onCancel}
          style = {{
            padding: "8px 16px",
            backgroundColor: "#ccc",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {"Cancelar\r"}
        </button>
        <button
          type = "submit"
          style = {{
            padding: "8px 16px",
            backgroundColor: "#007bff",
            color: "#fff",
            border: "none",
            borderRadius: "4px",
          }}
        >
          {"Agregar Evento\r"}
        </button>
      </div>
    </form>
  );
};

export default EventForm;
