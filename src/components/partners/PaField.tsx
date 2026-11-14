import type { ReactNode } from "react";
import { DpIcon, type DpIconName } from "@/components/partners/DpIcon";

export function PaBox({
  icon,
  select,
  suffix,
  children,
  className,
}: {
  icon?: DpIconName;
  select?: boolean;
  suffix?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <span className={`pa-box${icon ? " pa-box--icon" : ""}${select ? " pa-box--select" : ""}${className ? ` ${className}` : ""}`}>
      {icon ? <DpIcon name={icon} /> : null}
      {children}
      {suffix ? <span className="pa-box__suffix">{suffix}</span> : null}
      {select ? <DpIcon name="chevron" className="pa-box__caret" /> : null}
    </span>
  );
}

export function PaField({
  id,
  label,
  required,
  optional,
  icon,
  select,
  suffix,
  children,
  className,
}: {
  id?: string;
  label?: ReactNode;
  required?: boolean;
  optional?: boolean;
  icon?: DpIconName;
  select?: boolean;
  suffix?: ReactNode;
  children: ReactNode;
  className?: string;
}) {
  return (
    <div className={className ?? "pa-field"}>
      {label ? (
        <label htmlFor={id}>
          {label}
          {required ? " *" : null}
          {optional ? <span className="pa-opt"> (facultatif)</span> : null}
        </label>
      ) : null}
      <PaBox icon={icon} select={select} suffix={suffix}>{children}</PaBox>
    </div>
  );
}

export function PaSect({ icon, children, plain }: { icon?: DpIconName; children: ReactNode; plain?: boolean }) {
  return (
    <h2 className={`pa-sect${plain ? " pa-sect--plain" : ""}`}>
      {icon ? <DpIcon name={icon} /> : null}
      {children}
      {plain ? null : <span className="pa-sect__rule" aria-hidden />}
    </h2>
  );
}

export function PaConfirm({
  title,
  text,
  confirm,
  busy,
  onCancel,
  onConfirm,
}: {
  title: string;
  text: string;
  confirm: string;
  busy?: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  return (
    <div className="pa-confirm" role="dialog" aria-labelledby="pa-confirm-title" aria-describedby="pa-confirm-text">
      <p id="pa-confirm-title"><strong>{title}</strong></p>
      <p id="pa-confirm-text">{text}</p>
      <div className="pa-confirm__actions">
        <button type="button" className="pa-btn" onClick={onCancel} disabled={busy}>Annuler</button>
        <button type="button" className="pa-btn pa-btn--yellow" onClick={onConfirm} disabled={busy}>{confirm}</button>
      </div>
    </div>
  );
}
