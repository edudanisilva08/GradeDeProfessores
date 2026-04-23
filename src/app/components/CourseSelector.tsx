import { GraduationCap, BookOpen } from 'lucide-react';

interface Course {
  id: string;
  name: string;
  shift: string;
}

interface CourseSelectorProps {
  courses: Course[];
  selectedCourseId: string;
  selectedYear: number;
  onCourseChange: (courseId: string) => void;
  onYearChange: (year: number) => void;
  classCount: number;
}

export default function CourseSelector({
  courses,
  selectedCourseId,
  selectedYear,
  onCourseChange,
  onYearChange,
  classCount,
}: CourseSelectorProps) {
  const selectedCourse = courses.find(c => c.id === selectedCourseId);

  return (
    <div className="mb-12">
      <div className="bg-white rounded-[2px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-6">
          <GraduationCap className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.2} />
          <h2 className="text-[1.1rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>
            Seleção de Curso e Turma
          </h2>
        </div>

        <div className="grid grid-cols-12 gap-6">
          <div className="col-span-7">
            <label className="block text-[0.85rem] text-[#888888] mb-3" style={{ fontWeight: 300 }}>
              Curso
            </label>
            <select
              value={selectedCourseId}
              onChange={(e) => onCourseChange(e.target.value)}
              className="w-full px-4 py-3 text-[0.95rem] bg-[#FAFAFA] border border-[#E5E5E5] rounded-[2px] text-[#1a1a1a] focus:outline-none focus:border-[#E85D75] transition-colors"
              style={{ fontWeight: 300 }}
            >
              {courses.map(course => (
                <option key={course.id} value={course.id}>
                  {course.name} ({course.shift})
                </option>
              ))}
            </select>
          </div>

          <div className="col-span-3">
            <label className="block text-[0.85rem] text-[#888888] mb-3" style={{ fontWeight: 300 }}>
              Ano
            </label>
            <div className="flex gap-2">
              {[1, 2, 3].map(year => (
                <button
                  key={year}
                  onClick={() => onYearChange(year)}
                  className={`flex-1 px-4 py-3 rounded-[2px] transition-all ${
                    selectedYear === year
                      ? 'bg-[#E85D75] text-white'
                      : 'bg-[#FAFAFA] text-[#1a1a1a] border border-[#E5E5E5] hover:border-[#E85D75]'
                  }`}
                  style={{ fontWeight: 400 }}
                >
                  {year}º
                </button>
              ))}
            </div>
          </div>

          <div className="col-span-2">
            <label className="block text-[0.85rem] text-[#888888] mb-3" style={{ fontWeight: 300 }}>
              Total de aulas
            </label>
            <div className="flex items-center justify-center h-[52px] bg-[#FAFAFA] rounded-[2px] border border-[#E5E5E5]">
              <p className="font-mono text-[1.5rem] text-[#1a1a1a] tabular-nums" style={{ fontWeight: 300 }}>
                {classCount}
              </p>
            </div>
          </div>
        </div>

        {selectedCourse && (
          <div className="mt-6 pt-6 border-t border-[#F0F0F0]">
            <div className="flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-[#888888]" strokeWidth={1.5} />
              <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
                Visualizando grade do{' '}
                <span className="text-[#1a1a1a]" style={{ fontWeight: 400 }}>
                  {selectedYear}º ano
                </span>
                {' '}de{' '}
                <span className="text-[#1a1a1a]" style={{ fontWeight: 400 }}>
                  {selectedCourse.name}
                </span>
                {' '}({selectedCourse.shift})
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
