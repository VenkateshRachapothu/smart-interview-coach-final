import { useState, useEffect, useCallback } from "react";

let toastQueue = [];
let listeners = [];

export function showToast(message, type = "info", duration = 3500) {
  const id = Date.now() + Math.random();
  const toast = { id, message, type };
  toastQueue = [...toastQueue, toast];
  listeners.forEach((fn) => fn([...toastQueue]));
  setTimeout(() => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    listeners.forEach((fn) => fn([...toastQueue]));
  }, duration);
}

const ICONS = { success: "✅", error: "❌", warning: "⚠️", info: "💡", achievement: "🏆" };
const COLORS = {
  success: { bg: "var(--success-light)", border: "var(--success)", color: "var(--success)" },
  error: { bg: "var(--danger-light)", border: "var(--danger)", color: "var(--danger)" },
  warning: { bg: "var(--warning-light)", border: "var(--warning)", color: "var(--warning)" },
  info: { bg: "var(--primary-light)", border: "var(--primary)", color: "var(--primary)" },
  achievement: { bg: "#fef9c3", border: "#eab308", color: "#854d0e" },
};

function ToastItem({ toast, onRemove }) {
  const cfg = COLORS[toast.type] || COLORS.info;
  return (
    <div
      className="animate-slide"
      style={{
        display: "flex", alignItems: "center", gap: 12,
        padding: "12px 16px", borderRadius: "var(--radius-md)",
        background: cfg.bg, border: `1px solid ${cfg.border}33`,
        boxShadow: "var(--shadow-lg)", minWidth: 280, maxWidth: 380,
        borderLeft: `3px solid ${cfg.border}`,
      }}
    >
      <span style={{ fontSize: 18, flexShrink: 0 }}>{ICONS[toast.type] || "💡"}</span>
      <span style={{ fontSize: 14, fontWeight: 500, color: "var(--text)", flex: 1, lineHeight: 1.4 }}>
        {toast.message}
      </span>
      <button
        onClick={() => onRemove(toast.id)}
        style={{
          background: "none", border: "none", cursor: "pointer",
          fontSize: 16, color: "var(--text-muted)", padding: "0 4px",
          flexShrink: 0, lineHeight: 1,
        }}
      >
        ×
      </button>
    </div>
  );
}

export function ToastContainer() {
  const [toasts, setToasts] = useState([]);

  useEffect(() => {
    const fn = (list) => setToasts([...list]);
    listeners.push(fn);
    return () => { listeners = listeners.filter((l) => l !== fn); };
  }, []);

  const remove = useCallback((id) => {
    toastQueue = toastQueue.filter((t) => t.id !== id);
    setToasts([...toastQueue]);
  }, []);

  if (!toasts.length) return null;

  return (
    <div style={{
      position: "fixed", bottom: 24, right: 24, zIndex: 9999,
      display: "flex", flexDirection: "column", gap: 10,
    }}>
      {toasts.map((t) => <ToastItem key={t.id} toast={t} onRemove={remove} />)}
    </div>
  );
}
