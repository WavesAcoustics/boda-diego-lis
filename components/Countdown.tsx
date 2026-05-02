"use client";

import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2026-09-12T17:00:00-06:00");

type TimeLeft = {
  months: number;
  days: number;
  hours: number;
  minutes: number;
  seconds: number;
};

function addMonths(date: Date, months: number) {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function getTimeLeft(now = new Date()): TimeLeft {
  if (now >= WEDDING_DATE) {
    return { months: 0, days: 0, hours: 0, minutes: 0, seconds: 0 };
  }

  let months =
    (WEDDING_DATE.getFullYear() - now.getFullYear()) * 12 +
    (WEDDING_DATE.getMonth() - now.getMonth());

  let anchor = addMonths(now, months);

  if (anchor > WEDDING_DATE) {
    months -= 1;
    anchor = addMonths(now, months);
  }

  const difference = WEDDING_DATE.getTime() - anchor.getTime();
  const days = Math.floor(difference / (1000 * 60 * 60 * 24));
  const hours = Math.floor((difference / (1000 * 60 * 60)) % 24);
  const minutes = Math.floor((difference / (1000 * 60)) % 60);
  const seconds = Math.floor((difference / 1000) % 60);

  return { months, days, hours, minutes, seconds };
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft());

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    update();

    const interval = window.setInterval(update, 1000);
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    { label: "meses", value: timeLeft.months },
    { label: "días", value: timeLeft.days },
    { label: "horas", value: timeLeft.hours },
    { label: "minutos", value: timeLeft.minutes },
    { label: "segundos", value: timeLeft.seconds }
  ];

  return (
    <div className="mt-10 w-full max-w-3xl rounded-[2rem] border border-white/35 bg-charcoal/55 p-5 text-ivory shadow-soft backdrop-blur-md sm:p-6">
      <p className="text-xs font-semibold uppercase tracking-[0.3em] text-white/85 sm:text-sm">
        Faltan para la boda
      </p>
      <div className="mt-5 grid grid-cols-2 gap-3 sm:grid-cols-5">
        {units.map((unit) => (
          <div
            key={unit.label}
            className="rounded-3xl border border-white/20 bg-white/10 px-3 py-5 text-center"
          >
            <span className="block font-serif text-5xl leading-none text-white drop-shadow-sm sm:text-6xl">
              {unit.value}
            </span>
            <span className="mt-3 block text-[0.65rem] font-semibold uppercase tracking-[0.18em] text-white/80">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-5 text-sm text-white/82">12 de septiembre de 2026 · 5:00 PM</p>
    </div>
  );
}
