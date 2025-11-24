import dayjs from 'dayjs';

export const getCurrentSemester = () => {
  const today = dayjs();
  const year = today.year();

  const semester1Start = dayjs(`${year}-01-01`);
  const semester1End = dayjs(`${year}-06-30`);
  const semester2Start = dayjs(`${year}-07-01`);
  const semester2End = dayjs(`${year}-12-31`);

  if (
    (today.isAfter(semester1Start) && today.isBefore(semester1End)) ||
    today.isSame(semester1End)
  ) {
    return `SEMESTRE I - ${year}`;
  }
  if (
    (today.isAfter(semester2Start) && today.isBefore(semester2End)) ||
    today.isSame(semester2End)
  ) {
    return `SEMESTRE II - ${year}`;
  }
  return `${year}`;
};

export default getCurrentSemester;
