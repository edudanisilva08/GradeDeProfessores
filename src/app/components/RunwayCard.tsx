import { TrendingUp } from 'lucide-react';

interface RunwayCardProps {
  totalRevenue: number;
}

export default function RunwayCard({ totalRevenue }: RunwayCardProps) {
  const runway = totalRevenue / 4500;
  const runwayMonths = Math.floor(runway);

  return (
    <div className="bg-white rounded-[2px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)]">
      <div className="flex items-center gap-3 mb-6">
        <TrendingUp className="w-5 h-5 text-[#E85D75]" strokeWidth={1.2} />
        <h2 className="text-[1.1rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>Monthly Runway</h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[0.85rem] text-[#888888] mb-2" style={{ fontWeight: 300 }}>
            Receita total acumulada
          </p>
          <p className="font-mono text-[2.5rem] text-[#1a1a1a] tabular-nums" style={{ fontWeight: 300 }}>
            R$ {totalRevenue.toLocaleString('pt-BR')}
          </p>
        </div>

        <div className="h-[1px] bg-[#F0F0F0]" />

        <div className="grid grid-cols-2 gap-8">
          <div>
            <p className="text-[0.85rem] text-[#888888] mb-2" style={{ fontWeight: 300 }}>
              Pista de pouso
            </p>
            <p className="font-mono text-[1.8rem] text-[#1a1a1a] tabular-nums" style={{ fontWeight: 300 }}>
              {runwayMonths} meses
            </p>
          </div>
          <div>
            <p className="text-[0.85rem] text-[#888888] mb-2" style={{ fontWeight: 300 }}>
              Taxa de consumo
            </p>
            <p className="font-mono text-[1.8rem] text-[#1a1a1a] tabular-nums" style={{ fontWeight: 300 }}>
              R$ 4.500/mês
            </p>
          </div>
        </div>

        <div className="mt-4">
          <div className="w-full h-1.5 bg-[#F5F5F5] rounded-full overflow-hidden">
            <div
              className="h-full bg-[#E85D75] transition-all duration-500"
              style={{ width: `${Math.min(runwayMonths * 8.33, 100)}%` }}
            />
          </div>
          <p className="text-[0.8rem] text-[#AAAAAA] mt-2 text-right" style={{ fontWeight: 300 }}>
            {runwayMonths >= 10 ? 'Seguro' : runwayMonths >= 6 ? 'Estável' : 'Atençao necessária'}
          </p>
        </div>
      </div>
    </div>
  );
}
