"use client";
import { useState, useEffect } from "react";

type ExercicioRapido = {
  id: number;
  nome: string;
  duracao: string;
};

type PresetDeTreino = {
  id: number;
  nome: string;
  descricao?: string;
  exercicios: ExercicioRapido[];
};

// Tela para escolher o preset
function SelecaoDePreset({ presets, onSelecionar }: { presets: PresetDeTreino[], onSelecionar: (preset: PresetDeTreino) => void }) {
  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-4">Escolha um Treino Rápido</h2>
      <div className="space-y-3">
        {presets.map((preset) => (
          <button 
            key={preset.id}
            onClick={() => onSelecionar(preset)}
            className="w-full text-left p-4 bg-gray-50 dark:bg-gray-700/50 hover:bg-gray-100 dark:hover:bg-gray-700 rounded-lg transition-colors"
          >
            <h3 className="font-bold text-lg text-gray-800 dark:text-gray-200">{preset.nome}</h3>
            {preset.descricao && <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{preset.descricao}</p>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Tela do treino
function ExibicaoDeTreino({ preset, onVoltar }: { preset: PresetDeTreino, onVoltar: () => void }) {
  const [exerciciosConcluidos, setExerciciosConcluidos] = useState<Set<number>>(new Set());

  function handleToggleFinished(id: number) {
    const novosConcluidos = new Set(exerciciosConcluidos);
    if (novosConcluidos.has(id)) {
      novosConcluidos.delete(id);
    } else {
      novosConcluidos.add(id);
    }
    setExerciciosConcluidos(novosConcluidos);
  }

  if (!preset.exercicios || preset.exercicios.length === 0) {
    return (
      <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{preset.nome}</h2>
          <button onClick={onVoltar} className="text-sm text-orange-600 hover:underline">
            Voltar
          </button>
        </div>
        <p className="text-gray-500 dark:text-gray-400">Este preset de treino ainda não contém exercícios.</p>
      </div>
    );
  }

  return (
    <div className="w-full max-w-3xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 border border-gray-200 dark:border-gray-700">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100">{preset.nome}</h2>
        <button onClick={onVoltar} className="text-sm text-orange-600 hover:underline">
          Voltar
        </button>
      </div>
      <ul className="space-y-3">
        {preset.exercicios.map((ex) => {
          const isFinished = exerciciosConcluidos.has(ex.id);
          return (
            <li key={ex.id} className="flex items-center p-3 bg-gray-50 dark:bg-gray-700/50 rounded-md">
              <input
                type="checkbox"
                checked={isFinished}
                onChange={() => handleToggleFinished(ex.id)}
                className="h-6 w-6 rounded border-gray-300 text-orange-600 focus:ring-orange-500 mr-4 cursor-pointer"
              />
              <div className="flex-1 flex justify-between items-center">
                <h3 className={`text-lg font-semibold text-gray-900 dark:text-gray-200 ${isFinished ? 'line-through text-gray-500 dark:text-gray-400' : ''}`}>
                  {ex.nome}
                </h3>
                <p className={`text-sm font-mono text-gray-600 dark:text-gray-400 ${isFinished ? 'line-through' : ''}`}>
                  {ex.duracao}
                </p>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

export default function TreinoRapido() {
  const [presets, setPresets] = useState<PresetDeTreino[]>([]);
  const [presetSelecionado, setPresetSelecionado] = useState<PresetDeTreino | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarPresets() {
      try {
        const resposta = await fetch('/api/preExercises');
        if (!resposta.ok) {
          throw new Error('Falha ao carregar os presets de treino.');
        }
        const dados: PresetDeTreino[] = await resposta.json();
        setPresets(dados);
      } catch (err) {
        setErro("Não foi possível carregar os treinos rápidos.");
      } finally {
        setCarregando(false);
      }
    }
    buscarPresets();
  }, []);

  if (carregando) {
    return <div className="text-center text-sm text-gray-500">Carregando treinos...</div>;
  }
  if (erro) {
    return <div className="text-center text-red-500">{erro}</div>;
  }
  
  if (presetSelecionado) {
    return (
      <ExibicaoDeTreino 
        preset={presetSelecionado} 
        onVoltar={() => setPresetSelecionado(null)} 
      />
    );
  }
  return (
    <SelecaoDePreset 
      presets={presets} 
      onSelecionar={(preset) => setPresetSelecionado(preset)} 
    />
  );
}