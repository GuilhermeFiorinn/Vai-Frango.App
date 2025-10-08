"use client";
import { useState, useEffect } from "react";

type ExercicioRapido = {
  id: number;
  nome: string;
  duracao: string;
};

export default function TreinoRapido() {
  const [exercicios, setExercicios] = useState<ExercicioRapido[]>([]);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarExercicios() {
      try {
        const resposta = await fetch('/api/preExercises');
        if (!resposta.ok) {
          throw new Error('Falha ao carregar treino rápido.');
        }
        const dados = await resposta.json();
        setExercicios(dados);
      } catch (err) {
        setErro("Não foi possível carregar o treino rápido.");
      } finally {
        setCarregando(false);
      }
    }
    buscarExercicios();
  }, []);

  if (carregando) {
    return <div className="text-center text-sm text-gray-500">Carregando treino rápido...</div>;
  }

  if (erro) {
    return <div className="text-center text-red-500">{erro}</div>;
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Treino Rápido</h2>
      <ul className="space-y-3">
        {exercicios.map((ex) => (
          <li key={ex.id} className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
            <span className="font-medium text-gray-700 dark:text-gray-300">{ex.nome}</span>
            <span className="font-mono text-gray-500 dark:text-gray-400">{ex.duracao}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}