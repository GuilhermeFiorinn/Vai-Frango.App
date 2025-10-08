"use client";

import TreinoDoDia from "./Treino";
import TreinoRapido from "./TreinoRap";

export default function AbaTreino() {
  return (
    <div className="w-full space-y-12"> {/* Espaçamento entre os componentes, e separa os duas partes pra ser melhor de organizar */}
      <TreinoDoDia />
      <TreinoRapido />
    </div>
  );
}