import { Calendar } from 'lucide-react';
import AssignmentCard from './AssignmentCard';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  color: string;
}

interface ClassSession {
  id: string;
  teacherId: string | null;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  students: number;
}

interface TeacherScheduleProps {
  classes: ClassSession[];
  teachers: Teacher[];
  onAssignTeacher: (classId: string, teacherId: string | null) => void;
}

export default function TeacherSchedule({ classes, teachers, onAssignTeacher }: TeacherScheduleProps) {
  const days = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];

  const getClassesByDay = (day: string) => {
    return classes.filter(c => c.day === day).sort((a, b) => {
      return a.startTime.localeCompare(b.startTime);
    });
  };

  const assignedCount = classes.filter(c => c.teacherId).length;
  const totalCount = classes.length;
  const progress = (assignedCount / totalCount) * 100;

  return (
    <div className="bg-white rounded-[2px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Calendar className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.2} />
          <h2 className="text-[1.1rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>Grade de Horários</h2>
        </div>
        <div className="flex items-center gap-3">
          <div className="text-right">
            <p className="font-mono text-[0.85rem] text-[#888888] tabular-nums" style={{ fontWeight: 300 }}>
              {assignedCount} / {totalCount} atribuídas
            </p>
          </div>
          <div className="w-24 h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E85D75] transition-all duration-500"
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      </div>

      <div className="grid grid-cols-5 gap-4">
        {days.map(day => {
          const dayClasses = getClassesByDay(day);
          return (
            <div key={day} className="space-y-4">
              <div className="pb-3 border-b border-[#F0F0F0]">
                <h3 className="text-[0.9rem] text-[#1a1a1a] tracking-wide" style={{ fontWeight: 400 }}>
                  {day}
                </h3>
                <p className="text-[0.75rem] text-[#AAAAAA] mt-1" style={{ fontWeight: 300 }}>
                  {dayClasses.length} {dayClasses.length === 1 ? 'aula' : 'aulas'}
                </p>
              </div>
              <div className="space-y-3">
                {dayClasses.map(classSession => (
                  <AssignmentCard
                    key={classSession.id}
                    classSession={classSession}
                    teachers={teachers}
                    onAssign={onAssignTeacher}
                  />
                ))}
              </div>
            </div>
          );
        })}
      </div>

      <div className="mt-8 pt-6 border-t border-[#F0F0F0]">
        <div className="flex items-center justify-between text-[0.85rem]">
          <p className="text-[#888888]" style={{ fontWeight: 300 }}>
            O sistema verifica automaticamente conflitos de horários ao atribuir professores
          </p>
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
            <p className="text-[#1a1a1a]" style={{ fontWeight: 400 }}>
              {assignedCount === totalCount ? 'Totalmente atribuído' : 'Em progresso'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
