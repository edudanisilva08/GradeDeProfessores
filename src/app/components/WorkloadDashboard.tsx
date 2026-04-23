import { BarChart, Bar, ResponsiveContainer, XAxis, YAxis, Cell, ReferenceLine } from 'recharts';
import { Users, AlertTriangle, CheckCircle2 } from 'lucide-react';

interface Teacher {
  id: string;
  name: string;
  subject: string;
  color: string;
  minHours: number;
  maxHours: number;
}

interface WorkloadDashboardProps {
  teachers: Teacher[];
  calculateHours: (teacherId: string) => number;
}

export default function WorkloadDashboard({ teachers, calculateHours }: WorkloadDashboardProps) {
  const teacherData = teachers.map(teacher => {
    const hours = calculateHours(teacher.id);
    const status = hours < teacher.minHours ? 'low' : hours > teacher.maxHours ? 'high' : 'balanced';
    return {
      ...teacher,
      hours,
      status,
    };
  });

  const totalHours = teacherData.reduce((sum, t) => sum + t.hours, 0);
  const avgHours = totalHours / teachers.length;
  const balanced = teacherData.filter(t => t.status === 'balanced').length;
  const unbalanced = teachers.length - balanced;

  return (
    <div className="mb-12">
      <div className="bg-white rounded-[2px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
        <div className="flex items-center gap-3 mb-8">
          <Users className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.2} />
          <h2 className="text-[1.1rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>Distribuição de Carga Horária</h2>
        </div>

        <div className="grid grid-cols-12 gap-8 mb-8">
          <div className="col-span-4 space-y-6">
            <div>
              <p className="text-[0.85rem] text-[#888888] mb-2" style={{ fontWeight: 300 }}>
                Média de horas/semana
              </p>
              <p className="font-mono text-[2.5rem] text-[#1a1a1a] tabular-nums" style={{ fontWeight: 300 }}>
                {avgHours.toFixed(1)}h
              </p>
            </div>

            <div className="h-[1px] bg-[#F0F0F0]" />

            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <CheckCircle2 className="w-4 h-4 text-[#4CAF50]" strokeWidth={1.5} />
                  <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
                    Balanceados
                  </p>
                </div>
                <p className="font-mono text-[1.8rem] text-[#1a1a1a] tabular-nums" style={{ fontWeight: 300 }}>
                  {balanced}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <AlertTriangle className="w-4 h-4 text-[#E85D75]" strokeWidth={1.5} />
                  <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
                    Desbalanceados
                  </p>
                </div>
                <p className="font-mono text-[1.8rem] text-[#E85D75] tabular-nums" style={{ fontWeight: 300 }}>
                  {unbalanced}
                </p>
              </div>
            </div>
          </div>

          <div className="col-span-8">
            <ResponsiveContainer width="100%" height={200}>
              <BarChart data={teacherData} margin={{ top: 10, right: 10, left: -20, bottom: 20 }}>
                <XAxis
                  dataKey="name"
                  tick={{ fill: '#888888', fontSize: 12, fontWeight: 300 }}
                  axisLine={{ stroke: '#F0F0F0', strokeWidth: 1 }}
                  tickLine={false}
                  xAxisId="x-axis-workload"
                />
                <YAxis
                  tick={{ fill: '#888888', fontSize: 12, fontWeight: 300 }}
                  axisLine={{ stroke: '#F0F0F0', strokeWidth: 1 }}
                  tickLine={false}
                  label={{ value: 'Horas/semana', angle: -90, position: 'insideLeft', style: { fill: '#888888', fontSize: 12 } }}
                  yAxisId="y-axis-workload"
                />
                <ReferenceLine y={20} stroke="#CCCCCC" strokeDasharray="3 3" strokeWidth={1} xAxisId="x-axis-workload" yAxisId="y-axis-workload" />
                <ReferenceLine y={30} stroke="#CCCCCC" strokeDasharray="3 3" strokeWidth={1} xAxisId="x-axis-workload" yAxisId="y-axis-workload" />
                <Bar dataKey="hours" radius={[2, 2, 0, 0]} xAxisId="x-axis-workload" yAxisId="y-axis-workload">
                  {teacherData.map((entry) => (
                    <Cell
                      key={`cell-${entry.id}`}
                      fill={
                        entry.status === 'balanced'
                          ? '#4CAF50'
                          : entry.status === 'low'
                          ? '#FFA726'
                          : '#E85D75'
                      }
                    />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div className="flex items-center justify-center gap-6 mt-4">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-[1px] bg-[#FFA726]" />
                <p className="text-[0.8rem] text-[#888888]" style={{ fontWeight: 300 }}>
                  Abaixo do mínimo
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-[1px] bg-[#4CAF50]" />
                <p className="text-[0.8rem] text-[#888888]" style={{ fontWeight: 300 }}>
                  Balanceado (20-30h)
                </p>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 rounded-[1px] bg-[#E85D75]" />
                <p className="text-[0.8rem] text-[#888888]" style={{ fontWeight: 300 }}>
                  Acima do máximo
                </p>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-[#F0F0F0] pt-6">
          <div className="grid grid-cols-5 gap-4">
            {teacherData.map(teacher => (
              <div
                key={teacher.id}
                className={`p-4 rounded-[2px] border-2 transition-all ${
                  teacher.status === 'balanced'
                    ? 'bg-[#F0FFF4] border-[#4CAF50]'
                    : teacher.status === 'low'
                    ? 'bg-[#FFF8F0] border-[#FFA726]'
                    : 'bg-[#FFF5F7] border-[#E85D75]'
                }`}
              >
                <div className="flex items-center gap-2 mb-2">
                  <div className="w-2 h-2 rounded-full" style={{ backgroundColor: teacher.color }} />
                  <p className="text-[0.9rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>
                    {teacher.name.split(' ')[0]}
                  </p>
                </div>
                <p className="font-mono text-[1.5rem] text-[#1a1a1a] tabular-nums mb-1" style={{ fontWeight: 300 }}>
                  {teacher.hours.toFixed(1)}h
                </p>
                <p className="text-[0.75rem] text-[#888888]" style={{ fontWeight: 300 }}>
                  {teacher.minHours}-{teacher.maxHours}h ideal
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
