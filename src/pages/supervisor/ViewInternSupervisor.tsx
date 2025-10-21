/* eslint-disable no-console */
import { useEffect, useState, useCallback, ChangeEvent } from "react";
import {
  Checkbox,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Button,
  Grid,
} from "@mui/material";
import * as XLSX from "xlsx";
import EventDetailsPage from "../../components/common/EventDetailsPage";
import { getSupervisorEventByIdService } from "../../services/eventsService";
import { useUserStore } from "../../store/store";
import { FullEvent } from "../../models/eventInterface";

interface StudentRow {
  id_intern: number;
  name: string;
  lastname: string;
  mothername: string;
  code: string;
  notes: string;
  attendance: boolean;
}

const ViewInternSupervisor = () => {
  const [students, setStudents] = useState<StudentRow[]>([]);
  const [event, setEvent] = useState<FullEvent>();
  const user = useUserStore((state) => state.user);

  const fetchFullEvent = useCallback(async () => {
    try {
      if (!user) {
        console.error("Failed on user id");
        return;
      }
      const res = await getSupervisorEventByIdService(user?.id);
      setEvent(res);
      setStudents(res.interns);
    } catch (error) {
      console.error(error);
    }
  }, [user]);

  useEffect(() => {
    fetchFullEvent();
  }, [fetchFullEvent]);

  const handleCheckboxChange = useCallback(
    (id: number, checked: boolean) => {
      const updatedStudents = students.map((student) =>
        student.id_intern === id ? { ...student, attendance: checked } : student
      );
      setStudents(updatedStudents);
    },
    [students]
  );

  const handleObservationChange = useCallback(
    (id: number, value: string) => {
      const updatedStudents = students.map((student) =>
        student.id_intern === id ? { ...student, notes: value } : student
      );
      setStudents(updatedStudents);
    },
    [students]
  );

  const handleExportToExcel = useCallback(() => {
    const worksheetData = students.map((student) => ({
      Nombre: `${student.name} ${student.lastname} ${student.mothername}`,
      Código: student.code,
      Observaciones: student.notes,
      Asistencia: student.attendance ? "Sí" : "No",
    }));

    const ws = XLSX.utils.json_to_sheet(worksheetData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Asistentes");
    XLSX.writeFile(wb, "lista_asistentes_evento.xlsx");
  }, [students]);

  const handleCheckboxClick = useCallback(
    (studentId: number) => (event: ChangeEvent<HTMLInputElement>) => {
      handleCheckboxChange(studentId, event.target.checked);
    },
    [handleCheckboxChange]
  );

  const handleObservationInput = useCallback(
    (studentId: number) => (event: ChangeEvent<HTMLInputElement>) => {
      handleObservationChange(studentId, event.target.value);
    },
    [handleObservationChange]
  );

  return (
    event && (
      <EventDetailsPage event = {event}>
        <TableContainer component = {Paper} sx = {{ mt: 4 }}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>{"Nombre"}</TableCell>
                <TableCell>{"Código"}</TableCell>
                <TableCell>{"Observaciones"}</TableCell>
                <TableCell>{"Asistencia"}</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {students.map((student) => {
                const fullName = `${student.name} ${student.lastname} ${student.mothername}`;
                return (
                  <TableRow key = {student.id_intern}>
                    <TableCell>{fullName}</TableCell>
                    <TableCell>{student.code}</TableCell>
                    <TableCell>
                      <TextField
                        value = {student.notes}
                        onChange = {handleObservationInput(student.id_intern)}
                        fullWidth
                      />
                    </TableCell>
                    <TableCell>
                      <Checkbox
                        checked = {student.attendance}
                        onChange = {handleCheckboxClick(student.id_intern)}
                      />
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
        <Grid container justifyContent = "center" sx = {{ mt: 4 }}>
          <Button variant = "contained" color = "secondary" onClick = {handleExportToExcel}>
            {"Cerrar Registro\r"}
          </Button>
        </Grid>
      </EventDetailsPage>
    )
  );
};

export default ViewInternSupervisor;
