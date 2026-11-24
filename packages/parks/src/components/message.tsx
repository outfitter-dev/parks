/*
 * Message: one turn in a conversation. Your turns sit at the end of the line
 * in a muted bubble; an agent's turn reads as plain content at full width,
 * so its steps, code and asks are not boxed twice. `author` names the
 * speaker for screen readers.
 */

import type * as React from "react";

import { cnState } from "#lib/utils";

type MessageProps = React.ComponentProps<"div"> & {
  from: "you" | "agent";
  author?: string;
};

function Message({
  from,
  author,
  className,
  children,
  ...props
}: MessageProps) {
  const speaker = author ?? (from === "you" ? "You" : "Agent");
  return (
    <div
      data-slot="message"
      data-from={from}
      className={cnState(
        "flex min-w-0 flex-col gap-2",
        from === "you" && "items-end",
        className
      )}
      {...props}
    >
      <span className="sr-only">{speaker} said:</span>
      {from === "you" ? (
        <div
          data-slot="message-bubble"
          className="bg-muted text-foreground max-w-[80%] rounded-xl px-3.5 py-2"
        >
          {children}
        </div>
      ) : (
        children
      )}
    </div>
  );
}

export { Message };
export type { MessageProps };
