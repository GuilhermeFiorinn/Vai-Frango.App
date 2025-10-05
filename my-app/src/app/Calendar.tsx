"use client";
import { useEffect, useMemo, useState } from "react";

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
  const [events, setEvents] = useState<Record<string, string[]>>({});

  // load from localStorage
  useEffect(() => {
    try {
      const raw = localStorage.getItem("vf-calendar-events");
      if (raw) setEvents(JSON.parse(raw));
    } catch {}
  }, []);

  useEffect(() => {
    try {
      localStorage.setItem("vf-calendar-events", JSON.stringify(events));
    } catch {}
  }, [events]);

  const monthInfo = useMemo(() => {
    const first = startOfMonth(cursor);
    const totalDays = daysInMonth(first);
    const startWeekday = first.getDay(); // 0 (Sun) - 6
    return { first, totalDays, startWeekday };
  }, [cursor]);

  const weeks: (Date | null)[] = [];
  // fill leading blanks
  for (let i = 0; i < monthInfo.startWeekday; i++) weeks.push(null);
  for (let d = 1; d <= monthInfo.totalDays; d++) {
    weeks.push(new Date(cursor.getFullYear(), cursor.getMonth(), d));
  }
  // pad to full weeks (optional)
  while (weeks.length % 7 !== 0) weeks.push(null);

  function prevMonth() {
    setCursor((c) => addMonths(c, -1));
  }
  function nextMonth() {
    setCursor((c) => addMonths(c, 1));
  }

  function addEventFor(date: Date) {
    const key = formatKey(date);
    const text = prompt(`Novo evento para ${key}:`);
    if (!text) return;
    setEvents((prev) => ({ ...prev, [key]: [...(prev[key] || []), text] }));
  }

  function removeEvent(dateKey: string, index: number) {
    setEvents((prev) => {
      const arr = [...(prev[dateKey] || [])];
      arr.splice(index, 1);
      return { ...prev, [dateKey]: arr };
    });
  }

  return (
    <div className="w-full">
      <div className="mb-4 relative">
        {/* title centered */}
        <div className="text-center text-lg font-semibold">
          {cursor.toLocaleString(undefined, { month: "long", year: "numeric" })}
        </div>

        {/* prev/next as corner arrows vertically centered */}
        <button
          onClick={prevMonth}
          className="absolute left-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Mês anterior"
        >
          ‹
        </button>

        <button
          onClick={nextMonth}
          className="absolute right-2 top-1/2 -translate-y-1/2 p-2 rounded-full bg-gray-100 hover:bg-gray-200"
          aria-label="Próximo mês"
        >
          ›
        </button>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center text-sm mb-2">
        {["Dom", "Seg", "Ter", "Qua", "Qui", "Sex", "Sáb"].map((d) => (
          <div key={d} className="font-medium text-gray-600">
            {d}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {weeks.map((dt, i) => {
          if (!dt) return <div key={i} className="h-20"></div>;
          const key = formatKey(dt);
          const hasEvents = (events[key] || []).length > 0;
          const isSelected = selected && formatKey(selected) === key;
          return (
            <div
                key={key}
                className={
                  "relative h-20 p-1 border rounded flex flex-col justify-start " +
                  (isSelected
                    ? "bg-orange-100 border-orange-300"
                    : "bg-white dark:bg-gray-800")
                }
              >
                <div className="flex items-center justify-start">
                  <button
                    onClick={() => setSelected(dt)}
                    className="text-base font-semibold"
                    aria-label={`Selecionar dia ${key}`}
                  >
                    {dt.getDate()}
                  </button>
                </div>

                <div className="mt-1 flex-1 overflow-auto text-xs">
                {(events[key] || []).slice(0, 3).map((ev, idx) => (
                  <div key={idx} className="flex items-center justify-between gap-2">
                    <span className="truncate">{ev}</span>
                    <button
                      onClick={() => removeEvent(key, idx)}
                      className="text-red-500 text-xs px-1"
                      title="Remover"
                    >
                      ✕
                    </button>
                  </div>
                ))}
                {hasEvents && (events[key] || []).length > 3 && (
                  <div className="text-xs text-gray-500">+{(events[key] || []).length - 3} mais</div>
                )}
                </div>

                {/* botão adicionar posicionado no canto inferior direito */}
                <button
                  onClick={() => addEventFor(dt)}
                  title="Adicionar evento"
                  className="absolute bottom-2 right-2 text-sm px-2 py-0.5 rounded bg-orange-400 text-white hover:bg-orange-500 shadow-sm"
                  aria-label={`Adicionar evento para ${key}`}
                >
                  +
                </button>
              </div>
          );
        })}
      </div>

      {selected && (
        <div className="mt-4 p-3 border rounded bg-white dark:bg-gray-900">
          <div className="flex items-center justify-between mb-2">
            <div className="font-semibold">{selected.toDateString()}</div>
            <div className="flex gap-2">
              <button
                onClick={() => addEventFor(selected)}
                className="px-2 py-1 bg-orange-400 text-white rounded hover:bg-orange-500"
              >
                Adicionar
              </button>
              <button onClick={() => setSelected(null)} className="px-2 py-1 rounded border">
                Fechar
              </button>
            </div>
          </div>
          <div>
            {(events[formatKey(selected)] || []).length === 0 && (
              <div className="text-sm text-gray-500">Nenhum evento</div>
            )}
            <ul className="mt-2 space-y-1">
              {(events[formatKey(selected)] || []).map((ev, i) => (
                <li key={i} className="flex items-center justify-between">
                  <span>{ev}</span>
                  <button
                    onClick={() => removeEvent(formatKey(selected), i)}
                    className="text-red-500 text-sm"
                  >
                    Remover
                  </button>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </div>
  );
}
