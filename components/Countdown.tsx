"use client";

import { useEffect, useState } from "react";

const WEDDING_DATE = new Date("2026-09-12T17:00:00-06:00");

type TimeLeft = {
  months: number;
  days: number;
  hours: number;
};

function addMonths(date: Date, months: number) {
  const copy = new Date(date);
  copy.setMonth(copy.getMonth() + months);
  return copy;
}

function getTimeLeft(now = new Date()): TimeLeft {
  if (now >= WEDDING_DATE) {
    return { months: 0, days: 0, hours: 0 };
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

  return { months, days, hours };
}

export function Countdown() {
  const [timeLeft, setTimeLeft] = useState<TimeLeft>(() => getTimeLeft());

  useEffect(() => {
    const update = () => setTimeLeft(getTimeLeft());
    update();

    const interval = window.setInterval(update, 1000 * 60);
    return () => window.clearInterval(interval);
  }, []);

  const units = [
    { label: "meses", value: timeLeft.months },
    { label: "días", value: timeLeft.days },
    { label: "horas", value: timeLeft.hours }
  ];

  return (
    <div className="mt-8 w-full max-w-xl rounded-[2rem] border border-white/25 bg-charcoal/30 p-4 text-ivory shadow-soft backdrop-blur-md sm:p-5">
      <p className="text-xs font-semibold uppercase tracking-[0.26em] text-ivory/75">
        Faltan para la boda
      </p>
      <div className="mt-4 grid grid-cols-3 gap-3">
        {units.map((unit) => (
          <div key={unit.label} className="rounded-3xl bg-ivory/92 px-3 py-4 text-center text-charcoal">
            <span className="block font-serif text-4xl leading-none sm:text-5xl">
              {unit.value}
            </span>
            <span className="mt-2 block text-[0.68rem] font-semibold uppercase tracking-[0.18em] text-sage">
              {unit.label}
            </span>
          </div>
        ))}
      </div>
      <p className="mt-4 text-sm text-ivory/78">12 de septiembre de 2026 · 5:00 PM</p>
    </div>
  );
}
