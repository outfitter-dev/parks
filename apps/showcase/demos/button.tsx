"use client";

import { AltArrowDownIcon } from "@solar-icons/react/outline/alt-arrow-down";
import { ArrowRightIcon } from "@solar-icons/react/outline/arrow-right";
import { CopyIcon } from "@solar-icons/react/outline/copy";
import { PenIcon as PenBoldIcon } from "@solar-icons/react/bold/pen";
import { PenIcon } from "@solar-icons/react/outline/pen";
import { WrenchIcon } from "@solar-icons/react/outline/wrench";
import { Button } from "@workspace/ui/components/button";
import { cn } from "@workspace/ui/lib/utils";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@workspace/ui/components/dropdown-menu";
import { Spinner } from "@workspace/ui/components/spinner";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@workspace/ui/components/table";
import { ButtonInspector } from "./button-inspector";
import { Specimen } from "./kit";

const shapes = [
  { shape: "rect", label: "Rounded rectangle" },
  { shape: "pill", label: "Pill" },
] as const;

const variants = [
  { variant: "default", label: "Primary" },
  { variant: "secondary", label: "Secondary" },
  { variant: "outline", label: "Outline" },
  { variant: "ghost", label: "Ghost" },
  { variant: "destructive", label: "Destructive" },
  { variant: "link", label: "Link" },
] as const;

const sizes = [
  { text: "xs", icon: "icon-xs", label: "Extra small", dimensions: "24px button · 12px icon" },
  { text: "sm", icon: "icon-sm", label: "Small", dimensions: "28px button · 14px icon" },
  { text: "default", icon: "icon", label: "Default", dimensions: "Control height · 16px icon" },
  { text: "lg", icon: "icon-lg", label: "Large", dimensions: "36px button · 16px icon" },
] as const;

function ButtonVariants() {
  return (
    <Specimen title="Variants and shapes">
      <Table aria-label="Button variants by shape">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Variant</TableHead>
            {shapes.map(({ shape, label }) => <TableHead key={shape} scope="col">{label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {variants.map(({ variant, label }) => (
            <TableRow key={variant}>
              <TableHead scope="row">{label}</TableHead>
              {shapes.map(({ shape, label: shapeLabel }) => (
                <TableCell key={shape}>
                  <div className="flex items-center gap-2">
                    <Button variant={variant} shape={shape} size="sm">Edit</Button>
                    <Button variant={variant} shape={shape} size="icon-sm" aria-label={`Edit, ${label} ${shapeLabel}`}>
                      <PenIcon />
                    </Button>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Specimen>
  );
}

function ButtonSizes() {
  return (
    <Specimen title="Sizes">
      <Table aria-label="Text and icon-only button sizes">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Size</TableHead>
            {shapes.map(({ shape, label }) => <TableHead key={shape} scope="col">{label}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {sizes.map(({ text, icon, label, dimensions }) => (
            <TableRow key={text}>
              <TableHead scope="row">
                {label}
                <span className="block text-xs font-normal text-muted-foreground">{dimensions}</span>
              </TableHead>
              {shapes.map(({ shape, label: shapeLabel }) => (
                <TableCell key={shape}>
                  <div className="flex items-center gap-2">
                    <Button variant="outline" shape={shape} size={text}>
                      <PenIcon data-icon="inline-start" />
                      Edit
                    </Button>
                    <Button variant="outline" shape={shape} size={icon} aria-label={`Edit, ${label} ${shapeLabel}`}>
                      <PenIcon />
                    </Button>
                  </div>
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Specimen>
  );
}

function ButtonIconPlacement() {
  return (
    <Specimen title="Icon placement and style">
      <Table aria-label="Button icon placement and style">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Shape</TableHead>
            <TableHead scope="col">Leading</TableHead>
            <TableHead scope="col">Trailing</TableHead>
            <TableHead scope="col">Outline</TableHead>
            <TableHead scope="col">Solid</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shapes.map(({ shape, label }) => (
            <TableRow key={shape}>
              <TableHead scope="row">{label}</TableHead>
              <TableCell>
                <Button variant="outline" shape={shape} size="sm"><PenIcon data-icon="inline-start" />Edit</Button>
              </TableCell>
              <TableCell>
                <Button variant="outline" shape={shape} size="sm">Open<ArrowRightIcon data-icon="inline-end" /></Button>
              </TableCell>
              <TableCell>
                <Button variant="outline" shape={shape} size="icon-sm" aria-label={`Outline Edit, ${label}`}><PenIcon /></Button>
              </TableCell>
              <TableCell>
                <Button variant="outline" shape={shape} size="icon-sm" aria-label={`Solid Edit, ${label}`}><PenBoldIcon /></Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Specimen>
  );
}

function EmbeddedActions() {
  return (
    <Specimen title="Embedded actions" note="Small and default buttons keep the same inset as their containers grow.">
      <div className="grid w-full min-w-0 gap-4 sm:grid-cols-2">
        {([
          { size: "icon-sm", label: "Small", glyph: 14, iconClass: undefined },
          { size: "icon", label: "Default", glyph: 20, iconClass: "[--icon-size:--spacing(5)]" },
        ] as const).map(({ size, label, glyph, iconClass }) => (
          <div key={size} className="flex min-w-0 flex-col gap-2">
            <h3 className="text-xs font-medium text-muted-foreground">{label} button · {glyph}px icon</h3>
            <div className="workbench-code-frame overflow-hidden border">
              <div className="flex items-center justify-between bg-muted/40 py-1 ps-3 pe-1 font-mono text-xs text-muted-foreground">
                SKILL.md
                <Button variant="ghost" size={size} className={iconClass} aria-label={`Copy code, ${glyph}px icon`}>
                  <CopyIcon />
                </Button>
              </div>
            </div>
            <div className="flex items-center gap-2 rounded-lg border py-(--row-action-inset) ps-2.5 pe-(--row-action-inset) text-xs [--row-action-inset:--spacing(1)]">
              <span className="shrink-0 font-medium">Claude Code</span>
              <span className="min-w-0 flex-1 truncate font-mono text-muted-foreground">.claude/skills/landing/SKILL.md</span>
              <Button
                variant="ghost"
                size={size}
                className={cn(
                  "rounded-[calc(max(var(--radius-floor),var(--radius)_-_var(--row-action-inset)_-_1px)*var(--corner-scale))]",
                  iconClass,
                )}
                aria-label={`Repair output, ${glyph}px icon`}
              >
                <WrenchIcon />
              </Button>
            </div>
          </div>
        ))}
      </div>
    </Specimen>
  );
}

function ButtonStates() {
  return (
    <Specimen title="States" note="Hover, press, or tab to a button to see its interaction states. Open More to see the expanded state.">
      <Table aria-label="Button states by shape">
        <TableHeader>
          <TableRow>
            <TableHead scope="col">Shape</TableHead>
            <TableHead scope="col">Disabled</TableHead>
            <TableHead scope="col">Busy</TableHead>
            <TableHead scope="col">Invalid</TableHead>
            <TableHead scope="col">Menu trigger</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {shapes.map(({ shape, label }) => (
            <TableRow key={shape}>
              <TableHead scope="row">{label}</TableHead>
              <TableCell><Button shape={shape} disabled>Save</Button></TableCell>
              <TableCell>
                <Button shape={shape} disabled aria-busy="true">
                  <Spinner data-icon="inline-start" aria-hidden="true" />Saving
                </Button>
              </TableCell>
              <TableCell><Button variant="outline" shape={shape} aria-invalid>Save</Button></TableCell>
              <TableCell>
                <DropdownMenu>
                  <DropdownMenuTrigger render={<Button variant="outline" shape={shape} />}>
                    More<AltArrowDownIcon data-icon="inline-end" />
                  </DropdownMenuTrigger>
                  <DropdownMenuContent>
                    <DropdownMenuGroup>
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                    </DropdownMenuGroup>
                  </DropdownMenuContent>
                </DropdownMenu>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </Specimen>
  );
}

export function ButtonDemo() {
  return (
    <ButtonInspector>
      <ButtonVariants />
      <ButtonSizes />
      <EmbeddedActions />
      <ButtonIconPlacement />
      <ButtonStates />
    </ButtonInspector>
  );
}
