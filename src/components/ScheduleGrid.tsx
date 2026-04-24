import { Calendar, Trash2, Clock } from "lucide-react";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  color: string;
  minHours: number;
  maxHours: number;
}

interface ClassSession {
  id: string;
  teacherId: string | null;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
}

interface ScheduleGridProps {
  classes: ClassSession[];
  teachers: Teacher[];
  onAssignTeacher: (classId: string, teacherId: string | null) => void;
  onRemoveClass: (classId: string) => void;
  onEditClass: (classId: string, updates: Partial<ClassSession>) => void;
}

const DAYS = ["Segunda", "Terça", "Quarta", "Quinta", "Sexta"];

const TIME_BLOCKS = [
  { label: "1ª aula", startTime: "08:00", endTime: "08:50" },
  { label: "2ª aula", startTime: "08:50", endTime: "09:40" },
  { label: "Intervalo", startTime: "09:40", endTime: "10:00", break: true },
  { label: "3ª aula", startTime: "10:00", endTime: "10:50" },
  { label: "4ª aula", startTime: "10:50", endTime: "11:40" },
  { label: "5ª aula", startTime: "11:40", endTime: "12:30" },
  { label: "Jogos", startTime: "12:20", endTime: "13:10" },
  { label: "Almoço", startTime: "12:30", endTime: "13:30", break: true },
  { label: "6ª aula", startTime: "13:30", endTime: "14:20" },
  { label: "7ª aula", startTime: "14:20", endTime: "15:10" },
  { label: "8ª aula", startTime: "15:10", endTime: "16:00" },
];

export default function ScheduleGrid({
  classes,
  teachers,
  onAssignTeacher,
  onRemoveClass,
}: ScheduleGridProps) {
  const getClassByDayAndBlock = (
    day: string,
    startTime: string,
    endTime: string
  ) => {
    return classes.find(
      (cls) =>
        cls.day === day &&
        cls.startTime === startTime &&
        cls.endTime === endTime
    );
  };

  const getTeacher = (teacherId: string | null) => {
    if (!teacherId) return null;
    return teachers.find((t) => t.id === teacherId) || null;
  };

  return (
    <div className="bg-white rounded-[2px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.2} />
        <h2 className="text-[1.1rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>
          Grade Semanal
        </h2>

        <div className="ml-auto">
          <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
            Total:{" "}
            <span className="font-mono text-[#1a1a1a]">
              {classes.length}
            </span>{" "}
            aulas
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1100px]">
          <div className="grid grid-cols-6 gap-[1px] bg-[#F0F0F0] border border-[#F0F0F0] rounded-[2px] overflow-hidden">
            <div className="bg-white p-3">
              <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 400 }}>
                Horário
              </p>
            </div>

            {DAYS.map((day) => (
              <div key={day} className="bg-white p-3">
                <p className="text-[0.9rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>
                  {day}
                </p>
              </div>
            ))}

            {TIME_BLOCKS.map((block) => (
              <>
                <div
                  key={`${block.startTime}-${block.endTime}-label`}
                  className={`p-3 border-t border-[#F0F0F0] ${
                    block.break ? "bg-[#F7F7F7]" : "bg-white"
                  }`}
                >
                  <p className="text-[0.8rem] text-[#666666]" style={{ fontWeight: 400 }}>
                    {block.label}
                  </p>
                  <p className="font-mono text-[0.75rem] text-[#888888]" style={{ fontWeight: 300 }}>
                    {block.startTime}–{block.endTime}
                  </p>
                </div>

                {DAYS.map((day) => {
                  const aula = getClassByDayAndBlock(
                    day,
                    block.startTime,
                    block.endTime
                  );

                  const teacher = getTeacher(aula?.teacherId || null);

                  return (
                    <div
                      key={`${day}-${block.startTime}-${block.endTime}`}
                      className={`p-2 border-t border-[#F0F0F0] min-h-[88px] ${
                        block.break ? "bg-[#F7F7F7]" : "bg-white"
                      }`}
                    >
                      {block.break ? (
                        <div className="h-full flex items-center justify-center">
                          <span className="text-[0.75rem] text-[#AAAAAA]">
                            {block.label}
                          </span>
                        </div>
                      ) : aula ? (
                        <div
                          className="relative p-3 rounded-[2px] border-l-[3px] h-full group hover:shadow-md transition-all"
                          style={{
                            borderColor: teacher?.color || "#CCCCCC",
                            backgroundColor: aula.teacherId ? "#FAFAFA" : "#FFF8F0",
                          }}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-[0.85rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>
                              {aula.subject}
                            </p>

                            <button
                              onClick={() => onRemoveClass(aula.id)}
                              className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded-[2px]"
                            >
                              <Trash2 className="w-3.5 h-3.5 text-[#E85D75]" strokeWidth={1.5} />
                            </button>
                          </div>

                          <div className="flex items-center gap-1.5 mb-2">
                            <Clock className="w-3 h-3 text-[#888888]" strokeWidth={1.5} />
                            <p className="font-mono text-[0.75rem] text-[#888888]" style={{ fontWeight: 300 }}>
                              {aula.startTime} - {aula.endTime}
                            </p>
                          </div>

                          <p className="text-[0.75rem] text-[#AAAAAA] mb-2" style={{ fontWeight: 300 }}>
                            {aula.room}
                          </p>

                          <select
                            value={aula.teacherId || ""}
                            onChange={(e) =>
                              onAssignTeacher(aula.id, e.target.value || null)
                            }
                            className="w-full px-2 py-1 text-[0.8rem] bg-white border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
                            style={{ fontWeight: 300 }}
                          >
                            <option value="">Sem professor</option>
                            {teachers.map((teacher) => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      ) : null}
                    </div>
                  );
                })}
              </>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}