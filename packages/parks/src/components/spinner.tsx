import { RefreshIcon } from "@solar-icons/react/linear/refresh";

import { cnState } from "#lib/utils";

function Spinner({ className, ...props }: React.ComponentProps<"svg">) {
  return (
    <RefreshIcon
      data-slot="spinner"
      role="status"
      aria-label="Loading"
      className={cnState("size-4 animate-spin", className)}
      {...props}
    />
  );
}

export { Spinner };
