import React from "react";
import { differenceInSeconds } from "date-fns";

interface CountdownCircleProps {
  target: Date;
  start?: Date; // for progress percentage; defaults to now at mount
  size?: number;
}

export const CountdownCircle: React.FC<CountdownCircleProps> = ({ target, start, size = 220 }) => {
  const [now, setNow] = React.useState<Date>(new Date());
  const startRef = React.useRef<Date>(start ?? new Date());

  React.useEffect(() => {
    const id = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  const total = Math.max(1, differenceInSeconds(target, startRef.current));
  const remaining = Math.max(0, differenceInSeconds(target, now));
  const percent = Math.min(100, Math.max(0, ((total - remaining) / total) * 100));

  const radius = (size - 16) / 2; // padding for stroke
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (percent / 100) * circumference;

  const days = Math.floor(remaining / (60 * 60 * 24));
  const hours = Math.floor((remaining % (60 * 60 * 24)) / (60 * 60));
  const minutes = Math.floor((remaining % (60 * 60)) / 60);
  const seconds = remaining % 60;

  return (
    <div className="relative inline-block">
      <svg width={size} height={size} className="block">
        <defs>
          <linearGradient id="progress" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor={`hsl(var(--primary))`} />
            <stop offset="100%" stopColor={`hsl(var(--ring))`} />
          </linearGradient>
        </defs>
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="hsl(var(--border))"
          strokeWidth={10}
          fill="none"
        />
        <circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="url(#progress)"
          strokeWidth={12}
          strokeLinecap="round"
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          style={{ transition: "stroke-dashoffset 0.5s ease-out" }}
        />
      </svg>
      <div className="absolute inset-0 flex flex-col items-center justify-center">
        <div className="text-4xl font-semibold tracking-tight">
          {days > 0 ? `${days}d` : ""} {hours.toString().padStart(2, "0")}:{minutes
            .toString()
            .padStart(2, "0")}:{seconds.toString().padStart(2, "0")}
        </div>
        <div className="text-sm text-muted-foreground">remaining</div>
      </div>
    </div>
  );
};
