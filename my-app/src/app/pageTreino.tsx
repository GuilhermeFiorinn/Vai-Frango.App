"use client";

import TreinoDoDia from "./Treino";
import TreinoRapido from "./TreinoRap";

export default function AbaTreino() {
  return (
    <div className="w-full space-y-12">
      <TreinoDoDia />
      <TreinoRapido />
    </div>
  );
}