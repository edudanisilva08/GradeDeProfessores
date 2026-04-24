import { useState } from 'react';
import { X, Plus } from 'lucide-react';
import { getTimeBlocksByCourse } from "../services/schedule.ts";

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
  teacherId: string | null;
  subject: string;
  day: string;
  startTime: string;
  endTime: string;
  room: string;
  courseId: string;
  year: number;
}

interface AddClassModalProps {
  teachers: Teacher[];
  courses: Course[];
  selectedCourseId: string;
  selectedYear: number;
  onAdd: (classData: ClassSession) => void;
  onClose: () => void;
}

const DAYS = ['Segunda', 'Terça', 'Quarta', 'Quinta', 'Sexta'];


export default function AddClassModal({ teachers, courses, selectedCourseId, selectedYear, onAdd, onClose }: AddClassModalProps) {
  const [formData, setFormData] = useState<ClassSession>({
    teacherId: null,
    subject: "",
    day: "Segunda",
    startTime: "",
    endTime: "",
    room: "Sala não definida",
    courseId: selectedCourseId,
    year: selectedYear,
  });

  const selectedCourse = courses.find((c) => c.id === formData.courseId);
  const timeBlocks = getTimeBlocksByCourse(selectedCourse?.name || "");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
  if (!formData.subject || !formData.startTime || !formData.endTime) {
    alert("Preencha todos os campos obrigatórios");
    return;
  }
    onAdd(formData);
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div
        className="bg-white rounded-[2px] shadow-[0_4px_12px_rgba(0,0,0,0.08)] w-full max-w-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-6 border-b border-[#F0F0F0]">
          <h2 className="text-[1.2rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>
            Adicionar Nova Aula
          </h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-[#F5F5F5] rounded-[2px] transition-colors"
          >
            <X className="w-5 h-5 text-[#888888]" strokeWidth={1.5} />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5">
          <div>
            <label className="block text-[0.9rem] text-[#1a1a1a] mb-2" style={{ fontWeight: 400 }}>
              Disciplina *
            </label>
            <input
              type="text"
              value={formData.subject}
              onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
              placeholder="Ex: Matemática"
              className="w-full px-4 py-2.5 text-[0.9rem] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
              style={{ fontWeight: 300 }}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[0.9rem] text-[#1a1a1a] mb-2" style={{ fontWeight: 400 }}>
                Curso *
              </label>
              <select
                value={formData.courseId}
                onChange={(e) => setFormData({ ...formData, courseId: e.target.value })}
                className="w-full px-4 py-2.5 text-[0.9rem] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
                style={{ fontWeight: 300 }}
              >
                {courses.map(course => (
                  <option key={course.id} value={course.id}>
                    {course.name} ({course.shift})
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-[0.9rem] text-[#1a1a1a] mb-2" style={{ fontWeight: 400 }}>
                Ano *
              </label>
              <select
                value={formData.year}
                onChange={(e) => setFormData({ ...formData, year: parseInt(e.target.value) })}
                className="w-full px-4 py-2.5 text-[0.9rem] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
                style={{ fontWeight: 300 }}
              >
                <option value={1}>1º ano</option>
                <option value={2}>2º ano</option>
                <option value={3}>3º ano</option>
              </select>
            </div>
          </div>

          <div>
            <label className="block text-[0.9rem] text-[#1a1a1a] mb-2" style={{ fontWeight: 400 }}>
              Dia da Semana *
            </label>

            <select
              value={formData.day}
              onChange={(e) => setFormData({ ...formData, day: e.target.value })}
              className="w-full px-4 py-2.5 text-[0.9rem] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
              style={{ fontWeight: 300 }}
              required
            >
              {DAYS.map((day) => (
                <option key={day} value={day}>
                  {day}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-[0.9rem] text-[#1a1a1a] mb-2" style={{ fontWeight: 400 }}>
              Horário da aula *
            </label>

            <select
              value={
                formData.startTime && formData.endTime
                  ? `${formData.startTime}-${formData.endTime}`
                  : ""
              }
              onChange={(e) => {
                const [start, end] = e.target.value.split("-");
                setFormData({
                  ...formData,
                  startTime: start,
                  endTime: end,
                });
              }}
              className="w-full px-4 py-2.5 text-[0.9rem] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
              style={{ fontWeight: 300 }}
              required
            >
              <option value="">Selecione o horário</option>

              {timeBlocks.map((block) => (
                <option key={block.id} value={`${block.startTime}-${block.endTime}`}>
                  {block.label} — {block.startTime} às {block.endTime}
                </option>
              ))}
            </select>
          </div>


          <div>
            <label className="block text-[0.9rem] text-[#1a1a1a] mb-2" style={{ fontWeight: 400 }}>
              Professor (opcional)
            </label>
            <select
              value={formData.teacherId || ''}
              onChange={(e) => setFormData({ ...formData, teacherId: e.target.value || null })}
              className="w-full px-4 py-2.5 text-[0.9rem] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
              style={{ fontWeight: 300 }}
            >
              <option value="">Atribuir depois</option>
              {teachers.map(teacher => (
                <option key={teacher.id} value={teacher.id}>
                  {teacher.name} — {teacher.subject}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2.5 bg-[#F5F5F5] text-[#1a1a1a] rounded-[2px] hover:bg-[#E5E5E5] transition-colors"
              style={{ fontWeight: 400 }}
            >
              Cancelar
            </button>
            <button
              type="submit"
              className="flex-1 flex items-center justify-center gap-2 px-4 py-2.5 bg-[#E85D75] text-white rounded-[2px] hover:bg-[#D64D65] transition-colors"
              style={{ fontWeight: 400 }}
            >
              <Plus className="w-4 h-4" strokeWidth={2} />
              Adicionar
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
