import { Clock, Users as UsersIcon } from 'lucide-react';

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

interface AssignmentCardProps {
  classSession: ClassSession;
  teachers: Teacher[];
  onAssign: (classId: string, teacherId: string | null) => void;
}

export default function AssignmentCard({ classSession, teachers, onAssign }: AssignmentCardProps) {
  const assignedTeacher = teachers.find(t => t.id === classSession.teacherId);

  return (
    <div className="bg-white rounded-[2px] p-5 shadow-[0_1px_3px_rgba(0,0,0,0.04)] border border-[#F5F5F5] hover:border-[#E85D75] transition-all duration-200">
      <div className="flex items-start justify-between mb-4">
        <div className="flex-1">
          <h3 className="text-[0.95rem] text-[#1a1a1a] mb-1" style={{ fontWeight: 400 }}>
            {classSession.subject}
          </h3>
          <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
            {classSession.day}
          </p>
        </div>
        {assignedTeacher && (
          <div
            className="w-2 h-2 rounded-full mt-2"
            style={{ backgroundColor: assignedTeacher.color }}
          />
        )}
      </div>

      <div className="flex items-center gap-4 mb-4 text-[0.85rem] text-[#666666]">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4" strokeWidth={1.2} />
          <span className="font-mono" style={{ fontWeight: 300 }}>
            {classSession.startTime} - {classSession.endTime}
          </span>
        </div>
        <div className="flex items-center gap-2">
          <UsersIcon className="w-4 h-4" strokeWidth={1.2} />
          <span className="font-mono" style={{ fontWeight: 300 }}>
            {classSession.students}
          </span>
        </div>
      </div>

      <div>
        <select
          value={classSession.teacherId || ''}
          onChange={(e) => onAssign(classSession.id, e.target.value || null)}
          className="w-full px-3 py-2 text-[0.9rem] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
          style={{ fontWeight: 300 }}
        >
          <option value="">Atribuir professor...</option>
          {teachers.map(teacher => (
            <option key={teacher.id} value={teacher.id}>
              {teacher.name} — {teacher.subject}
            </option>
          ))}
        </select>
        {assignedTeacher && (
          <p className="mt-2 text-[0.8rem] text-[#AAAAAA]" style={{ fontWeight: 300 }}>
            Atribuído a {assignedTeacher.name}
          </p>
        )}
      </div>
    </div>
  );
}
