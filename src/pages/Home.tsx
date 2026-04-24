import { useState } from "react";
import { Plus, Download } from "lucide-react";

import ScheduleGrid from "../components/ScheduleGrid";
import WorkloadDashboard from "../components/WorkloadDashboard";
import AddClassModal from "../components/AddClassModal";
import CourseSelector from "../components/CourseSelector";
import AddTeacherModal from "../components/AddTeacherModal";

import { exportarPDF } from "../services/pdf";
import { isJogosDigitaisCourse } from "../services/schedule";
import { logout } from "../services/auth";
import { useNavigate } from "react-router-dom";

interface Teacher {
  id: string;
  name: string;
  subject: string;
  subjects: string[];
  code: string;
  color: string;
  minHours: number;
  maxHours: number;
  wantsLongLunch: boolean;
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
  { id: "c1", name: "Administração", shift: "M-Tec-PI" },
  { id: "c2", name: "Desenvolvimento de Sistemas", shift: "M-Tec-PI" },
  { id: "c3", name: "Design de Interiores", shift: "M-Tec-PI" },
  { id: "c4", name: "Programação de Jogos Digitais", shift: "M-Tec" },
  { id: "c5", name: "Administração", shift: "M-Tec-N" },
  { id: "c6", name: "Edificações", shift: "M-Tec-N" },
];

const initialTeachers: Teacher[] = [
  {
    id: "t1",
    name: "Gilsbert Silva",
    code: "P001",
    subject: "Informática Básica",
    subjects: ["Hardware"],
    color: "#E85D75",
    minHours: 20,
    maxHours: 30,
    wantsLongLunch: true,
  },
  {
    id: "t2",
    name: "Yuri Martins",
    code: "P002",
    subject: "Banco de Dados",
    subjects: ["SQL"],
    color: "#8B8B8B",
    minHours: 20,
    maxHours: 30,
    wantsLongLunch: false,
  },
];

const initialClasses: ClassSession[] = [
  {
    id: "c1",
    teacherId: "t1",
    subject: "Informática Básica",
    day: "Segunda",
    startTime: "08:00",
    endTime: "08:50",
    room: "Sala não definida",
    courseId: "c1",
    year: 1,
  },
  {
    id: "c2",
    teacherId: "t2",
    subject: "Banco de Dados",
    day: "Terça",
    startTime: "08:50",
    endTime: "09:40",
    room: "Sala não definida",
    courseId: "c1",
    year: 1,
  },
];

export default function Home() {
  const [teachers, setTeachers] = useState<Teacher[]>(initialTeachers);
  const [classes, setClasses] = useState<ClassSession[]>(initialClasses);

  const [showTeacherModal, setShowTeacherModal] = useState(false);
  const [showAddModal, setShowAddModal] = useState(false);

  const [selectedCourseId, setSelectedCourseId] = useState<string>(courses[0].id);
  const [selectedYear, setSelectedYear] = useState<number>(1);

  const filteredClasses = classes.filter(
    (c) => c.courseId === selectedCourseId && c.year === selectedYear
  );

  const navigate = useNavigate();

  const handleLogout = async () => {
  await logout();
  navigate("/");
};

  const atualizar = (novaLista: ClassSession[]) => {
    setClasses(novaLista);
  };

  const isLastJogosClass = (cls: ClassSession) => {
    const course = courses.find((c) => c.id === cls.courseId);

    if (!course) return false;

    return (
      isJogosDigitaisCourse(course.name) &&
      cls.startTime === "12:20" &&
      cls.endTime === "13:10"
    );
  };

  const isBlockedAfterJogosLunch = (
    teacherId: string,
    targetDay: string,
    targetStartTime: string
  ): boolean => {
    const teacher = teachers.find((t) => t.id === teacherId);

    if (!teacher || !teacher.wantsLongLunch) return false;

    const hasLastJogosClass = classes.some(
      (cls) =>
        cls.teacherId === teacherId &&
        cls.day === targetDay &&
        isLastJogosClass(cls)
    );

    return hasLastJogosClass && targetStartTime === "13:30";
  };

  const calculateHours = (teacherId: string): number => {
    const teacherClasses = classes.filter((c) => c.teacherId === teacherId);

    return teacherClasses.reduce((total, cls) => {
      const [sh, sm] = cls.startTime.split(":").map(Number);
      const [eh, em] = cls.endTime.split(":").map(Number);

      return total + (eh * 60 + em - (sh * 60 + sm)) / 60;
    }, 0);
  };

  const checkTimeConflict = (
    teacherId: string,
    day: string,
    startTime: string,
    endTime: string,
    excludeId?: string
  ): boolean => {
    const toMin = (time: string) => {
      const [h, m] = time.split(":").map(Number);
      return h * 60 + m;
    };

    const newStart = toMin(startTime);
    const newEnd = toMin(endTime);

    return classes.some((cls) => {
      if (cls.id === excludeId) return false;
      if (cls.day !== day) return false;
      if (cls.teacherId !== teacherId) return false;

      const existingStart = toMin(cls.startTime);
      const existingEnd = toMin(cls.endTime);

      return newStart < existingEnd && newEnd > existingStart;
    });
  };

  const assignTeacher = (classId: string, teacherId: string | null) => {
    const cls = classes.find((c) => c.id === classId);
    if (!cls) return;

    if (teacherId) {
      const hasConflict = checkTimeConflict(
        teacherId,
        cls.day,
        cls.startTime,
        cls.endTime,
        classId
      );

      if (hasConflict) {
        alert("⚠️ Conflito de horário: este professor já tem uma aula neste período.");
        return;
      }

      const blockedByLunchRule = isBlockedAfterJogosLunch(
        teacherId,
        cls.day,
        cls.startTime
      );

      if (blockedByLunchRule) {
        alert(
          "⚠️ Este professor pediu almoço maior que 20 minutos. Como ele dá a última aula de Jogos Digitais, não pode pegar a aula das 13:30."
        );
        return;
      }
    }

    atualizar(
      classes.map((c) => (c.id === classId ? { ...c, teacherId } : c))
    );
  };

  const addClass = (newClass: Omit<ClassSession, "id">) => {
    const nova: ClassSession = {
      ...newClass,
      id: `c${Date.now()}`,
    };

    atualizar([...classes, nova]);
    setShowAddModal(false);
  };

  const removeClass = (id: string) => {
    atualizar(classes.filter((c) => c.id !== id));
  };

  const editClass = (classId: string, updates: Partial<ClassSession>) => {
    const currentClass = classes.find((c) => c.id === classId);
    if (!currentClass) return;

    const updatedClass = { ...currentClass, ...updates };

    if (updatedClass.teacherId) {
      const hasConflict = checkTimeConflict(
        updatedClass.teacherId,
        updatedClass.day,
        updatedClass.startTime,
        updatedClass.endTime,
        classId
      );

      if (hasConflict) {
        alert("⚠️ Conflito de horário ao editar aula.");
        return;
      }

      const blockedByLunchRule = isBlockedAfterJogosLunch(
        updatedClass.teacherId,
        updatedClass.day,
        updatedClass.startTime
      );

      if (blockedByLunchRule) {
        alert(
          "⚠️ Este professor solicitou almoço maior que 20 minutos e não pode assumir esta aula após Jogos Digitais."
        );
        return;
      }
    }

    atualizar(
      classes.map((c) => (c.id === classId ? updatedClass : c))
    );
  };

  const addTeacher = (teacher: Teacher) => {
    setTeachers((prev) => [...prev, teacher]);
    setShowTeacherModal(false);
  };

  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <div className="max-w-[1600px] mx-auto px-12 py-16">
        <header className="mb-12 flex justify-between items-end">
          <div>
            <h1 className="text-3xl font-light mb-2">
              Organizador de Grade
            </h1>
            <p className="text-gray-500">
              Sistema local — Firebase pausado por enquanto
            </p>
          </div>

          <div className="flex gap-3">
            <button
              onClick={exportarPDF}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white"
            >
              <Download size={16} />
              PDF
            </button>

            <button
              onClick={() => setShowTeacherModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-gray-800 text-white"
            >
              <Plus size={16} />
              Professor
            </button>

            <button
              onClick={() => setShowAddModal(true)}
              className="flex items-center gap-2 px-4 py-2 bg-pink-500 text-white"
            >
              <Plus size={16} />
              Nova Aula
            </button>
          </div>

          <button
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white"
          >
            Logout
          </button>
          
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

        <div id="grade">
          <ScheduleGrid
            classes={filteredClasses}
            teachers={teachers}
            onAssignTeacher={assignTeacher}
            onRemoveClass={removeClass}
            onEditClass={editClass}
          />
        </div>
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

      {showTeacherModal && (
        <AddTeacherModal
          onAdd={addTeacher}
          onClose={() => setShowTeacherModal(false)}
        />
      )}
    </div>
  );
}