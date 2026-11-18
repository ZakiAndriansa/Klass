import { cn } from "@/lib/utils";

/**
 * Kontrol form bergaya "sumur kertas": input, select, textarea, checkbox,
 * radio, dan toggle mekanis.
 *
 * Semua kontrol punya `id` sendiri lewat prop, jadi bisa dipakai berulang di
 * satu halaman. Komponen ini hanya tampilan — validasi dan state disimpan di
 * pemanggil.
 */

/* --- Field pembungkus ------------------------------------------------------ */

type FieldProps = React.ComponentProps<"div"> & {
  /** Tampilkan garis merah dan latar merah muda. */
  salah?: boolean;
};

export function Field({ salah = false, className, children, ...props }: FieldProps) {
  return (
    <div className={cn("field", salah && "field--error", className)} {...props}>
      {children}
    </div>
  );
}

export function FieldLabel({ className, children, ...props }: React.ComponentProps<"label">) {
  return (
    <label className={cn("field__label", className)} {...props}>
      {children}
    </label>
  );
}

export function FieldHint({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("field__hint", className)} {...props}>
      {children}
    </span>
  );
}

export function FieldError({ className, children, ...props }: React.ComponentProps<"span">) {
  return (
    <span className={cn("field__error", className)} {...props}>
      {children}
    </span>
  );
}

export function FieldInput({ className, ...props }: React.ComponentProps<"input">) {
  return <input className={cn("field__input", className)} {...props} />;
}

export function FieldSelect({ className, children, ...props }: React.ComponentProps<"select">) {
  return (
    <select className={cn("field__select", className)} {...props}>
      {children}
    </select>
  );
}

export function FieldTextarea({ className, ...props }: React.ComponentProps<"textarea">) {
  return <textarea className={cn("field__textarea", className)} {...props} />;
}

/* --- Checkbox -------------------------------------------------------------- */

type CheckboxProps = React.ComponentProps<"input"> & {
  label: React.ReactNode;
};

export function Checkbox({ label, className, ...props }: CheckboxProps) {
  return (
    <label className={cn("check", className)}>
      <input type="checkbox" className="check__input" {...props} />
      <span className="check__box" aria-hidden="true" />
      <span className="check__label">{label}</span>
    </label>
  );
}

/* --- Radio ----------------------------------------------------------------- */

type RadioProps = React.ComponentProps<"input"> & {
  label: React.ReactNode;
};

export function Radio({ label, className, ...props }: RadioProps) {
  return (
    <label className={cn("radio", className)}>
      <input type="radio" className="radio__input" {...props} />
      <span className="radio__dot" aria-hidden="true" />
      <span className="radio__label">{label}</span>
    </label>
  );
}

/* --- Toggle mekanis -------------------------------------------------------- */

type ToggleProps = React.ComponentProps<"input"> & {
  label: React.ReactNode;
};

export function Toggle({ label, className, id, ...props }: ToggleProps) {
  return (
    <label className={cn("toggle", className)} htmlFor={id}>
      <input type="checkbox" className="toggle__input" id={id} {...props} />
      <span className="toggle__track" aria-hidden="true">
        <span className="toggle__knob" />
      </span>
      <span className="toggle__label">{label}</span>
    </label>
  );
}

/* --- Pembungkus ------------------------------------------------------------ */

export function FormStack({ className, children, ...props }: React.ComponentProps<"form">) {
  return (
    <form className={cn("form-stack", className)} {...props}>
      {children}
    </form>
  );
}

export function FieldGroup({ className, children, ...props }: React.ComponentProps<"fieldset">) {
  return (
    <fieldset className={cn("field-group", className)} {...props}>
      {children}
    </fieldset>
  );
}

export function ToggleRow({ className, children, ...props }: React.ComponentProps<"div">) {
  return (
    <div className={cn("toggle-row", className)} {...props}>
      {children}
    </div>
  );
}
