import { useState } from "react";
import { X, Plus } from "lucide-react";
import { TeacherData } from "../services/database";

interface Props {
  onAdd: (teacher: TeacherData) => void;
  onClose: () => void;
}

export default function AddTeacherModal({ onAdd, onClose }: Props) {
  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [subjects, setSubjects] = useState("");
  const [minHours, setMinHours] = useState(20);
  const [maxHours, setMaxHours] = useState(30);
  const [wantsLongLunch, setWantsLongLunch] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!name || !code || !subjects) {
      alert("Preencha todos os campos obrigatórios.");
      return;
    }

    const subjectList = subjects
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    onAdd({
      id: `t${Date.now()}`,
      name,
      code,
      subject: subjectList[0],
      subjects: subjectList,
      color: "#E85D75",
      minHours,
      maxHours,
      wantsLongLunch,
    });
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div className="bg-white w-full max-w-lg rounded shadow-lg" onClick={(e) => e.stopPropagation()}>
        <div className="flex justify-between items-center p-6 border-b">
          <h2 className="text-xl">Cadastrar Professor</h2>
          <button onClick={onClose}>
            <X />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          <input
            className="w-full border px-3 py-2"
            placeholder="Nome do professor"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />

          <input
            className="w-full border px-3 py-2"
            placeholder="Código do professor"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />

          <input
            className="w-full border px-3 py-2"
            placeholder="Matérias: Matemática, Física, Química"
            value={subjects}
            onChange={(e) => setSubjects(e.target.value)}
          />

          <div className="grid grid-cols-2 gap-3">
            <p>Minímo de horas:</p>
            <input
              type="number"
              className="border px-3 py-2"
              placeholder="Mínimo de horas"
              value={minHours}
              onChange={(e) => setMinHours(Number(e.target.value))}
            />
            
            <p>Máximo de horas:</p>
            <input
              type="number"
              className="border px-3 py-2"
              placeholder="Máximo de horas"
              value={maxHours}
              onChange={(e) => setMaxHours(Number(e.target.value))}
            />
          </div>

          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={wantsLongLunch}
              onChange={(e) => setWantsLongLunch(e.target.checked)}
            />
            Quer almoço superior a 20 minutos
          </label>

          <button className="w-full bg-pink-500 text-white py-2 flex items-center justify-center gap-2">
            <Plus size={16} />
            Cadastrar professor
          </button>
        </form>
      </div>
    </div>
  );
}