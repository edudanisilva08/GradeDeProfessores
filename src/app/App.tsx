import { useState } from 'react';
import { Plus, Calendar } from 'lucide-react';
import ScheduleGrid from './components/ScheduleGrid';
import WorkloadDashboard from './components/WorkloadDashboard';
import AddClassModal from './components/AddClassModal';
import CourseSelector from './components/CourseSelector';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  color: string;
  minHours: number;
  maxHours: number;
}

interface Course {
  id: string;
  name: string;
  shift: string;
}

interface ClassSession {
  id: string;
  teacherId: string | null;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  courseId: string;
  year: number;
}

const courses: Course[] = [
  { id: 'c1', name: 'Administração', shift: 'M-Tec-PI' },
  { id: 'c2', name: 'Desenvolvimento de Sistemas', shift: 'M-Tec-PI' },
  { id: 'c3', name: 'Design de Interiores', shift: 'M-Tec-PI' },
  { id: 'c4', name: 'Programação de Jogos Digitais', shift: 'M-Tec' },
  { id: 'c5', name: 'Administração', shift: 'M-Tec-N' },
  { id: 'c6', name: 'Edificações', shift: 'M-Tec-N' },
];

const initialTeachers: Teacher[] = [
  { id: 't1', name: 'Ana Silva', subject: 'Matemática', color: '#E85D75', minHours: 20, maxHours: 30 },
  { id: 't2', name: 'Carlos Mendes', subject: 'Física', color: '#8B8B8B', minHours: 20, maxHours: 30 },
  { id: 't3', name: 'Maria Santos', subject: 'Química', color: '#A8A8A8', minHours: 20, maxHours: 30 },
  { id: 't4', name: 'João Oliveira', subject: 'Biologia', color: '#C4C4C4', minHours: 20, maxHours: 30 },
  { id: 't5', name: 'Paula Costa', subject: 'História', color: '#999999', minHours: 20, maxHours: 30 },
];

const initialClasses: ClassSession[] = [
  { id: 'c1', teacherId: 't1', subject: 'Matemática', day: 'Segunda', startTime: '08:00', endTime: '09:30', room: 'Sala 101', courseId: 'c1', year: 1 },
  { id: 'c2', teacherId: 't1', subject: 'Matemática', day: 'Segunda', startTime: '10:00', endTime: '11:30', room: 'Sala 102', courseId: 'c1', year: 1 },
  { id: 'c3', teacherId: 't1', subject: 'Matemática', day: 'Terça', startTime: '08:00', endTime: '09:30', room: 'Sala 101', courseId: 'c1', year: 2 },
  { id: 'c4', teacherId: 't1', subject: 'Matemática', day: 'Quarta', startTime: '08:00', endTime: '09:30', room: 'Sala 103', courseId: 'c1', year: 3 },
  { id: 'c5', teacherId: 't2', subject: 'Física', day: 'Quinta', startTime: '10:00', endTime: '11:30', room: 'Lab 1', courseId: 'c1', year: 2 },
  { id: 'c6', teacherId: 't2', subject: 'Física', day: 'Segunda', startTime: '14:00', endTime: '15:30', room: 'Lab 1', courseId: 'c2', year: 1 },
  { id: 'c7', teacherId: 't2', subject: 'Física', day: 'Terça', startTime: '14:00', endTime: '15:30', room: 'Lab 1', courseId: 'c2', year: 2 },
  { id: 'c8', teacherId: 't3', subject: 'Química', day: 'Quarta', startTime: '14:00', endTime: '15:30', room: 'Lab 2', courseId: 'c2', year: 3 },
  { id: 'c9', teacherId: null, subject: 'História', day: 'Segunda', startTime: '08:00', endTime: '09:30', room: 'Sala 201', courseId: 'c1', year: 1 },
  { id: 'c10', teacherId: null, subject: 'Biologia', day: 'Quinta', startTime: '08:00', endTime: '09:30', room: 'Lab 3', courseId: 'c1', year: 1 },
];

export default function App() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [classes, setClasses] = useState<ClassSession[]>(initialClasses);
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0].id);
  const [selectedYear, setSelectedYear] = useState<number>(1);

  const filteredClasses = classes.filter(
    c => c.courseId === selectedCourseId && c.year === selectedYear
  );

  const calculateHours = (teacherId: string): number => {
    const teacherClasses = classes.filter(c => c.teacherId === teacherId);
    return teacherClasses.reduce((total, cls) => {
      const [startH, startM] = cls.startTime.split(':').map(Number);
      const [endH, endM] = cls.endTime.split(':').map(Number);
      const duration = (endH * 60 + endM - (startH * 60 + startM)) / 60;
      return total + duration;
    }, 0);
  };

  const checkTimeConflict = (teacherId: string, day: string, startTime: string, endTime: string, excludeClassId?: string): boolean => {
    const timeToMinutes = (time: string): number => {
      const [hours, minutes] = time.split(':').map(Number);
      return hours * 60 + minutes;
    };

    const newStart = timeToMinutes(startTime);
    const newEnd = timeToMinutes(endTime);

    return classes.some(cls => {
      if (cls.id === excludeClassId) return false;
      if (cls.teacherId !== teacherId) return false;
      if (cls.day !== day) return false;

      const existingStart = timeToMinutes(cls.startTime);
      const existingEnd = timeToMinutes(cls.endTime);

      return (newStart < existingEnd && newEnd > existingStart);
    });
  };

  const assignTeacher = (classId: string, teacherId: string | null) => {
    const cls = classes.find(c => c.id === classId);
    if (!cls) return;

    if (teacherId) {
      const hasConflict = checkTimeConflict(teacherId, cls.day, cls.startTime, cls.endTime, classId);
      if (hasConflict) {
        alert('⚠️ Conflito de horário: este professor já tem uma aula neste período.');
        return;
      }
    }

    setClasses(prev => prev.map(c => c.id === classId ? { ...c, teacherId } : c));
  };

  const addClass = (newClass: Omit<ClassSession, 'id'>) => {
    const id = `c${Date.now()}`;
    setClasses(prev => [...prev, { ...newClass, id }]);
    setShowAddModal(false);
  };

  const removeClass = (classId: string) => {
    setClasses(prev => prev.filter(c => c.id !== classId));
  };

  const editClass = (classId: string, updates: Partial<ClassSession>) => {
    setClasses(prev => prev.map(c => c.id === classId ? { ...c, ...updates } : c));
  };

  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[1600px] mx-auto px-12 py-16">
        <header className="mb-12">
          <div className="flex items-end justify-between">
            <div>
              <h1 className="text-[2.5rem] tracking-[-0.02em] text-[#1a1a1a] mb-2" style={{ fontWeight: 300 }}>
                Organizador de Grade
              </h1>
              <p className="text-[#666666] text-[0.95rem] tracking-wide" style={{ fontWeight: 300 }}>
                ETEC de Peruíbe — Balanceamento inteligente de carga horária
              </p>
            </div>
            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-5 py-2.5 bg-[#E85D75] text-white rounded-[2px] hover:bg-[#D64D65] transition-colors"
              style={{ fontWeight: 400 }}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Nova Aula
            </button>
          </div>
        </header>

        <CourseSelector
          courses={courses}
          selectedCourseId={selectedCourseId}
          selectedYear={selectedYear}
          onCourseChange={setSelectedCourseId}
          onYearChange={setSelectedYear}
          classCount={filteredClasses.length}
        />

        <WorkloadDashboard
          teachers={teachers}
          calculateHours={calculateHours}
        />

        <ScheduleGrid
          classes={filteredClasses}
          teachers={teachers}
          onAssignTeacher={assignTeacher}
          onRemoveClass={removeClass}
          onEditClass={editClass}
        />
      </div>

      {showAddModal && (
        <AddClassModal
          teachers={teachers}
          courses={courses}
          selectedCourseId={selectedCourseId}
          selectedYear={selectedYear}
          onAdd={addClass}
          onClose={() => setShowAddModal(false)}
        />
      )}
    </div>
  );
}