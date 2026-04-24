export type TimeBlock = {
  id: string;
  label: string;
  startTime: string;
  endTime: string;
};

export const regularTimeBlocks: TimeBlock[] = [
  { id: "a1", label: "1ª aula", startTime: "08:00", endTime: "08:50" },
  { id: "a2", label: "2ª aula", startTime: "08:50", endTime: "09:40" },

  // intervalo

  { id: "a3", label: "3ª aula", startTime: "10:00", endTime: "10:50" },
  { id: "a4", label: "4ª aula", startTime: "10:50", endTime: "11:40" },
  { id: "a5", label: "5ª aula", startTime: "11:40", endTime: "12:30" },

  // almoço

  { id: "a6", label: "6ª aula", startTime: "13:30", endTime: "14:20" },
  { id: "a7", label: "7ª aula", startTime: "14:20", endTime: "15:10" },
  { id: "a8", label: "8ª aula", startTime: "15:10", endTime: "16:00" },
];

export const jogosDigitaisTimeBlocks: TimeBlock[] = [
  { id: "a1", label: "1ª aula", startTime: "08:00", endTime: "08:50" },
  { id: "a2", label: "2ª aula", startTime: "08:50", endTime: "09:40" },

  { id: "a3", label: "3ª aula", startTime: "10:00", endTime: "10:50" },
  { id: "a4", label: "4ª aula", startTime: "10:50", endTime: "11:40" },
  { id: "a5", label: "5ª aula", startTime: "11:40", endTime: "12:30" },
  { id: "a6", label: "6ª aula (Jogos)", startTime: "12:20", endTime: "13:10" },
];

export function isJogosDigitaisCourse(courseName: string) {
  return courseName.toLowerCase().includes("jogos");
}

export function getTimeBlocksByCourse(courseName: string) {
  return isJogosDigitaisCourse(courseName)
    ? jogosDigitaisTimeBlocks
    : regularTimeBlocks;
}