"use client";
import { useEffect, useMemo, useState } from "react";
import { Exercise, addExercise, removeExercise } from "../lib/exercises";

// Funções utilitárias (sem alterações)
function startOfMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth(), 1);
}
function addMonths(date: Date, n: number) {
  return new Date(date.getFullYear(), date.getMonth() + n, 1);
}
function daysInMonth(date: Date) {
  return new Date(date.getFullYear(), date.getMonth() + 1, 0).getDate();
}
function formatKey(d: Date) {
  return d.toISOString().slice(0, 10); // YYYY-MM-DD
}

export default function Calendar() {
  const [cursor, setCursor] = useState(() => startOfMonth(new Date()));
  const [selected, setSelected] = useState<Date | null>(null);
  const [events, setEvents] = useState<Record<string, Exercise[]>>({});
  const [newExerciseName, setNewExerciseName] = useState("");
  const [presets, setPresets] = useState<Array<{ id: number; nome: string; duracaoMinutos?: number }>>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    fetch("/api/exercises").then(r => r.json()).then(list => { if (Array.isArray(list)) setPresets(list); }).catch(() => {});
    fetch("/api/calendar").then(r => r.json()).then(data => { if (data && typeof data === "object") setEvents(data); }).catch(() => {});
  }, []);

  const monthInfo = useMemo(() => {
    const first = startOfMonth(cursor);
    const totalDays = daysInMonth(first);
    const startWeekday = first.getDay();
    return { first, totalDays, startWeekday };
  }, [cursor]);

  const weeks: (Date | null)[] = [];
  for (let i = 0; i < monthInfo.startWeekday; i++) weeks.push(null);
  for (let d = 1; d <= monthInfo.totalDays; d++) {
    weeks.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  }
  while (weeks.length % 7 !== 0) weeks.push(null);

  function prevMonth() { setCursor(c => addMonths(c, -1)); }
  function nextMonth() { setCursor(c => addMonths(c, 1)); }

  function handleDayClick(date: Date) {
    if (selected && formatKey(selected) === formatKey(date)) {
      setSelected(null);
    } else {
      setSelected(date);
    }
  }

  function openAddModalFor(date: Date) {
    setSelected(date);
    setIsModalOpen(true);
    setNewExerciseName("");
  }

  // ======================================================================
  // ======================= INÍCIO DA CORREÇÃO ===========================
  // ======================================================================
  
  function closeModal() {
    setIsModalOpen(false);
    setSelected(null); // <-- ADICIONE ESTA LINHA
  }

  // ======================================================================
  // ======================== FIM DA CORREÇÃO =============================
  // ======================================================================

  function addExerciseFor(date: Date, presetId: number) {
    const preset = presets.find(p => p.id === presetId);
    if (!preset) return;
    const key = formatKey(date);
    const duration = preset.duracaoMinutos ? `${preset.duracaoMinutos} min` : "";
    setEvents(prev => {
      const next = addExercise(prev, key, { name: preset.nome, duration });
      fetch("/api/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dateKey: key, exercises: next[key] }) }).catch(() => {});
      return next;
    });
    setNewExerciseName("");
  }

  function removeEvent(dateKey: string, index: number) {
    setEvents(prev => {
      const next = removeExercise(prev, dateKey, index);
      fetch("/api/calendar", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ dateKey, exercises: next[dateKey] || [] }) }).catch(() => {});
      return next;
    });
  }
    
  const scheduledDays = Object.keys(events)
    .filter(key => events[key] && events[key].length > 0)
    .sort();

  return (
    <div className="w-full">
      <div className="mb-4 relative">
          <div className="text-center text-lg font-semibold">{cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}</div>
          <button onClick={prevMonth} className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200" aria-label="Mês anterior">‹</button>
          <button onClick={nextMonth} className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200" aria-label="Próximo mês">›</button>
      </div>
      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map(d => <div key={d} className="font-medium text-gray-600">{d}</div>)}
      </div>
      <div className="grid grid-cols-7 gap-1">
        {weeks.map((dt, i) => {
          if (!dt) return <div key={i} className="h-20"></div>;
          const key = formatKey(dt);
          const hasEvents = (events[key] || []).length > 0;
          const isSelected = selected && formatKey(selected) === key;
          const baseClass = "relative h-20 p-1 border rounded flex flex-col justify-start ";
          const stateClass = isSelected ? "bg-orange-100 border-orange-300" : hasEvents ? "bg-white dark:bg-gray-800 border-2 border-orange-500" : "bg-white dark:bg-gray-800";
          return (
            <div key={key} className={baseClass + stateClass}>
              <button onClick={() => handleDayClick(dt)} className="w-full text-left text-base font-semibold" aria-label={`Selecionar dia ${key}`}>{dt.getDate()}</button>
              <div className="flex-1" />
              <button onClick={() => openAddModalFor(dt)} title="Adicionar exercício" className="absolute bottom-2 right-2 text-sm px-2 py-0.5 rounded bg-orange-400 text-white hover:bg-orange-500 shadow-sm" aria-label={`Adicionar exercício para ${key}`}>+</button>
            </div>
          );
        })}
      </div>

      <div className="mt-8 p-4 border-t-2 border-gray-200 dark:border-gray-700">
        <h2 className="text-lg font-bold mb-4 text-gray-800 dark:text-gray-200">Agenda de Treinos</h2>
        {scheduledDays.length === 0 && (
          <p className="text-gray-500 dark:text-gray-400">Nenhum exercício agendado no momento. Use o calendário acima para começar.</p>
        )}
        {scheduledDays.length > 0 && (
          <div className="space-y-4">
            {scheduledDays.map(dateKey => {
              const date = new Date(dateKey + 'T12:00:00Z');
              const exercisesForDay = events[dateKey];
              return (
                <div key={dateKey} className="p-3 bg-gray-50 dark:bg-gray-800 rounded-lg">
                  <h3 className="font-semibold text-orange-600 dark:text-orange-400">{date.toLocaleDateString("pt-BR", { weekday: 'long', day: '2-digit', month: 'long' })}</h3>
                  <ul className="mt-2 space-y-1">
                    {exercisesForDay.map((exercise, index) => (
                      <li key={index} className="flex items-center justify-between text-sm text-gray-700 dark:text-gray-300">
                        <span>{exercise.name} {exercise.duration ? `— ${exercise.duration}` : ""}</span>
                        <button onClick={() => removeEvent(dateKey, index)} className="text-red-500 hover:text-red-700 text-xs font-semibold">REMOVER</button>
                      </li>
                    ))}
                  </ul>
                </div>
              );
            })}
          </div>
        )}
      </div>

      {isModalOpen && selected && (
        <div className="fixed inset-0 z-50 flex items-center justify-center">
            <div className="absolute inset-0 bg-black/40" onClick={closeModal} aria-hidden />
            <div className="relative z-10 w-full max-w-lg mx-4 bg-white dark:bg-gray-900 rounded shadow-lg p-4" onClick={(e) => e.stopPropagation()} role="dialog" aria-modal="true" aria-label={`Adicionar exercícios para ${selected.toDateString()}`}>
                <div className="flex items-center justify-between mb-2">
                    <div className="font-semibold">{selected.toDateString()}</div>
                    <button onClick={closeModal} className="px-2 py-1 rounded border">Fechar</button>
                </div>
                <div className="space-y-3">
                    <div className="text-sm font-medium">Adicionar exercício</div>
                    <div className="flex gap-2">
                        <select value={newExerciseName} onChange={(e) => setNewExerciseName(e.target.value)} className="flex-1 px-2 py-1 border rounded bg-white">
                            <option value="">-- selecione um exercício --</option>
                            {presets.map(p => <option key={p.id} value={String(p.id)}>{p.nome} {p.duracaoMinutos ? `(${p.duracaoMinutos} min)` : ""}</option>)}
                        </select>
                        <button onClick={() => { if (!selected) return; addExerciseFor(selected, Number(newExerciseName)); }} className="px-3 py-1 bg-orange-400 text-white rounded hover:bg-orange-500">Adicionar</button>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
}