"use client";

import { Checkbox } from "@outfitter/parks/components/checkbox";
import {
  Combobox,
  ComboboxChip,
  ComboboxChips,
  ComboboxChipsInput,
  ComboboxContent,
  ComboboxEmpty,
  ComboboxInput,
  ComboboxItem,
  ComboboxList,
  ComboboxValue,
  useComboboxAnchor,
} from "@outfitter/parks/components/combobox";
import {
  Field,
  FieldContent,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
  FieldTitle,
} from "@outfitter/parks/components/field";
import { Input } from "@outfitter/parks/components/input";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@outfitter/parks/components/input-group";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@outfitter/parks/components/input-otp";
import { Kbd } from "@outfitter/parks/components/kbd";
import {
  RadioGroup,
  RadioGroupItem,
} from "@outfitter/parks/components/radio-group";
import { Textarea } from "@outfitter/parks/components/textarea";
import { CopyIcon } from "@solar-icons/react/linear/copy";
import { MagnifierIcon } from "@solar-icons/react/linear/magnifier";
import { useState } from "react";

import { agents } from "#lib/fixtures";

import { Specimen } from "./kit";

const agentNames = agents.map((agent) => agent.name);
const channels = [
  "outfitter",
  "toolkit",
  "signals",
  "zion",
  "yosemite",
  "test-routing",
];

export function FormsDemo() {
  return (
    <>
      <Specimen
        title="Field"
        note="Field groups a label, control, description and error. Over a text control the label and hint start where the control's text starts."
        className="block"
      >
        <FieldGroup className="max-w-md">
          <Field>
            <FieldLabel htmlFor="field-agent">Agent name</FieldLabel>
            <Input id="field-agent" placeholder="mardy" />
            <FieldDescription>Lowercase, used in mentions.</FieldDescription>
          </Field>
          <Field data-invalid>
            <FieldLabel htmlFor="field-url">Webhook URL</FieldLabel>
            <Input
              id="field-url"
              aria-invalid
              defaultValue="http://not-https.example"
            />
            <FieldError>Use an https URL.</FieldError>
          </Field>
          <Field>
            <FieldLabel htmlFor="field-note">Note</FieldLabel>
            <Textarea id="field-note" placeholder="What this agent is for" />
          </Field>
          <Field orientation="horizontal">
            <Checkbox id="field-digest" />
            <FieldContent>
              <FieldLabel htmlFor="field-digest">Digest instead</FieldLabel>
              <FieldDescription>
                Collect mentions and send them once an hour.
              </FieldDescription>
            </FieldContent>
          </Field>
        </FieldGroup>
      </Specimen>

      <Specimen
        title="Radio group"
        note="A set of choices in a FieldSet. A choice with a description is a choice card; the checked card takes the brand edge."
        className="block"
      >
        <div className="grid max-w-3xl gap-8 sm:grid-cols-2">
          <FieldSet>
            <FieldLegend variant="label">Wake on</FieldLegend>
            <RadioGroup defaultValue="mentions">
              {[
                { value: "everything", label: "Every message" },
                { value: "mentions", label: "Mentions only" },
                { value: "never", label: "Never" },
              ].map((option) => (
                <Field key={option.value} orientation="horizontal">
                  <RadioGroupItem
                    id={`wake-${option.value}`}
                    value={option.value}
                  />
                  <FieldLabel
                    htmlFor={`wake-${option.value}`}
                    className="font-normal"
                  >
                    {option.label}
                  </FieldLabel>
                </Field>
              ))}
            </RadioGroup>
          </FieldSet>
          <FieldSet>
            <FieldLegend variant="label">Delivery</FieldLegend>
            <RadioGroup defaultValue="webhook">
              {[
                {
                  value: "webhook",
                  label: "Webhook",
                  detail: "POST each delivery to the agent's URL.",
                },
                {
                  value: "mcp",
                  label: "MCP inbox",
                  detail: "The agent reads its inbox when it runs.",
                },
              ].map((option) => (
                <FieldLabel
                  key={option.value}
                  htmlFor={`delivery-${option.value}`}
                >
                  <Field orientation="horizontal">
                    <FieldContent>
                      <FieldTitle>{option.label}</FieldTitle>
                      <FieldDescription>{option.detail}</FieldDescription>
                    </FieldContent>
                    <RadioGroupItem
                      id={`delivery-${option.value}`}
                      value={option.value}
                    />
                  </Field>
                </FieldLabel>
              ))}
            </RadioGroup>
          </FieldSet>
        </div>
      </Specimen>

      <Specimen
        title="Input group"
        note="An input with addons inside its edge: an icon, a unit, a shortcut or a button."
        className="grid max-w-md grid-cols-1 items-stretch"
      >
        <InputGroup>
          <InputGroupInput
            placeholder="Search agents"
            aria-label="Search agents"
          />
          <InputGroupAddon>
            <MagnifierIcon />
          </InputGroupAddon>
          <InputGroupAddon align="inline-end">
            <Kbd>/</Kbd>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            readOnly
            defaultValue="opt_live_7Hq2…f9Kc"
            className="font-mono"
            aria-label="Token"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupButton size="icon-xs" aria-label="Copy token">
              <CopyIcon />
            </InputGroupButton>
          </InputGroupAddon>
        </InputGroup>
        <InputGroup>
          <InputGroupInput
            type="number"
            defaultValue={15}
            aria-label="Elevation window"
          />
          <InputGroupAddon align="inline-end">
            <InputGroupText>minutes</InputGroupText>
          </InputGroupAddon>
        </InputGroup>
      </Specimen>

      <Specimen
        title="Input OTP"
        note="Entering a device or verification code. Slots are one control high."
      >
        <InputOTP maxLength={8} aria-label="Device code">
          <InputOTPGroup>
            <InputOTPSlot index={0} />
            <InputOTPSlot index={1} />
            <InputOTPSlot index={2} />
            <InputOTPSlot index={3} />
          </InputOTPGroup>
          <InputOTPSeparator />
          <InputOTPGroup>
            <InputOTPSlot index={4} />
            <InputOTPSlot index={5} />
            <InputOTPSlot index={6} />
            <InputOTPSlot index={7} />
          </InputOTPGroup>
        </InputOTP>
      </Specimen>

      <Specimen
        title="Combobox"
        note="Pick from a long list by typing. Rows share the menu row recipe; chips are Badge-sized."
        className="grid max-w-md grid-cols-1 items-stretch"
      >
        <Combobox items={agentNames}>
          <ComboboxInput placeholder="Choose an agent" aria-label="Agent" />
          <ComboboxContent>
            <ComboboxEmpty>No agent by that name.</ComboboxEmpty>
            <ComboboxList>
              {(item: string) => (
                <ComboboxItem key={item} value={item}>
                  {item}
                </ComboboxItem>
              )}
            </ComboboxList>
          </ComboboxContent>
        </Combobox>
        <ChannelPicker />
      </Specimen>
    </>
  );
}

function ChannelPicker() {
  const anchor = useComboboxAnchor();
  const [value, setValue] = useState<string[]>(["outfitter", "signals"]);
  return (
    <Combobox items={channels} multiple value={value} onValueChange={setValue}>
      <ComboboxChips ref={anchor}>
        <ComboboxValue>
          {(selected: string[]) =>
            selected.map((channel) => (
              <ComboboxChip key={channel}>{channel}</ComboboxChip>
            ))
          }
        </ComboboxValue>
        <ComboboxChipsInput placeholder="Add a channel" aria-label="Channels" />
      </ComboboxChips>
      <ComboboxContent anchor={anchor}>
        <ComboboxEmpty>No channel by that name.</ComboboxEmpty>
        <ComboboxList>
          {(item: string) => (
            <ComboboxItem key={item} value={item}>
              {item}
            </ComboboxItem>
          )}
        </ComboboxList>
      </ComboboxContent>
    </Combobox>
  );
}
