"use client";
import { useState, useEffect } from "react";
import { Exercise } from "../lib/exercises";

type CalendarEvents = Record<string, Exercise[]>;

function formatKey(d: Date): string {
  return d.toISOString().slice(0, 10);
}

export default function TreinoDoDia() {
  const [treino, setTreino] = useState<Exercise[] | null>(null);
  const [dataDoTreino, setDataDoTreino] = useState<Date | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState(false);

  // Busca os dados
  useEffect(() => {
    async function buscarProximoTreino() {
      try {
        const resposta = await fetch('/api/calendar');
        if (!resposta.ok) throw new Error('Falha ao carregar agendamentos.');
        const eventos: CalendarEvents = await resposta.json();
        const hoje = new Date();
        const chaveHoje = formatKey(hoje);
        if (eventos[chaveHoje] && eventos[chaveHoje].length > 0) {
          setTreino(eventos[chaveHoje]);
          setDataDoTreino(hoje);
        } else {
          const chavesFuturas = Object.keys(eventos)
            .filter(key => key >= chaveHoje && eventos[key].length > 0)
            .sort();
          if (chavesFuturas.length > 0) {
            const proximaChave = chavesFuturas[0];
            setTreino(eventos[proximaChave]);
            setDataDoTreino(new Date(proximaChave + 'T12:00:00Z'));
          } else {
            setTreino(null);
          }
        }
      } catch (err) {
        setErro("Não foi possível buscar seu cronograma de treinos.");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    buscarProximoTreino();
  }, []);

  async function handleToggleFinished(exercicioIndex: number) {
    if (!treino || !dataDoTreino) return;
    const novoTreino = JSON.parse(JSON.stringify(treino));
    novoTreino[exercicioIndex].finished = !novoTreino[exercicioIndex].finished;
    setTreino(novoTreino);
    try {
      const dateKey = formatKey(dataDoTreino);
      await fetch('/api/calendar', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ dateKey, exercises: novoTreino }),
      });
    } catch (error) {
      console.error("Falha ao salvar o progresso:", error);
      setTreino(treino);
      alert("Não foi possível salvar seu progresso. Tente novamente.");
    }
  }

  // --- Lógica de renderização (o que aparece na tela) ---

  if (carregando) return <div className="text-center p-10">Procurando seu treino...</div>;
  if (erro) return <div className="text-center p-10 text-red-500">{erro}</div>;
  if (!treino || !dataDoTreino) {
    return (
      <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
        <h2 className="text-2xl font-bold mb-2">Tudo pronto para começar?</h2>
        <p className="text-gray-600 dark:text-gray-400">Você ainda não agendou nenhum treino. Vá para a aba "Agenda" para planejar sua semana!</p>
      </div>
    );
  }

  // Calcula o progresso
  const totalExercicios = treino.length;
  const exerciciosConcluidos = treino.filter(ex => ex.finished).length;

  const ehHoje = formatKey(dataDoTreino) === formatKey(new Date());
  const titulo = ehHoje ? "Treino de Hoje" : "Seus Exercícios para o Dia";
  const previewExercicios = treino.slice(0, 3);

  return (
    <div className="w-full max-w-3xl mx-auto">
      <h1 className="text-3xl font-bold text-center mb-6 text-gray-800 dark:text-gray-200">
        Treino do Dia
      </h1>
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full bg-white dark:bg-gray-800 shadow-xl rounded-lg p-6 text-left border border-gray-200 dark:border-gray-700 transition-all duration-300"
        aria-expanded={isExpanded}
      >
        <div className="flex justify-between items-start">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{titulo}</h2>
          <span className="text-2xl text-gray-400 transform transition-transform duration-300" style={{ transform: isExpanded ? 'rotate(180deg)' : 'rotate(0deg)' }}>
            ▼
          </span>
        </div>
        {!isExpanded && (
          <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
            <div className="space-y-2">
              {previewExercicios.map((exercicio, index) => (
                <div key={index} className="flex justify-between text-sm text-gray-600 dark:text-gray-400">
                  <span>{exercicio.name}</span>
                  {exercicio.duration && <span className="font-mono">{exercicio.duration}</span>}
                </div>
              ))}
              {totalExercicios > 3 && (
                <p className="text-xs text-center text-gray-400 dark:text-gray-500 mt-2 pt-1">
                  ... e mais {totalExercicios - 3} exercício(s).
                </p>
              )}
            </div>
          </div>
        )}
        <div className="mt-4 pt-4 border-t border-gray-200 dark:border-gray-700">
          <p className="text-md text-gray-500 dark:text-gray-400">
            Progresso: {exerciciosConcluidos}/{totalExercicios}
          </p>
        </div>
      </button>
      
      {isExpanded && (
        <div className="mt-4 p-6 bg-gray-50 dark:bg-gray-800/50 rounded-lg shadow-inner animate-fade-in">
          <div className="space-y-3">
            {treino.map((exercicio, index) => (
              <div key={index} className="flex items-center p-4 bg-white dark:bg-gray-700/80 rounded-lg border border-gray-200 dark:border-gray-700">
                <input
                  type="checkbox"
                  checked={exercicio.finished}
                  onChange={() => handleToggleFinished(index)}
                  className="h-6 w-6 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-4 cursor-pointer"
                />
                <div className="flex-1">
                  <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-200 ${exercicio.finished ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                    {exercicio.name}
                  </h3>
                  {exercicio.duration && (
                    <p className={`text-sm text-gray-500 dark:text-gray-400 mt-1 ${exercicio.finished ? 'line-through' : ''}`}>
                      Duração: {exercicio.duration}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}