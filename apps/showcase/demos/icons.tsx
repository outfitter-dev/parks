import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@outfitter/parks/components/table";
import { InboxIcon as InboxDuotone } from "@solar-icons/react/bold-duotone/inbox";
import { AltArrowDownIcon as AltArrowDownSolid } from "@solar-icons/react/bold/alt-arrow-down";
import { AltArrowLeftIcon as AltArrowLeftSolid } from "@solar-icons/react/bold/alt-arrow-left";
import { AltArrowRightIcon as AltArrowRightSolid } from "@solar-icons/react/bold/alt-arrow-right";
import { AltArrowUpIcon as AltArrowUpSolid } from "@solar-icons/react/bold/alt-arrow-up";
import { ArrowRightIcon as ArrowRightSolid } from "@solar-icons/react/bold/arrow-right";
import { ArrowUpIcon as ArrowUpSolid } from "@solar-icons/react/bold/arrow-up";
import { BellOffIcon as BellOffSolid } from "@solar-icons/react/bold/bell-off";
import { BoltIcon as BoltSolid } from "@solar-icons/react/bold/bolt";
import { BoxIcon as BoxSolid } from "@solar-icons/react/bold/box";
import { ChatRoundDotsIcon as ChatRoundDotsSolid } from "@solar-icons/react/bold/chat-round-dots";
import { ChatRoundWarningIcon as ChatRoundWarningSolid } from "@solar-icons/react/bold/chat-round-warning";
import { CheckIcon as CheckSolid } from "@solar-icons/react/bold/check";
import { CheckCircleIcon as CheckCircleSolid } from "@solar-icons/react/bold/check-circle";
import { ChecklistIcon as ChecklistSolid } from "@solar-icons/react/bold/checklist";
import { CloseIcon as CloseSolid } from "@solar-icons/react/bold/close";
import { CloseCircleIcon as CloseCircleSolid } from "@solar-icons/react/bold/close-circle";
import { CodeSquareIcon as CodeSquareSolid } from "@solar-icons/react/bold/code-square";
import { CopyIcon as CopySolid } from "@solar-icons/react/bold/copy";
import { DangerCircleIcon as DangerCircleSolid } from "@solar-icons/react/bold/danger-circle";
import { DangerTriangleIcon as DangerTriangleSolid } from "@solar-icons/react/bold/danger-triangle";
import { DatabaseIcon as DatabaseSolid } from "@solar-icons/react/bold/database";
import { DocumentTextIcon as DocumentTextSolid } from "@solar-icons/react/bold/document-text";
import { DoubleAltArrowLeftIcon as DoubleAltArrowLeftSolid } from "@solar-icons/react/bold/double-alt-arrow-left";
import { DoubleAltArrowRightIcon as DoubleAltArrowRightSolid } from "@solar-icons/react/bold/double-alt-arrow-right";
import { EyeClosedIcon as EyeClosedSolid } from "@solar-icons/react/bold/eye-closed";
import { FolderIcon as FolderSolid } from "@solar-icons/react/bold/folder";
import { GalleryIcon as GallerySolid } from "@solar-icons/react/bold/gallery";
import { GitBranchIcon as GitBranchSolid } from "@solar-icons/react/bold/git-branch";
import { GitCommitIcon as GitCommitSolid } from "@solar-icons/react/bold/git-commit";
import { GitPullRequestIcon as GitPullRequestSolid } from "@solar-icons/react/bold/git-pull-request";
import { HistoryIcon as HistorySolid } from "@solar-icons/react/bold/history";
import { HomeIcon as HomeSolid } from "@solar-icons/react/bold/home";
import { InboxIcon as InboxSolid } from "@solar-icons/react/bold/inbox";
import { InfoCircleIcon as InfoCircleSolid } from "@solar-icons/react/bold/info-circle";
import { KeyIcon as KeySolid } from "@solar-icons/react/bold/key";
import { LayersMinimalisticIcon as LayersMinimalisticSolid } from "@solar-icons/react/bold/layers-minimalistic";
import { MagnifierIcon as MagnifierSolid } from "@solar-icons/react/bold/magnifier";
import { MenuDotsIcon as MenuDotsSolid } from "@solar-icons/react/bold/menu-dots";
import { MinusIcon as MinusSolid } from "@solar-icons/react/bold/minus";
import { PanelLeftCloseIcon as PanelLeftCloseSolid } from "@solar-icons/react/bold/panel-left-close";
import { PanelLeftOpenIcon as PanelLeftOpenSolid } from "@solar-icons/react/bold/panel-left-open";
import { PaperclipIcon as PaperclipSolid } from "@solar-icons/react/bold/paperclip";
import { PauseIcon as PauseSolid } from "@solar-icons/react/bold/pause";
import { PenIcon as PenSolid } from "@solar-icons/react/bold/pen";
import { PenNewSquareIcon as PenNewSquareSolid } from "@solar-icons/react/bold/pen-new-square";
import { RefreshIcon as RefreshSolid } from "@solar-icons/react/bold/refresh";
import { RoutingIcon as RoutingSolid } from "@solar-icons/react/bold/routing";
import { RulerIcon as RulerSolid } from "@solar-icons/react/bold/ruler";
import { SettingsIcon as SettingsSolid } from "@solar-icons/react/bold/settings";
import { ShieldCheckIcon as ShieldCheckSolid } from "@solar-icons/react/bold/shield-check";
import { ShieldKeyholeIcon as ShieldKeyholeSolid } from "@solar-icons/react/bold/shield-keyhole";
import { SortVerticalIcon as SortVerticalSolid } from "@solar-icons/react/bold/sort-vertical";
import { StarsIcon as StarsSolid } from "@solar-icons/react/bold/stars";
import { StructureIcon as StructureSolid } from "@solar-icons/react/bold/structure";
import { TrashBinMinimalisticIcon as TrashBinMinimalisticSolid } from "@solar-icons/react/bold/trash-bin-minimalistic";
import { Tuning2Icon as Tuning2Solid } from "@solar-icons/react/bold/tuning-2";
import { UploadMinimalisticIcon as UploadMinimalisticSolid } from "@solar-icons/react/bold/upload-minimalistic";
import { UsersGroupRoundedIcon as UsersGroupRoundedSolid } from "@solar-icons/react/bold/users-group-rounded";
import { Widget2Icon as Widget2Solid } from "@solar-icons/react/bold/widget-2";
import { WrenchIcon as WrenchSolid } from "@solar-icons/react/bold/wrench";
import { AltArrowDownIcon as AltArrowDownOutline } from "@solar-icons/react/linear/alt-arrow-down";
import { AltArrowLeftIcon as AltArrowLeftOutline } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon as AltArrowRightOutline } from "@solar-icons/react/linear/alt-arrow-right";
import { AltArrowUpIcon as AltArrowUpOutline } from "@solar-icons/react/linear/alt-arrow-up";
import { ArrowRightIcon as ArrowRightOutline } from "@solar-icons/react/linear/arrow-right";
import { ArrowUpIcon as ArrowUpOutline } from "@solar-icons/react/linear/arrow-up";
import { BellOffIcon as BellOffOutline } from "@solar-icons/react/linear/bell-off";
import { BoltIcon as BoltOutline } from "@solar-icons/react/linear/bolt";
import { BoxIcon as BoxOutline } from "@solar-icons/react/linear/box";
import { ChatRoundDotsIcon as ChatRoundDotsOutline } from "@solar-icons/react/linear/chat-round-dots";
import { ChatRoundWarningIcon as ChatRoundWarningOutline } from "@solar-icons/react/linear/chat-round-warning";
import { CheckIcon as CheckOutline } from "@solar-icons/react/linear/check";
import { CheckCircleIcon as CheckCircleOutline } from "@solar-icons/react/linear/check-circle";
import { ChecklistIcon as ChecklistOutline } from "@solar-icons/react/linear/checklist";
import { CloseIcon as CloseOutline } from "@solar-icons/react/linear/close";
import { CloseCircleIcon as CloseCircleOutline } from "@solar-icons/react/linear/close-circle";
import { CodeSquareIcon as CodeSquareOutline } from "@solar-icons/react/linear/code-square";
import { CopyIcon as CopyOutline } from "@solar-icons/react/linear/copy";
import { DangerCircleIcon as DangerCircleOutline } from "@solar-icons/react/linear/danger-circle";
import { DangerTriangleIcon as DangerTriangleOutline } from "@solar-icons/react/linear/danger-triangle";
import { DatabaseIcon as DatabaseOutline } from "@solar-icons/react/linear/database";
import { DocumentTextIcon as DocumentTextOutline } from "@solar-icons/react/linear/document-text";
import { DoubleAltArrowLeftIcon as DoubleAltArrowLeftOutline } from "@solar-icons/react/linear/double-alt-arrow-left";
import { DoubleAltArrowRightIcon as DoubleAltArrowRightOutline } from "@solar-icons/react/linear/double-alt-arrow-right";
import { EyeClosedIcon as EyeClosedOutline } from "@solar-icons/react/linear/eye-closed";
import { FolderIcon as FolderOutline } from "@solar-icons/react/linear/folder";
import { GalleryIcon as GalleryOutline } from "@solar-icons/react/linear/gallery";
import { GitBranchIcon as GitBranchOutline } from "@solar-icons/react/linear/git-branch";
import { GitCommitIcon as GitCommitOutline } from "@solar-icons/react/linear/git-commit";
import { GitPullRequestIcon as GitPullRequestOutline } from "@solar-icons/react/linear/git-pull-request";
import { HistoryIcon as HistoryOutline } from "@solar-icons/react/linear/history";
import { HomeIcon as HomeOutline } from "@solar-icons/react/linear/home";
import { InboxIcon as InboxOutline } from "@solar-icons/react/linear/inbox";
import { InfoCircleIcon as InfoCircleOutline } from "@solar-icons/react/linear/info-circle";
import { KeyIcon as KeyOutline } from "@solar-icons/react/linear/key";
import { LayersMinimalisticIcon as LayersMinimalisticOutline } from "@solar-icons/react/linear/layers-minimalistic";
import { MagnifierIcon as MagnifierOutline } from "@solar-icons/react/linear/magnifier";
import { MenuDotsIcon as MenuDotsOutline } from "@solar-icons/react/linear/menu-dots";
import { MinusIcon as MinusOutline } from "@solar-icons/react/linear/minus";
import { PanelLeftCloseIcon as PanelLeftCloseOutline } from "@solar-icons/react/linear/panel-left-close";
import { PanelLeftOpenIcon as PanelLeftOpenOutline } from "@solar-icons/react/linear/panel-left-open";
import { PaperclipIcon as PaperclipOutline } from "@solar-icons/react/linear/paperclip";
import { PauseIcon as PauseOutline } from "@solar-icons/react/linear/pause";
import { PenIcon as PenOutline } from "@solar-icons/react/linear/pen";
import { PenNewSquareIcon as PenNewSquareOutline } from "@solar-icons/react/linear/pen-new-square";
import { RefreshIcon as RefreshOutline } from "@solar-icons/react/linear/refresh";
import { RoutingIcon as RoutingOutline } from "@solar-icons/react/linear/routing";
import { RulerIcon as RulerOutline } from "@solar-icons/react/linear/ruler";
import { SettingsIcon as SettingsOutline } from "@solar-icons/react/linear/settings";
import { ShieldCheckIcon as ShieldCheckOutline } from "@solar-icons/react/linear/shield-check";
import { ShieldKeyholeIcon as ShieldKeyholeOutline } from "@solar-icons/react/linear/shield-keyhole";
import { SortVerticalIcon as SortVerticalOutline } from "@solar-icons/react/linear/sort-vertical";
import { StarsIcon as StarsOutline } from "@solar-icons/react/linear/stars";
import { StructureIcon as StructureOutline } from "@solar-icons/react/linear/structure";
import { TrashBinMinimalisticIcon as TrashBinMinimalisticOutline } from "@solar-icons/react/linear/trash-bin-minimalistic";
import { Tuning2Icon as Tuning2Outline } from "@solar-icons/react/linear/tuning-2";
import { UploadMinimalisticIcon as UploadMinimalisticOutline } from "@solar-icons/react/linear/upload-minimalistic";
import { UsersGroupRoundedIcon as UsersGroupRoundedOutline } from "@solar-icons/react/linear/users-group-rounded";
import { Widget2Icon as Widget2Outline } from "@solar-icons/react/linear/widget-2";
import { WrenchIcon as WrenchOutline } from "@solar-icons/react/linear/wrench";

import { Specimen } from "./kit";

const icons = [
  {
    name: "alt-arrow-down",
    linear: AltArrowDownOutline,
    solid: AltArrowDownSolid,
  },
  {
    name: "alt-arrow-left",
    linear: AltArrowLeftOutline,
    solid: AltArrowLeftSolid,
  },
  {
    name: "alt-arrow-right",
    linear: AltArrowRightOutline,
    solid: AltArrowRightSolid,
  },
  { name: "alt-arrow-up", linear: AltArrowUpOutline, solid: AltArrowUpSolid },
  { name: "arrow-right", linear: ArrowRightOutline, solid: ArrowRightSolid },
  { name: "arrow-up", linear: ArrowUpOutline, solid: ArrowUpSolid },
  { name: "bell-off", linear: BellOffOutline, solid: BellOffSolid },
  { name: "bolt", linear: BoltOutline, solid: BoltSolid },
  { name: "box", linear: BoxOutline, solid: BoxSolid },
  {
    name: "chat-round-dots",
    linear: ChatRoundDotsOutline,
    solid: ChatRoundDotsSolid,
  },
  {
    name: "chat-round-warning",
    linear: ChatRoundWarningOutline,
    solid: ChatRoundWarningSolid,
  },
  { name: "check", linear: CheckOutline, solid: CheckSolid },
  {
    name: "check-circle",
    linear: CheckCircleOutline,
    solid: CheckCircleSolid,
  },
  { name: "checklist", linear: ChecklistOutline, solid: ChecklistSolid },
  { name: "close", linear: CloseOutline, solid: CloseSolid },
  {
    name: "close-circle",
    linear: CloseCircleOutline,
    solid: CloseCircleSolid,
  },
  { name: "code-square", linear: CodeSquareOutline, solid: CodeSquareSolid },
  { name: "copy", linear: CopyOutline, solid: CopySolid },
  {
    name: "danger-circle",
    linear: DangerCircleOutline,
    solid: DangerCircleSolid,
  },
  {
    name: "danger-triangle",
    linear: DangerTriangleOutline,
    solid: DangerTriangleSolid,
  },
  { name: "database", linear: DatabaseOutline, solid: DatabaseSolid },
  {
    name: "document-text",
    linear: DocumentTextOutline,
    solid: DocumentTextSolid,
  },
  {
    name: "double-alt-arrow-left",
    linear: DoubleAltArrowLeftOutline,
    solid: DoubleAltArrowLeftSolid,
  },
  {
    name: "double-alt-arrow-right",
    linear: DoubleAltArrowRightOutline,
    solid: DoubleAltArrowRightSolid,
  },
  { name: "eye-closed", linear: EyeClosedOutline, solid: EyeClosedSolid },
  { name: "folder", linear: FolderOutline, solid: FolderSolid },
  { name: "gallery", linear: GalleryOutline, solid: GallerySolid },
  { name: "git-branch", linear: GitBranchOutline, solid: GitBranchSolid },
  { name: "git-commit", linear: GitCommitOutline, solid: GitCommitSolid },
  {
    name: "git-pull-request",
    linear: GitPullRequestOutline,
    solid: GitPullRequestSolid,
  },
  { name: "history", linear: HistoryOutline, solid: HistorySolid },
  { name: "home", linear: HomeOutline, solid: HomeSolid },
  { name: "inbox", linear: InboxOutline, solid: InboxSolid },
  { name: "info-circle", linear: InfoCircleOutline, solid: InfoCircleSolid },
  { name: "key", linear: KeyOutline, solid: KeySolid },
  {
    name: "layers-minimalistic",
    linear: LayersMinimalisticOutline,
    solid: LayersMinimalisticSolid,
  },
  { name: "magnifier", linear: MagnifierOutline, solid: MagnifierSolid },
  { name: "menu-dots", linear: MenuDotsOutline, solid: MenuDotsSolid },
  { name: "minus", linear: MinusOutline, solid: MinusSolid },
  {
    name: "panel-left-close",
    linear: PanelLeftCloseOutline,
    solid: PanelLeftCloseSolid,
  },
  {
    name: "panel-left-open",
    linear: PanelLeftOpenOutline,
    solid: PanelLeftOpenSolid,
  },
  { name: "paperclip", linear: PaperclipOutline, solid: PaperclipSolid },
  { name: "pause", linear: PauseOutline, solid: PauseSolid },
  { name: "pen", linear: PenOutline, solid: PenSolid },
  {
    name: "pen-new-square",
    linear: PenNewSquareOutline,
    solid: PenNewSquareSolid,
  },
  { name: "refresh", linear: RefreshOutline, solid: RefreshSolid },
  { name: "routing", linear: RoutingOutline, solid: RoutingSolid },
  { name: "ruler", linear: RulerOutline, solid: RulerSolid },
  { name: "settings", linear: SettingsOutline, solid: SettingsSolid },
  {
    name: "shield-check",
    linear: ShieldCheckOutline,
    solid: ShieldCheckSolid,
  },
  {
    name: "shield-keyhole",
    linear: ShieldKeyholeOutline,
    solid: ShieldKeyholeSolid,
  },
  {
    name: "sort-vertical",
    linear: SortVerticalOutline,
    solid: SortVerticalSolid,
  },
  { name: "stars", linear: StarsOutline, solid: StarsSolid },
  { name: "structure", linear: StructureOutline, solid: StructureSolid },
  {
    name: "trash-bin-minimalistic",
    linear: TrashBinMinimalisticOutline,
    solid: TrashBinMinimalisticSolid,
  },
  { name: "tuning-2", linear: Tuning2Outline, solid: Tuning2Solid },
  {
    name: "upload-minimalistic",
    linear: UploadMinimalisticOutline,
    solid: UploadMinimalisticSolid,
  },
  {
    name: "users-group-rounded",
    linear: UsersGroupRoundedOutline,
    solid: UsersGroupRoundedSolid,
  },
  { name: "widget-2", linear: Widget2Outline, solid: Widget2Solid },
  { name: "wrench", linear: WrenchOutline, solid: WrenchSolid },
];

const styles = [
  { key: "linear", label: "Linear" },
  { key: "solid", label: "Solid" },
] as const;

const sizes = [12, 14, 16, 20, 24] as const;

export function IconsDemo() {
  return (
    <>
      <Specimen title="Icon sizes and styles" className="block">
        <Table aria-label="Solar icon comparison by style and size">
          <colgroup span={1} />
          {styles.map(({ key }) => (
            <colgroup key={key} span={sizes.length} />
          ))}
          <TableHeader>
            <TableRow>
              <TableHead rowSpan={2} scope="col">
                Icon
              </TableHead>
              {styles.map(({ key, label }) => (
                <TableHead
                  key={key}
                  colSpan={sizes.length}
                  scope="colgroup"
                  className="h-8 border-s text-center"
                >
                  {label}
                </TableHead>
              ))}
            </TableRow>
            <TableRow>
              {styles.flatMap(({ key }) =>
                sizes.map((size, index) => (
                  <TableHead
                    key={`${key}-${size}`}
                    scope="col"
                    className={`text-muted-foreground h-8 min-w-10 text-center text-xs font-normal ${index === 0 ? "border-s" : ""}`}
                  >
                    {size}px
                  </TableHead>
                ))
              )}
            </TableRow>
          </TableHeader>
          <TableBody>
            {icons.map((icon) => (
              <TableRow key={icon.name}>
                <TableHead
                  scope="row"
                  className="text-muted-foreground font-mono text-xs font-normal"
                >
                  {icon.name}
                </TableHead>
                {styles.flatMap(({ key, label }) => {
                  const Glyph = icon[key];
                  return sizes.map((size, index) => (
                    <TableCell
                      key={`${key}-${size}`}
                      className={index === 0 ? "border-s" : undefined}
                      title={`${icon.name} · ${label} · ${size}px`}
                    >
                      <div className="grid min-h-6 place-items-center">
                        <Glyph size={size} aria-hidden />
                      </div>
                    </TableCell>
                  ));
                })}
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Specimen>
      <Specimen title="Bold duotone">
        <InboxDuotone size={40} className="text-brand" />
        <span className="text-muted-foreground font-mono text-xs">
          inbox · 40px
        </span>
      </Specimen>
      <p className="text-muted-foreground">
        Solar icons by 480 Design, CC BY 4.0.
      </p>
    </>
  );
}
