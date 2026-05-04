import { useState } from "react";

const MONTHLY_GOALS = {
  conductedInterviews: 80,
  scheduledInterviews: 320,
  outreachCalls: 480,
};

const DAILY_TARGETS = {
  conductedInterviews: 11,
  scheduledInterviews: 46,
  outreachCalls: 69,
};

const MONTHLY_OTHER = [
  { id: "partner", label: "💼 Find 1 Business Partner", target: 1, unit: "partner" },
  { id: "cashflow", label: "💵 Personal Cash Flow", target: 10000, unit: "dollars" },
  { id: "recruiting", label: "📋 Double Digit Downline Recruiting", target: 10, unit: "recruits" },
];

function getDaysInMay() {
  const days = [];
  for (let d = 1; d <= 31; d++) {
    const date = new Date(2026, 4, d);
    const dow = date.getDay();
    const isWeekend = dow === 0 || dow === 6;
    days.push({ day: d, date, isWeekend, dow });
  }
  return days;
}

const DAYS = getDaysInMay();
const DOW_LABELS = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

export default function MayTracker() {
  const today = new Date(2026, 4, 1);
  const [selectedDay, setSelectedDay] = useState(1);
  const [dailyData, setDailyData] = useState(() => {
    const obj = {};
    DAYS.forEach(({ day }) => {
      obj[day] = { conducted: 0, scheduled: 0, outreach: 0 };
    });
    return obj;
  });
  const [otherProgress, setOtherProgress] = useState({
    partner: 0,
    cashflow: 0,
    recruiting: 0,
  });

  const updateDay = (day, field, value) => {
    const num = Math.max(0, parseInt(value) || 0);
    setDailyData((prev) => ({
      ...prev,
      [day]: { ...prev[day], [field]: num },
    }));
  };

  const totals = DAYS.reduce(
    (acc, { day }) => {
      acc.conducted += dailyData[day].conducted;
      acc.scheduled += dailyData[day].scheduled;
      acc.outreach += dailyData[day].outreach;
      return acc;
    },
    { conducted: 0, scheduled: 0, outreach: 0 }
  );

  const pct = (val, target) => Math.min(100, Math.round((val / target) * 100));

  const sel = dailyData[selectedDay];
  const selDay = DAYS[selectedDay - 1];

  return (
    <div style={{
      fontFamily: "'Bebas Neue', 'Impact', sans-serif",
      background: "#0a0a0f",
      minHeight: "100vh",
      color: "#e8e8e8",
      padding: "0",
    }}>
      {/* Header */}
      <div style={{
        background: "linear-gradient(135deg, #1a1a2e 0%, #16213e 50%, #0f3460 100%)",
        padding: "32px 24px 24px",
        borderBottom: "3px solid #e94560",
        position: "relative",
        overflow: "hidden",
      }}>
        <div style={{
          position: "absolute", top: 0, right: 0, width: "300px", height: "100%",
          background: "radial-gradient(circle at 80% 50%, rgba(233,69,96,0.15) 0%, transparent 70%)",
          pointerEvents: "none",
        }} />
        <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#e94560", marginBottom: "6px" }}>
          💼 BUSINESS OPERATIONS
        </div>
        <h1 style={{ fontSize: "48px", margin: 0, letterSpacing: "3px", lineHeight: 1, color: "#fff" }}>
          MAY 2026
        </h1>
        <div style={{ fontSize: "14px", letterSpacing: "3px", color: "#aaa", marginTop: "6px", fontFamily: "monospace", fontWeight: "bold" }}>
          GOAL TRACKER & DAILY SCORECARD
        </div>
      </div>

      <div style={{ padding: "24px", maxWidth: "900px", margin: "0 auto" }}>

        {/* Monthly Progress */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#e94560", marginBottom: "14px" }}>
            📊 MONTHLY PROGRESS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {[
              { label: "CONDUCTED INTERVIEWS", val: totals.conducted, target: MONTHLY_GOALS.conductedInterviews, color: "#e94560" },
              { label: "SCHEDULED INTERVIEWS", val: totals.scheduled, target: MONTHLY_GOALS.scheduledInterviews, color: "#f5a623" },
              { label: "OUTREACH CALLS", val: totals.outreach, target: MONTHLY_GOALS.outreachCalls, color: "#50fa7b" },
            ].map((g) => (
              <div key={g.label} style={{
                background: "#111118",
                border: `1px solid ${g.color}33`,
                borderRadius: "8px",
                padding: "16px",
              }}>
                <div style={{ fontSize: "9px", letterSpacing: "3px", color: g.color, marginBottom: "8px" }}>{g.label}</div>
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", marginBottom: "8px" }}>
                  <span style={{ fontSize: "32px", color: "#fff" }}>{g.val}</span>
                  <span style={{ fontSize: "13px", color: "#555", fontFamily: "monospace" }}>/ {g.target}</span>
                </div>
                <div style={{ background: "#222", borderRadius: "4px", height: "6px", overflow: "hidden" }}>
                  <div style={{
                    width: `${pct(g.val, g.target)}%`,
                    height: "100%",
                    background: g.color,
                    borderRadius: "4px",
                    transition: "width 0.4s ease",
                  }} />
                </div>
                <div style={{ fontSize: "10px", color: "#555", marginTop: "5px", fontFamily: "monospace" }}>
                  {pct(g.val, g.target)}% COMPLETE
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Other Monthly Goals */}
        <div style={{ marginBottom: "28px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#e94560", marginBottom: "14px" }}>
            🎯 OTHER MONTHLY GOALS
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "12px" }}>
            {MONTHLY_OTHER.map((g) => (
              <div key={g.id} style={{
                background: "#111118",
                border: "1px solid #333",
                borderRadius: "8px",
                padding: "16px",
              }}>
                <div style={{ fontSize: "10px", color: "#aaa", marginBottom: "10px", letterSpacing: "1px" }}>{g.label}</div>
                <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
                  <input
                    type="number"
                    min="0"
                    value={otherProgress[g.id]}
                    onChange={(e) => setOtherProgress(p => ({ ...p, [g.id]: Math.max(0, parseInt(e.target.value) || 0) }))}
                    style={{
                      width: "80px",
                      background: "#1a1a2e",
                      border: "1px solid #e9456055",
                      borderRadius: "4px",
                      color: "#fff",
                      padding: "6px 8px",
                      fontSize: "18px",
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      letterSpacing: "1px",
                    }}
                  />
                  <span style={{ color: "#555", fontSize: "13px", fontFamily: "monospace" }}>/ {g.target} {g.unit}</span>
                </div>
                <div style={{ background: "#222", borderRadius: "4px", height: "5px", overflow: "hidden", marginTop: "10px" }}>
                  <div style={{
                    width: `${pct(otherProgress[g.id], g.target)}%`,
                    height: "100%",
                    background: "#8be9fd",
                    borderRadius: "4px",
                    transition: "width 0.4s ease",
                  }} />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Daily Targets Reference */}
        <div style={{
          background: "#111118",
          border: "1px solid #e9456033",
          borderRadius: "8px",
          padding: "16px",
          marginBottom: "28px",
          display: "flex",
          gap: "32px",
          alignItems: "center",
          flexWrap: "wrap",
        }}>
          <div style={{ fontSize: "9px", letterSpacing: "3px", color: "#e94560" }}>📌 DAILY TARGETS</div>
          {[
            { label: "Conducted", val: DAILY_TARGETS.conductedInterviews },
            { label: "Scheduled", val: DAILY_TARGETS.scheduledInterviews },
            { label: "Outreach Calls", val: DAILY_TARGETS.outreachCalls },
          ].map(t => (
            <div key={t.label} style={{ fontFamily: "monospace" }}>
              <span style={{ color: "#555", fontSize: "11px" }}>{t.label}: </span>
              <span style={{ color: "#fff", fontSize: "20px" }}>{t.val}</span>
            </div>
          ))}
          <div style={{ fontSize: "10px", color: "#555", fontFamily: "monospace", marginLeft: "auto" }}>
            Weekdays: 11AM–2PM PT &nbsp;|&nbsp; Weekends: All Day
          </div>
        </div>

        {/* Calendar Day Selector */}
        <div style={{ marginBottom: "20px" }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#e94560", marginBottom: "14px" }}>
            📅 SELECT DAY TO LOG
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: "5px" }}>
            {DOW_LABELS.map(d => (
              <div key={d} style={{ textAlign: "center", fontSize: "9px", letterSpacing: "2px", color: "#444", padding: "4px 0" }}>{d}</div>
            ))}
            {/* offset for May 1 = Friday (index 5) */}
            {Array(5).fill(null).map((_, i) => <div key={`empty-${i}`} />)}
            {DAYS.map(({ day, isWeekend }) => {
              const d = dailyData[day];
              const hasData = d.conducted > 0 || d.scheduled > 0 || d.outreach > 0;
              const isToday = day === 1;
              const isSel = day === selectedDay;
              return (
                <button
                  key={day}
                  onClick={() => setSelectedDay(day)}
                  style={{
                    background: isSel ? "#e94560" : hasData ? "#1a2e1a" : isWeekend ? "#1a1a2e" : "#111118",
                    border: isSel ? "2px solid #e94560" : isToday ? "1px solid #e9456077" : "1px solid #222",
                    borderRadius: "6px",
                    color: isSel ? "#fff" : hasData ? "#50fa7b" : isWeekend ? "#8be9fd" : "#888",
                    padding: "8px 4px",
                    cursor: "pointer",
                    fontSize: "13px",
                    letterSpacing: "1px",
                    fontFamily: "'Bebas Neue', Impact, sans-serif",
                    transition: "all 0.15s",
                  }}
                >
                  {day}
                  {hasData && !isSel && <div style={{ width: "4px", height: "4px", borderRadius: "50%", background: "#50fa7b", margin: "2px auto 0" }} />}
                </button>
              );
            })}
          </div>
        </div>

        {/* Daily Log */}
        <div style={{
          background: "#111118",
          border: "1px solid #e9456055",
          borderRadius: "10px",
          padding: "20px",
        }}>
          <div style={{ fontSize: "11px", letterSpacing: "4px", color: "#e94560", marginBottom: "16px" }}>
            ✍️ LOG — MAY {selectedDay}, 2026 ({DOW_LABELS[selDay.dow]}{selDay.isWeekend ? " — ALL DAY" : " — 11AM TO 2PM PT"})
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr 1fr", gap: "16px" }}>
            {[
              { field: "conducted", label: "CONDUCTED INTERVIEWS", target: DAILY_TARGETS.conductedInterviews, color: "#e94560" },
              { field: "scheduled", label: "SCHEDULED INTERVIEWS", target: DAILY_TARGETS.scheduledInterviews, color: "#f5a623" },
              { field: "outreach", label: "OUTREACH CALLS", target: DAILY_TARGETS.outreachCalls, color: "#50fa7b" },
            ].map(({ field, label, target, color }) => {
              const val = sel[field];
              const hit = val >= target;
              return (
                <div key={field}>
                  <div style={{ fontSize: "9px", letterSpacing: "2px", color: color, marginBottom: "8px" }}>{label}</div>
                  <input
                    type="number"
                    min="0"
                    value={val}
                    onChange={(e) => updateDay(selectedDay, field, e.target.value)}
                    style={{
                      width: "100%",
                      background: "#0a0a0f",
                      border: `2px solid ${hit ? color : "#333"}`,
                      borderRadius: "6px",
                      color: hit ? color : "#fff",
                      padding: "12px",
                      fontSize: "32px",
                      fontFamily: "'Bebas Neue', Impact, sans-serif",
                      letterSpacing: "2px",
                      boxSizing: "border-box",
                      textAlign: "center",
                      outline: "none",
                    }}
                  />
                  <div style={{ fontSize: "10px", color: hit ? color : "#444", marginTop: "5px", fontFamily: "monospace", textAlign: "center" }}>
                    {hit ? "✅ TARGET HIT" : `target: ${target}`}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}
