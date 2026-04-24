import { Shield } from 'lucide-react';

interface TaxNestProps {
  amount: number;
  percentage: number;
}

export default function TaxNest({ amount, percentage }: TaxNestProps) {
  return (
    <div className="bg-white rounded-[2px] p-8 shadow-[0_1px_3px_rgba(0,0,0,0.04)] h-full">
      <div className="flex items-center gap-3 mb-6">
        <Shield className="w-5 h-5 text-[#1a1a1a]" strokeWidth={1.2} />
        <h2 className="text-[1.1rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>The Tax Nest</h2>
      </div>

      <div className="space-y-6">
        <div>
          <p className="text-[0.85rem] text-[#888888] mb-2" style={{ fontWeight: 300 }}>
            Fundos reservados
          </p>
          <p className="font-mono text-[2rem] text-[#1a1a1a] tabular-nums" style={{ fontWeight: 300 }}>
            R$ {amount.toLocaleString('pt-BR', { maximumFractionDigits: 0 })}
          </p>
        </div>

        <div className="h-[1px] bg-[#F0F0F0]" />

        <div>
          <p className="text-[0.85rem] text-[#888888] mb-3" style={{ fontWeight: 300 }}>
            Taxa de reserva
          </p>
          <div className="flex items-baseline gap-2">
            <p className="font-mono text-[2.5rem] text-[#1a1a1a] tabular-nums" style={{ fontWeight: 300 }}>
              {percentage}
            </p>
            <p className="text-[1.5rem] text-[#AAAAAA]" style={{ fontWeight: 300 }}>%</p>
          </div>
        </div>

        <div className="mt-6 pt-6 border-t border-[#F0F0F0]">
          <div className="flex items-center justify-between">
            <p className="text-[0.85rem] text-[#888888]" style={{ fontWeight: 300 }}>
              Status
            </p>
            <div className="flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-[#4CAF50]" />
              <p className="text-[0.85rem] text-[#1a1a1a]" style={{ fontWeight: 400 }}>
                Protegido
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
