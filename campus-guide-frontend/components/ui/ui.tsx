import React from "react";

// Button
type ButtonVariant = "primary" | "secondary" | "outline" | "ghost" | "danger";
type ButtonSize = "sm" | "md" | "lg";

export function Button({
  children,
  variant = "primary",
  size = "md",
  className = "",
  disabled,
  onClick,
  type = "button",
}: {
  children: React.ReactNode;
  variant?: ButtonVariant;
  size?: ButtonSize;
  className?: string;
  disabled?: boolean;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
}) {
  const base = "inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 focus:outline-none focus:ring-2 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed gap-2";
  const sizes: Record<ButtonSize, string> = {
    sm: "px-3 py-1.5 text-sm",
    md: "px-5 py-2.5 text-sm",
    lg: "px-7 py-3.5 text-base",
  };
  const variants: Record<ButtonVariant, string> = {
    primary: "bg-[#F97316] text-white hover:bg-[#EA580C] focus:ring-[#F97316]",
    secondary: "bg-[#FFF7ED] text-[#EA580C] hover:bg-orange-100 focus:ring-[#F97316]",
    outline: "border border-[#E5E7EB] bg-white text-[#1F2937] hover:bg-[#FAFAF9] focus:ring-[#F97316]",
    ghost: "text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1F2937] focus:ring-[#F97316]",
    danger: "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500",
  };
  return (
    <button
      type={type}
      disabled={disabled}
      onClick={onClick}
      className={`${base} ${sizes[size]} ${variants[variant]} ${className}`}
    >
      {children}
    </button>
  );
}

// Badge
export function Badge({
  children,
  variant = "default",
  className = "",
}: {
  children: React.ReactNode;
  variant?: "default" | "success" | "warning" | "error" | "info" | "orange";
  className?: string;
}) {
  const variants = {
    default: "bg-gray-100 text-gray-700",
    success: "bg-green-50 text-green-700",
    warning: "bg-yellow-50 text-yellow-700",
    error: "bg-red-50 text-red-700",
    info: "bg-blue-50 text-blue-700",
    orange: "bg-orange-50 text-orange-700",
  };
  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${variants[variant]} ${className}`}>
      {children}
    </span>
  );
}

// Card
export function Card({
  children,
  className = "",
  onClick,
}: {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}) {
  return (
    <div
      onClick={onClick}
      className={`bg-white rounded-2xl border border-[#E5E7EB] shadow-sm ${onClick ? "cursor-pointer hover:shadow-md transition-shadow" : ""} ${className}`}
    >
      {children}
    </div>
  );
}

// Stat Card
export function StatCard({
  label,
  value,
  icon,
  trend,
  color = "orange",
}: {
  label: string;
  value: string | number;
  icon: React.ReactNode;
  trend?: string;
  color?: "orange" | "blue" | "green" | "purple";
}) {
  const colors = {
    orange: "bg-orange-50 text-orange-600",
    blue: "bg-blue-50 text-blue-600",
    green: "bg-green-50 text-green-600",
    purple: "bg-purple-50 text-purple-600",
  };
  return (
    <Card className="p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-[#6B7280] font-medium">{label}</p>
          <p className="text-2xl font-bold text-[#1F2937] mt-1 font-display">{value}</p>
          {trend && <p className="text-xs text-green-600 mt-1 font-medium">{trend}</p>}
        </div>
        <div className={`p-3 rounded-xl ${colors[color]}`}>{icon}</div>
      </div>
    </Card>
  );
}

// Input
export function Input({
  label,
  placeholder,
  type = "text",
  value,
  defaultValue,
  onChange,
  className = "",
  required,
  disabled,
  icon,
}: {
  label?: string;
  placeholder?: string;
  type?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  className?: string;
  required?: boolean;
  disabled?: boolean;
  icon?: React.ReactNode;
}) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-[#374151] mb-1.5">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>}
      <div className="relative">
        {icon && <div className="absolute left-3 top-1/2 -translate-y-1/2 text-[#9CA3AF]">{icon}</div>}
        <input
          type={type}
          placeholder={placeholder}
          {...(onChange ? { value: value ?? "" } : { defaultValue })}
          onChange={onChange}
          disabled={disabled}
          required={required}
          className={`w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2937] bg-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all disabled:bg-[#F9FAFB] disabled:text-[#9CA3AF] disabled:cursor-not-allowed ${icon ? "pl-10" : ""}`}
        />
      </div>
    </div>
  );
}

// Select
export function Select({
  label,
  options,
  value,
  onChange,
  className = "",
}: {
  label?: string;
  options: { value: string; label: string }[];
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  className?: string;
}) {
  const controlled = onChange !== undefined;
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-[#374151] mb-1.5">{label}</label>}
      <select
        {...(controlled
          ? { value: value ?? "", onChange }
          : { defaultValue: value })}
        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2937] bg-white focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all"
      >
        {options.map((o) => (
          <option key={o.value} value={o.value}>{o.label}</option>
        ))}
      </select>
    </div>
  );
}

// Textarea
export function Textarea({
  label,
  placeholder,
  value,
  onChange,
  rows = 4,
  className = "",
}: {
  label?: string;
  placeholder?: string;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  rows?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      {label && <label className="block text-sm font-semibold text-[#374151] mb-1.5">{label}</label>}
      <textarea
        placeholder={placeholder}
        {...(onChange ? { value: value ?? "", onChange } : { defaultValue: value })}
        rows={rows}
        className="w-full border border-[#E5E7EB] rounded-xl px-4 py-2.5 text-sm text-[#1F2937] bg-white placeholder-[#9CA3AF] focus:outline-none focus:ring-2 focus:ring-[#F97316] focus:border-transparent transition-all resize-none"
      />
    </div>
  );
}

// Status Badge for bookings/payments
export function StatusBadge({ status }: { status: string }) {
  const map: Record<string, { label: string; class: string }> = {
    pending: { label: "Pending", class: "bg-yellow-50 text-yellow-700" },
    accepted: { label: "Accepted", class: "bg-blue-50 text-blue-700" },
    rejected: { label: "Rejected", class: "bg-red-50 text-red-700" },
    confirmed: { label: "Confirmed", class: "bg-green-50 text-green-700" },
    completed: { label: "Completed", class: "bg-gray-100 text-gray-700" },
    cancelled: { label: "Cancelled", class: "bg-red-50 text-red-600" },
    disputed: { label: "Disputed", class: "bg-orange-50 text-orange-700" },
    approved: { label: "Approved", class: "bg-green-50 text-green-700" },
    active: { label: "Active", class: "bg-green-50 text-green-700" },
    escrow: { label: "In Escrow", class: "bg-blue-50 text-blue-700" },
    released: { label: "Released", class: "bg-green-50 text-green-700" },
    paid: { label: "Paid", class: "bg-green-50 text-green-700" },
    frozen: { label: "Frozen", class: "bg-orange-50 text-orange-700" },
    upcoming: { label: "Upcoming", class: "bg-blue-50 text-blue-700" },
    published: { label: "Published", class: "bg-green-50 text-green-700" },
    draft: { label: "Draft", class: "bg-gray-100 text-gray-700" },
  };
  const s = map[status] || { label: status, class: "bg-gray-100 text-gray-700" };
  return <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold ${s.class}`}>{s.label}</span>;
}

// Star rating
export function StarRating({ rating, size = "sm" }: { rating: number; size?: "sm" | "md" }) {
  const stars = Math.round(rating);
  return (
    <div className={`flex items-center gap-0.5 ${size === "md" ? "text-base" : "text-sm"}`}>
      {[1, 2, 3, 4, 5].map((i) => (
        <span key={i} className={i <= stars ? "text-yellow-400" : "text-gray-200"}>★</span>
      ))}
      <span className={`ml-1 font-semibold text-[#1F2937] ${size === "md" ? "text-sm" : "text-xs"}`}>{rating}</span>
    </div>
  );
}

// Avatar
export function Avatar({
  src,
  name,
  size = "md",
}: {
  src?: string;
  name: string;
  size?: "sm" | "md" | "lg" | "xl";
}) {
  const sizes = { sm: "w-8 h-8 text-xs", md: "w-10 h-10 text-sm", lg: "w-14 h-14 text-base", xl: "w-20 h-20 text-xl" };
  const initials = name.split(" ").map((n) => n[0]).join("").slice(0, 2).toUpperCase();
  if (src) return <img src={src} alt={name} className={`${sizes[size]} rounded-full object-cover ring-2 ring-white`} />;
  return (
    <div className={`${sizes[size]} rounded-full bg-orange-100 text-orange-700 flex items-center justify-center font-bold ring-2 ring-white`}>
      {initials}
    </div>
  );
}

// Progress bar
export function ProgressBar({ value, max = 100, color = "orange", className = "" }: { value: number; max?: number; color?: "orange" | "blue" | "green"; className?: string }) {
  const pct = Math.round((value / max) * 100);
  const colors = { orange: "bg-[#F97316]", blue: "bg-blue-500", green: "bg-green-500" };
  return (
    <div className={`w-full bg-gray-100 rounded-full h-2 ${className}`}>
      <div className={`${colors[color]} h-2 rounded-full transition-all duration-500`} style={{ width: `${pct}%` }} />
    </div>
  );
}

// Tab component
export function Tabs({
  tabs,
  active,
  onChange,
}: {
  tabs: { id: string; label: string; count?: number }[];
  active: string;
  onChange: (id: string) => void;
}) {
  return (
    <div className="flex gap-1 p-1 bg-gray-100 rounded-xl w-fit">
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onChange(t.id)}
          className={`px-4 py-2 rounded-lg text-sm font-semibold transition-all ${active === t.id ? "bg-white text-[#1F2937] shadow-sm" : "text-[#6B7280] hover:text-[#1F2937]"}`}
        >
          {t.label}
          {t.count !== undefined && (
            <span className={`ml-1.5 px-1.5 py-0.5 rounded-full text-xs ${active === t.id ? "bg-orange-100 text-orange-700" : "bg-gray-200 text-gray-600"}`}>
              {t.count}
            </span>
          )}
        </button>
      ))}
    </div>
  );
}

// Tag / Chip
export function Tag({ children, onRemove }: { children: React.ReactNode; onRemove?: () => void }) {
  return (
    <span className="inline-flex items-center gap-1 px-3 py-1 bg-orange-50 text-orange-700 rounded-full text-xs font-semibold">
      {children}
      {onRemove && <button onClick={onRemove} className="hover:text-orange-900">×</button>}
    </span>
  );
}

// Table wrapper
export function Table({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`overflow-x-auto rounded-xl border border-[#E5E7EB] ${className}`}>
      <table className="w-full text-sm">{children}</table>
    </div>
  );
}

export function Th({ children }: { children: React.ReactNode }) {
  return <th className="px-4 py-3 text-left text-xs font-semibold text-[#6B7280] bg-[#F9FAFB] uppercase tracking-wide border-b border-[#E5E7EB] whitespace-nowrap">{children}</th>;
}

export function Td({ children, className = "" }: { children: React.ReactNode; className?: string }) {
  return <td className={`px-4 py-3.5 text-[#374151] border-b border-[#F3F4F6] ${className}`}>{children}</td>;
}

// Empty state
export function EmptyState({ icon, title, message, action }: { icon?: React.ReactNode; title: string; message: string; action?: React.ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center py-16 px-4 text-center">
      {icon && <div className="text-5xl mb-4">{icon}</div>}
      <h3 className="text-lg font-bold text-[#1F2937] font-display mb-2">{title}</h3>
      <p className="text-sm text-[#6B7280] max-w-xs">{message}</p>
      {action && <div className="mt-4">{action}</div>}
    </div>
  );
}

// Section header
export function SectionHeader({ title, subtitle, action }: { title: string; subtitle?: string; action?: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between mb-6">
      <div>
        <h2 className="text-xl font-bold text-[#1F2937] font-display">{title}</h2>
        {subtitle && <p className="text-sm text-[#6B7280] mt-0.5">{subtitle}</p>}
      </div>
      {action && <div>{action}</div>}
    </div>
  );
}
