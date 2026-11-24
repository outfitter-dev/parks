"use client";

import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@workspace/ui/components/accordion";
import { Button } from "@workspace/ui/components/button";
import { ButtonGroup, ButtonGroupSeparator, ButtonGroupText } from "@workspace/ui/components/button-group";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@workspace/ui/components/collapsible";
import { Item, ItemContent, ItemGroup, ItemMeta, ItemTitle } from "@workspace/ui/components/item";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@workspace/ui/components/pagination";
import { AltArrowDownIcon } from "@solar-icons/react/outline/alt-arrow-down";
import { versions } from "#lib/fixtures";
import { Specimen } from "./kit";

export function DisclosureDemo() {
  return (
    <>
      <Specimen title="Collapsible" note="Opens one block in place: a sidebar group, older versions, a trace step." className="block">
        <Collapsible className="max-w-md">
          <CollapsibleTrigger render={<Button variant="ghost" size="sm" className="group/trigger" />}>
            Older routing versions
            <AltArrowDownIcon data-icon="inline-end" className="transition-transform group-data-panel-open/trigger:rotate-180" />
          </CollapsibleTrigger>
          <CollapsibleContent>
            <ItemGroup variant="list" className="mt-2">
              {versions.slice(1).map((version) => (
                <Item key={version.version} size="sm">
                  <ItemContent>
                    <ItemTitle>v{version.version} · {version.change}</ItemTitle>
                  </ItemContent>
                  <ItemMeta>{version.when}</ItemMeta>
                </Item>
              ))}
            </ItemGroup>
          </CollapsibleContent>
        </Collapsible>
      </Specimen>

      <Specimen title="Accordion" note="A stack of sections where one opens at a time: settings, help." className="block">
        <Accordion className="max-w-md" defaultValue={["wake"]}>
          <AccordionItem value="wake">
            <AccordionTrigger>When does an agent wake?</AccordionTrigger>
            <AccordionContent>
              <p>On every message in a channel it follows, or only when mentioned, depending on its wake setting.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="dry-run">
            <AccordionTrigger>What does dry run do?</AccordionTrigger>
            <AccordionContent>
              <p>Deliveries are recorded in the outbox but not sent, so you can check routing first.</p>
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="elevate">
            <AccordionTrigger>Why does admin expire?</AccordionTrigger>
            <AccordionContent>
              <p>Elevation lasts 15 minutes so a forgotten session can&rsquo;t change routing later.</p>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </Specimen>
    </>
  );
}

export function GroupsDemo() {
  return (
    <>
      <Specimen title="Button group" note="Joined buttons that act as one control: a split action, a pager, a zoom pair.">
        <ButtonGroup>
          <Button variant="secondary">Approve</Button>
          <ButtonGroupSeparator />
          <Button variant="secondary" size="icon" aria-label="More approval options">
            <AltArrowDownIcon />
          </Button>
        </ButtonGroup>
        <ButtonGroup>
          <Button variant="outline">Day</Button>
          <Button variant="outline">Week</Button>
          <Button variant="outline">Month</Button>
        </ButtonGroup>
        <ButtonGroup>
          <ButtonGroupText>Timeout</ButtonGroupText>
          <Button variant="outline">30s</Button>
          <Button variant="outline">2m</Button>
        </ButtonGroup>
      </Specimen>

      <Specimen title="Pagination" note="For the audit log and other long lists. The current page is a secondary button.">
        <Pagination className="mx-0 w-auto">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious href="#" />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">1</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#" isActive>
                2
              </PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">3</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationEllipsis />
            </PaginationItem>
            <PaginationItem>
              <PaginationLink href="#">12</PaginationLink>
            </PaginationItem>
            <PaginationItem>
              <PaginationNext href="#" />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      </Specimen>
    </>
  );
}
