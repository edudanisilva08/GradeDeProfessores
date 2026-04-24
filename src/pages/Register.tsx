import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { register } from "../services/auth";
import { salvarProfessor } from "../services/database";

export default function Register() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [code, setCode] = useState("");
  const [subjects, setSubjects] = useState("");
  const [wantsLongLunch, setWantsLongLunch] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      setLoading(true);

      const userCredential = await register(email, password);

      const subjectList = subjects
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      await salvarProfessor({
        id: userCredential.user.uid,
        name,
        code,
        email,
        subject: subjectList[0],
        subjects: subjectList,
        color: "#E85D75",
        minHours: 20,
        maxHours: 30,
        wantsLongLunch,
      });

      alert("Cadastro realizado com sucesso.");
      navigate("/");
    } catch (error) {
      console.error(error);
      alert("Erro ao cadastrar usuário.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#FAFAFA] px-4">
      <div className="w-full max-w-lg bg-white p-8 shadow-md rounded-lg">
        <h1 className="text-2xl font-semibold mb-2 text-center">Cadastro</h1>
        <p className="text-sm text-gray-500 mb-6 text-center">
          Crie sua conta de professor
        </p>

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-sm mb-1">Nome</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">ID</label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">
              Especializações
            </label>
            <input
              type="text"
              className="w-full border rounded-md px-3 py-2"
              value={subjects}
              onChange={(e) => setSubjects(e.target.value)}
              placeholder="Ex: Matemática, Física, Robótica"
              required
            />
            <p className="text-xs text-gray-500 mt-1">
              Separe as matérias por vírgula.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <input
              id="longLunch"
              type="checkbox"
              checked={wantsLongLunch}
              onChange={(e) => setWantsLongLunch(e.target.checked)}
            />
            <label htmlFor="longLunch" className="text-sm">
              Quero horário de almoço superior a 20 minutos
            </label>
          </div>

          <div>
            <label className="block text-sm mb-1">E-mail</label>
            <input
              type="email"
              className="w-full border rounded-md px-3 py-2"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div>
            <label className="block text-sm mb-1">Senha</label>
            <input
              type="password"
              className="w-full border rounded-md px-3 py-2"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-pink-500 hover:bg-pink-600 text-white py-2 rounded-md transition"
          >
            {loading ? "Cadastrando..." : "Cadastrar"}
          </button>
        </form>

        <p className="text-sm text-center mt-4 text-gray-600">
          Já tem conta?{" "}
          <Link to="/" className="text-pink-500 hover:underline">
            Fazer login
          </Link>
        </p>
      </div>
    </div>
  );
}