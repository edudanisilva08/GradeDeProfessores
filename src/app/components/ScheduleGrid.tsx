import React, { useState } from 'react';
import { Calendar, Trash2, Clock } from 'lucide-react';

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

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];
const TIME_SLOTS = [
  '07:00', '08:00', '09:00', '10:00', '11:00', '12:00',
  '13:00', '14:00', '15:00', '16:00', '17:00', '18:00'
];

export default function ScheduleGrid({
  classes,
  teachers,
  onAssignTeacher,
  onRemoveClass,
}: ScheduleGridProps) {
  const [hoveredClass, setHoveredClass] = useState<string | null>(null);

  const getClassesByDayAndTime = (day: string, timeSlot: string) => {
    return classes.filter(cls => {
      if (cls.day !== day) return false;
      const slotHour = parseInt(timeSlot.split(':')[0]);
      const startHour = parseInt(cls.startTime.split(':')[0]);
      const endHour = parseInt(cls.endTime.split(':')[0]);
      const endMinute = parseInt(cls.endTime.split(':')[1]);

      return startHour <= slotHour && (slotHour < endHour || (slotHour === endHour && endMinute === 0));
    });
  };

  const calculateDuration = (startTime: string, endTime: string): number => {
    const [startH, startM] = startTime.split(':').map(Number);
    const [endH, endM] = endTime.split(':').map(Number);
    return (endH * 60 + endM - (startH * 60 + startM)) / 60;
  };

  return (
    <div className="bg-white rounded-[2px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-8">
        <Calendar className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.2} />
        <h2 className="text-[1.1rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>Grade Semanal</h2>
        <div className="ml-auto">
          <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
            Total: <span className="font-mono text-[#1a1a1a]">{classes.length}</span> aulas
          </p>
        </div>
      </div>

      <div className="overflow-x-auto">
        <div className="min-w-[1000px]">
          <div className="grid grid-cols-6 gap-[1px] bg-[#F0F0F0] border border-[#F0F0F0] rounded-[2px] overflow-hidden">
            <div className="bg-white p-3">
              <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 400 }}>
                Horário
              </p>
            </div>
            {DAYS.map(day => (
              <div key={day} className="bg-white p-3">
                <p className="text-[0.9rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>
                  {day}
                </p>
              </div>
            ))}

            {TIME_SLOTS.map((timeSlot, slotIndex) => (
              <React.Fragment key={`slot-${slotIndex}`}>
                <div className="bg-white p-3 border-t border-[#F0F0F0]">
                  <p className="font-mono text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
                    {timeSlot}
                  </p>
                </div>
                {DAYS.map(day => {
                  const cellClasses = getClassesByDayAndTime(day, timeSlot);
                  const displayClass = cellClasses.length > 0 && cellClasses[0].startTime === timeSlot ? cellClasses[0] : null;

                  return (
                    <div
                      key={`${day}-${timeSlot}`}
                      className="bg-white p-2 border-t border-[#F0F0F0] min-h-[80px]"
                    >
                      {displayClass && (
                        <div
                          className="relative p-3 rounded-[2px] border-l-[3px] h-full group hover:shadow-md transition-all cursor-pointer"
                          style={{
                            borderColor: teachers.find(t => t.id === displayClass.teacherId)?.color || '#CCCCCC',
                            backgroundColor: displayClass.teacherId ? '#FAFAFA' : '#FFF8F0',
                          }}
                          onMouseEnter={() => setHoveredClass(displayClass.id)}
                          onMouseLeave={() => setHoveredClass(null)}
                        >
                          <div className="flex items-start justify-between gap-2 mb-2">
                            <p className="text-[0.85rem] text-[#1a1a1a] line-clamp-1" style={{ fontWeight: 400 }}>
                              {displayClass.subject}
                            </p>
                            {hoveredClass === displayClass.id && (
                              <button
                                onClick={() => onRemoveClass(displayClass.id)}
                                className="opacity-0 group-hover:opacity-100 transition-opacity p-1 hover:bg-white rounded-[2px]"
                              >
                                <Trash2 className="w-3.5 h-3.5 text-[#E85D75]" strokeWidth={1.5} />
                              </button>
                            )}
                          </div>

                          <div className="flex items-center gap-1.5 mb-2">
                            <Clock className="w-3 h-3 text-[#888888]" strokeWidth={1.5} />
                            <p className="font-mono text-[0.75rem] text-[#888888]" style={{ fontWeight: 300 }}>
                              {displayClass.startTime} - {displayClass.endTime}
                            </p>
                            <span className="font-mono text-[0.7rem] text-[#AAAAAA]">
                              ({calculateDuration(displayClass.startTime, displayClass.endTime).toFixed(1)}h)
                            </span>
                          </div>

                          <p className="text-[0.75rem] text-[#AAAAAA] mb-2" style={{ fontWeight: 300 }}>
                            {displayClass.room}
                          </p>

                          <select
                            value={displayClass.teacherId || ''}
                            onChange={(e) => onAssignTeacher(displayClass.id, e.target.value || null)}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full px-2 py-1 text-[0.8rem] bg-white border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
                            style={{ fontWeight: 300 }}
                          >
                            <option value="">Sem professor</option>
                            {teachers.map(teacher => (
                              <option key={teacher.id} value={teacher.id}>
                                {teacher.name}
                              </option>
                            ))}
                          </select>
                        </div>
                      )}
                    </div>
                  );
                })}
              </React.Fragment>
            ))}
          </div>
        </div>
      </div>

      <div className="mt-6 pt-6 border-t border-[#F0F0F0] flex items-center justify-between">
        <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
          A grade detecta automaticamente conflitos e sobrecargas ao atribuir professores
        </p>
        <div className="flex items-center gap-2">
          <div className="w-2 h-2 rounded-full bg-[#FFA726]" />
          <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
            Sem professor
          </p>
        </div>
      </div>
    </div>
  );
}
