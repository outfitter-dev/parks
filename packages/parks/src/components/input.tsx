import { Input as InputPrimitive } from "@base-ui/react/input";
import * as React from "react";

import { controlSize } from "#lib/size";
import type { ControlSize } from "#lib/size";
import { cnState } from "#lib/utils";

type InputProps = Omit<React.ComponentProps<"input">, "size"> & {
  /** The control scale: xs, sm, default or lg (see #lib/size). */
  size?: ControlSize;
};

function Input({ className, type, size = "default", ...props }: InputProps) {
  return (
    <InputPrimitive
      type={type}
      data-slot="input"
      data-size={size}
      className={cnState(
        controlSize[size],
        "h-(--size-h) w-full min-w-0 rounded-lg border border-input bg-field px-2.5 py-1 text-base transition-colors outline-none file:inline-flex file:h-6 file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-focus-ring disabled:pointer-events-none disabled:cursor-not-allowed disabled:bg-field-disabled disabled:opacity-50 aria-invalid:border-invalid-border aria-invalid:ring-3 aria-invalid:ring-invalid-ring md:text-sm data-[size=xs]:rounded-md data-[size=xs]:px-2 data-[size=xs]:text-xs data-[size=sm]:rounded-md data-[size=sm]:px-2 data-[size=sm]:text-(length:--text-control-small)",
        className
      )}
      {...props}
    />
  );
}

export { Input };
export type { InputProps };
