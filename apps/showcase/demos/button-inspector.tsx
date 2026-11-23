"use client";

import { RulerIcon } from "@solar-icons/react/outline/ruler";
import { Toggle } from "@workspace/ui/components/toggle";
import { cn } from "@workspace/ui/lib/utils";
import { useEffect, useRef, useState, type ReactNode } from "react";

const buttonSelector = "button[data-slot=button]";

function textRects(button: HTMLButtonElement) {
  const rects: DOMRect[] = [];
  const walker = document.createTreeWalker(button, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  while (walker.nextNode()) {
    const node = walker.currentNode;
    const parent = node.parentElement;
    if (
      !node.textContent?.trim() ||
      !parent ||
      parent.closest("svg, .sr-only, [hidden]") ||
      getComputedStyle(parent).visibility !== "visible"
    ) continue;

    range.selectNodeContents(node);
    rects.push(...Array.from(range.getClientRects()).filter(({ width, height }) => width && height));
  }

  return rects;
}

function measure(button: HTMLButtonElement) {
  const style = getComputedStyle(button);
  const bounds = button.getBoundingClientRect();
  const glyphs = [...button.querySelectorAll("svg")]
    .map((icon) => icon.getBoundingClientRect())
    .filter(({ width, height }) => width && height);
  const text = textRects(button);
  const [top, right, bottom, left] = [style.paddingTop, style.paddingRight, style.paddingBottom, style.paddingLeft].map(parseFloat);
  const [borderTop, borderRight, borderBottom, borderLeft] = [
    style.borderTopWidth, style.borderRightWidth, style.borderBottomWidth, style.borderLeftWidth,
  ].map(parseFloat);
  const inner = {
    x: bounds.left + borderLeft,
    y: bounds.top + borderTop,
    width: bounds.width - borderLeft - borderRight,
    height: bounds.height - borderTop - borderBottom,
  };
  const middleHeight = Math.max(0, inner.height - top - bottom);
  const padding = [
    { x: inner.x, y: inner.y, width: inner.width, height: top },
    { x: inner.x, y: inner.y + top, width: left, height: middleHeight },
    { x: inner.x + inner.width - right, y: inner.y + top, width: right, height: middleHeight },
    { x: inner.x, y: inner.y + inner.height - bottom, width: inner.width, height: bottom },
  ].filter(({ width, height }) => width > 0 && height > 0);
  const rtl = style.direction === "rtl";
  const labelInset = text.length
    ? rtl ? bounds.right - Math.max(...text.map((rect) => rect.right))
      : Math.min(...text.map((rect) => rect.left)) - bounds.left
    : null;

  return {
    label: button.getAttribute("aria-label") ?? button.textContent?.trim() ?? "Button",
    bounds,
    glyphs,
    text,
    padding,
    paddingValues: [top, rtl ? left : right, bottom, rtl ? right : left],
    gap: style.columnGap === "normal" ? 0 : parseFloat(style.columnGap),
    labelInset,
    radius: style.borderTopLeftRadius,
    pill: button.classList.contains("rounded-full"),
  };
}

type Measurement = ReturnType<typeof measure>;

function px(value: number) {
  return `${Math.round(value * 10) / 10}px`;
}

function dimensions({ width, height }: { width: number; height: number }) {
  return `${px(width)} × ${px(height)}`;
}

function Overlay({ measurement }: { measurement: Measurement }) {
  const { bounds, glyphs, text, padding } = measurement;

  return (
    <svg aria-hidden="true" className="pointer-events-none fixed inset-0 z-40 size-full">
      <rect x={bounds.x} y={bounds.y} width={bounds.width} height={bounds.height} className="fill-none stroke-foreground" />
      {padding.map(({ x, y, width, height }, index) => (
        <rect key={index} x={x} y={y} width={width} height={height} className="fill-warning/25" />
      ))}
      {glyphs.map(({ x, y, width, height }, index) => (
        <rect key={index} x={x} y={y} width={width} height={height} className="fill-info/15 stroke-info" />
      ))}
      {text.map(({ x, y, width, height }, index) => (
        <rect key={index} x={x} y={y} width={width} height={height} strokeDasharray="2 2" className="fill-none stroke-success" />
      ))}
    </svg>
  );
}

function Measurements({ measurement }: { measurement: Measurement }) {
  const { bounds, glyphs, text, paddingValues, gap, labelInset, radius, pill } = measurement;
  const [top, end, bottom, start] = paddingValues;
  const values = [
    { label: "Button", value: dimensions(bounds) },
    { label: "Glyph", value: glyphs.map(dimensions).join(", ") || "None", color: "bg-info" },
    { label: "Text box", value: text.map(dimensions).join(", ") || "None", color: "bg-success" },
    { label: "Corner radius", value: pill ? "Full pill" : radius },
    { label: "Padding", value: `Top ${px(top)} · End ${px(end)} · Bottom ${px(bottom)} · Start ${px(start)}`, color: "bg-warning", wide: true },
    { label: "Icon–text gap", value: glyphs.length && text.length ? px(gap) : "—" },
    { label: "Start edge to text", value: labelInset === null ? "—" : px(labelInset) },
  ];

  return (
    <dl className="grid grid-cols-2 gap-x-4 gap-y-2 text-xs sm:grid-cols-4">
      {values.map(({ label, value, color, wide }) => (
        <div key={label} className={cn("min-w-0", wide && "col-span-2")}>
          <dt className="flex items-center gap-1.5 text-muted-foreground">
            {color ? <span aria-hidden="true" className={cn("size-2 shrink-0 rounded-2xs", color)} /> : null}
            {label}
          </dt>
          <dd className="mt-0.5 font-mono text-foreground">{value}</dd>
        </div>
      ))}
    </dl>
  );
}

export function ButtonInspector({ children }: { children: ReactNode }) {
  const specimens = useRef<HTMLDivElement>(null);
  const [enabled, setEnabled] = useState(false);
  const [target, setTarget] = useState<HTMLButtonElement | null>(null);
  const [measurement, setMeasurement] = useState<Measurement | null>(null);

  useEffect(() => {
    if (!enabled || !target) return;

    let frame = 0;
    const update = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(() => setMeasurement(target.isConnected ? measure(target) : null));
    };
    const observer = new ResizeObserver(update);
    observer.observe(target);
    window.addEventListener("scroll", update, true);
    window.addEventListener("resize", update);
    update();

    return () => {
      cancelAnimationFrame(frame);
      observer.disconnect();
      window.removeEventListener("scroll", update, true);
      window.removeEventListener("resize", update);
    };
  }, [enabled, target]);

  function select(element: EventTarget | null) {
    if (!enabled || !(element instanceof Element)) return;
    const button = element.closest<HTMLButtonElement>(buttonSelector);
    if (button && specimens.current?.contains(button)) setTarget(button);
  }

  return (
    <>
      <div className={cn("mb-4", enabled && "sticky top-2 z-50 rounded-lg border bg-popover p-3 shadow-sm")}>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1">
          <Toggle
            variant="outline"
            size="sm"
            pressed={enabled}
            onPressedChange={(pressed) => {
              setEnabled(pressed);
              setTarget(pressed ? specimens.current?.querySelector<HTMLButtonElement>(`${buttonSelector}:has([data-icon="inline-start"])`) ?? null : null);
              setMeasurement(null);
            }}
          >
            <RulerIcon data-icon="inline-start" />
            Inspect
          </Toggle>
          {enabled ? (
            <>
              <span className="text-xs text-muted-foreground">Hover or focus a specimen.</span>
              {measurement ? <span className="text-sm font-medium">{measurement.label}</span> : null}
            </>
          ) : null}
        </div>
        {enabled && measurement ? <div className="mt-3"><Measurements measurement={measurement} /></div> : null}
      </div>
      <div
        ref={specimens}
        className={cn(enabled && "[&_button[data-slot=button]:disabled]:pointer-events-auto [&_button[data-slot=button]_svg]:outline [&_button[data-slot=button]_svg]:outline-info/50")}
        onPointerOver={(event) => select(event.target)}
        onFocusCapture={(event) => select(event.target)}
      >
        {children}
      </div>
      {enabled && measurement ? <Overlay measurement={measurement} /> : null}
    </>
  );
}
