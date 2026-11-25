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
import { CheckCircleIcon as CheckCircleSolid } from "@solar-icons/react/bold/check-circle";
import { CloseCircleIcon as CloseCircleSolid } from "@solar-icons/react/bold/close-circle";
import { CodeSquareIcon as CodeSquareSolid } from "@solar-icons/react/bold/code-square";
import { CopyIcon as CopySolid } from "@solar-icons/react/bold/copy";
import { DangerCircleIcon as DangerCircleSolid } from "@solar-icons/react/bold/danger-circle";
import { DangerTriangleIcon as DangerTriangleSolid } from "@solar-icons/react/bold/danger-triangle";
import { DatabaseIcon as DatabaseSolid } from "@solar-icons/react/bold/database";
import { DocumentTextIcon as DocumentTextSolid } from "@solar-icons/react/bold/document-text";
import { DoubleAltArrowLeftIcon as DoubleAltArrowLeftSolid } from "@solar-icons/react/bold/double-alt-arrow-left";
import { DoubleAltArrowRightIcon as DoubleAltArrowRightSolid } from "@solar-icons/react/bold/double-alt-arrow-right";
import { FolderIcon as FolderSolid } from "@solar-icons/react/bold/folder";
import { GalleryIcon as GallerySolid } from "@solar-icons/react/bold/gallery";
import { HomeIcon as HomeSolid } from "@solar-icons/react/bold/home";
import { InboxIcon as InboxSolid } from "@solar-icons/react/bold/inbox";
import { InfoCircleIcon as InfoCircleSolid } from "@solar-icons/react/bold/info-circle";
import { KeyIcon as KeySolid } from "@solar-icons/react/bold/key";
import { LayersMinimalisticIcon as LayersMinimalisticSolid } from "@solar-icons/react/bold/layers-minimalistic";
import { MagnifierIcon as MagnifierSolid } from "@solar-icons/react/bold/magnifier";
import { MenuDotsIcon as MenuDotsSolid } from "@solar-icons/react/bold/menu-dots";
import { PanelLeftCloseIcon as PanelLeftCloseSolid } from "@solar-icons/react/bold/panel-left-close";
import { PanelLeftOpenIcon as PanelLeftOpenSolid } from "@solar-icons/react/bold/panel-left-open";
import { PauseIcon as PauseSolid } from "@solar-icons/react/bold/pause";
import { PenIcon as PenSolid } from "@solar-icons/react/bold/pen";
import { PenNewSquareIcon as PenNewSquareSolid } from "@solar-icons/react/bold/pen-new-square";
import { RulerIcon as RulerSolid } from "@solar-icons/react/bold/ruler";
import { SettingsIcon as SettingsSolid } from "@solar-icons/react/bold/settings";
import { ShieldCheckIcon as ShieldCheckSolid } from "@solar-icons/react/bold/shield-check";
import { ShieldKeyholeIcon as ShieldKeyholeSolid } from "@solar-icons/react/bold/shield-keyhole";
import { StarsIcon as StarsSolid } from "@solar-icons/react/bold/stars";
import { StructureIcon as StructureSolid } from "@solar-icons/react/bold/structure";
import { TrashBinMinimalisticIcon as TrashBinMinimalisticSolid } from "@solar-icons/react/bold/trash-bin-minimalistic";
import { Tuning2Icon as Tuning2Solid } from "@solar-icons/react/bold/tuning-2";
import { UsersGroupRoundedIcon as UsersGroupRoundedSolid } from "@solar-icons/react/bold/users-group-rounded";
import { Widget2Icon as Widget2Solid } from "@solar-icons/react/bold/widget-2";
import { WrenchIcon as WrenchSolid } from "@solar-icons/react/bold/wrench";
import { AltArrowDownIcon as AltArrowDownLinear } from "@solar-icons/react/linear/alt-arrow-down";
import { AltArrowLeftIcon as AltArrowLeftLinear } from "@solar-icons/react/linear/alt-arrow-left";
import { AltArrowRightIcon as AltArrowRightLinear } from "@solar-icons/react/linear/alt-arrow-right";
import { AltArrowUpIcon as AltArrowUpLinear } from "@solar-icons/react/linear/alt-arrow-up";
import { ArrowRightIcon as ArrowRightLinear } from "@solar-icons/react/linear/arrow-right";
import { ArrowUpIcon as ArrowUpLinear } from "@solar-icons/react/linear/arrow-up";
import { BellOffIcon as BellOffLinear } from "@solar-icons/react/linear/bell-off";
import { BoltIcon as BoltLinear } from "@solar-icons/react/linear/bolt";
import { BoxIcon as BoxLinear } from "@solar-icons/react/linear/box";
import { ChatRoundDotsIcon as ChatRoundDotsLinear } from "@solar-icons/react/linear/chat-round-dots";
import { ChatRoundWarningIcon as ChatRoundWarningLinear } from "@solar-icons/react/linear/chat-round-warning";
import { CheckIcon as CheckLinear } from "@solar-icons/react/linear/check";
import { CheckCircleIcon as CheckCircleLinear } from "@solar-icons/react/linear/check-circle";
import { ChecklistIcon as ChecklistLinear } from "@solar-icons/react/linear/checklist";
import { CloseIcon as CloseLinear } from "@solar-icons/react/linear/close";
import { CloseCircleIcon as CloseCircleLinear } from "@solar-icons/react/linear/close-circle";
import { CodeSquareIcon as CodeSquareLinear } from "@solar-icons/react/linear/code-square";
import { CopyIcon as CopyLinear } from "@solar-icons/react/linear/copy";
import { DangerCircleIcon as DangerCircleLinear } from "@solar-icons/react/linear/danger-circle";
import { DangerTriangleIcon as DangerTriangleLinear } from "@solar-icons/react/linear/danger-triangle";
import { DatabaseIcon as DatabaseLinear } from "@solar-icons/react/linear/database";
import { DocumentTextIcon as DocumentTextLinear } from "@solar-icons/react/linear/document-text";
import { DoubleAltArrowLeftIcon as DoubleAltArrowLeftLinear } from "@solar-icons/react/linear/double-alt-arrow-left";
import { DoubleAltArrowRightIcon as DoubleAltArrowRightLinear } from "@solar-icons/react/linear/double-alt-arrow-right";
import { EyeClosedIcon as EyeClosedLinear } from "@solar-icons/react/linear/eye-closed";
import { FolderIcon as FolderLinear } from "@solar-icons/react/linear/folder";
import { GalleryIcon as GalleryLinear } from "@solar-icons/react/linear/gallery";
import { GitBranchIcon as GitBranchLinear } from "@solar-icons/react/linear/git-branch";
import { GitCommitIcon as GitCommitLinear } from "@solar-icons/react/linear/git-commit";
import { GitPullRequestIcon as GitPullRequestLinear } from "@solar-icons/react/linear/git-pull-request";
import { HistoryIcon as HistoryLinear } from "@solar-icons/react/linear/history";
import { HomeIcon as HomeLinear } from "@solar-icons/react/linear/home";
import { InboxIcon as InboxLinear } from "@solar-icons/react/linear/inbox";
import { InfoCircleIcon as InfoCircleLinear } from "@solar-icons/react/linear/info-circle";
import { KeyIcon as KeyLinear } from "@solar-icons/react/linear/key";
import { LayersMinimalisticIcon as LayersMinimalisticLinear } from "@solar-icons/react/linear/layers-minimalistic";
import { MagnifierIcon as MagnifierLinear } from "@solar-icons/react/linear/magnifier";
import { MenuDotsIcon as MenuDotsLinear } from "@solar-icons/react/linear/menu-dots";
import { MinusIcon as MinusLinear } from "@solar-icons/react/linear/minus";
import { PanelLeftCloseIcon as PanelLeftCloseLinear } from "@solar-icons/react/linear/panel-left-close";
import { PanelLeftOpenIcon as PanelLeftOpenLinear } from "@solar-icons/react/linear/panel-left-open";
import { PaperclipIcon as PaperclipLinear } from "@solar-icons/react/linear/paperclip";
import { PauseIcon as PauseLinear } from "@solar-icons/react/linear/pause";
import { PenIcon as PenLinear } from "@solar-icons/react/linear/pen";
import { PenNewSquareIcon as PenNewSquareLinear } from "@solar-icons/react/linear/pen-new-square";
import { RefreshIcon as RefreshLinear } from "@solar-icons/react/linear/refresh";
import { RoutingIcon as RoutingLinear } from "@solar-icons/react/linear/routing";
import { RulerIcon as RulerLinear } from "@solar-icons/react/linear/ruler";
import { SettingsIcon as SettingsLinear } from "@solar-icons/react/linear/settings";
import { ShieldCheckIcon as ShieldCheckLinear } from "@solar-icons/react/linear/shield-check";
import { ShieldKeyholeIcon as ShieldKeyholeLinear } from "@solar-icons/react/linear/shield-keyhole";
import { SortVerticalIcon as SortVerticalLinear } from "@solar-icons/react/linear/sort-vertical";
import { StarsIcon as StarsLinear } from "@solar-icons/react/linear/stars";
import { StructureIcon as StructureLinear } from "@solar-icons/react/linear/structure";
import { TrashBinMinimalisticIcon as TrashBinMinimalisticLinear } from "@solar-icons/react/linear/trash-bin-minimalistic";
import { Tuning2Icon as Tuning2Linear } from "@solar-icons/react/linear/tuning-2";
import { UploadMinimalisticIcon as UploadMinimalisticLinear } from "@solar-icons/react/linear/upload-minimalistic";
import { UsersGroupRoundedIcon as UsersGroupRoundedLinear } from "@solar-icons/react/linear/users-group-rounded";
import { Widget2Icon as Widget2Linear } from "@solar-icons/react/linear/widget-2";
import { WrenchIcon as WrenchLinear } from "@solar-icons/react/linear/wrench";

import { Specimen } from "./kit";

const icons = [
  {
    name: "alt-arrow-down",
    linear: AltArrowDownLinear,
    solid: AltArrowDownSolid,
  },
  {
    name: "alt-arrow-left",
    linear: AltArrowLeftLinear,
    solid: AltArrowLeftSolid,
  },
  {
    name: "alt-arrow-right",
    linear: AltArrowRightLinear,
    solid: AltArrowRightSolid,
  },
  { name: "alt-arrow-up", linear: AltArrowUpLinear, solid: AltArrowUpSolid },
  { name: "arrow-right", linear: ArrowRightLinear, solid: ArrowRightSolid },
  { name: "arrow-up", linear: ArrowUpLinear, solid: ArrowUpSolid },
  { name: "bell-off", linear: BellOffLinear, solid: BellOffSolid },
  { name: "bolt", linear: BoltLinear, solid: BoltSolid },
  { name: "box", linear: BoxLinear, solid: BoxSolid },
  {
    name: "chat-round-dots",
    linear: ChatRoundDotsLinear,
    solid: ChatRoundDotsSolid,
  },
  {
    name: "chat-round-warning",
    linear: ChatRoundWarningLinear,
    solid: ChatRoundWarningSolid,
  },
  { name: "check", linear: CheckLinear, solid: CheckLinear },
  {
    name: "check-circle",
    linear: CheckCircleLinear,
    solid: CheckCircleSolid,
  },
  { name: "checklist", linear: ChecklistLinear, solid: ChecklistLinear },
  { name: "close", linear: CloseLinear, solid: CloseLinear },
  {
    name: "close-circle",
    linear: CloseCircleLinear,
    solid: CloseCircleSolid,
  },
  { name: "code-square", linear: CodeSquareLinear, solid: CodeSquareSolid },
  { name: "copy", linear: CopyLinear, solid: CopySolid },
  {
    name: "danger-circle",
    linear: DangerCircleLinear,
    solid: DangerCircleSolid,
  },
  {
    name: "danger-triangle",
    linear: DangerTriangleLinear,
    solid: DangerTriangleSolid,
  },
  { name: "database", linear: DatabaseLinear, solid: DatabaseSolid },
  {
    name: "document-text",
    linear: DocumentTextLinear,
    solid: DocumentTextSolid,
  },
  {
    name: "double-alt-arrow-left",
    linear: DoubleAltArrowLeftLinear,
    solid: DoubleAltArrowLeftSolid,
  },
  {
    name: "double-alt-arrow-right",
    linear: DoubleAltArrowRightLinear,
    solid: DoubleAltArrowRightSolid,
  },
  { name: "eye-closed", linear: EyeClosedLinear, solid: EyeClosedLinear },
  { name: "folder", linear: FolderLinear, solid: FolderSolid },
  { name: "gallery", linear: GalleryLinear, solid: GallerySolid },
  { name: "git-branch", linear: GitBranchLinear, solid: GitBranchLinear },
  { name: "git-commit", linear: GitCommitLinear, solid: GitCommitLinear },
  {
    name: "git-pull-request",
    linear: GitPullRequestLinear,
    solid: GitPullRequestLinear,
  },
  { name: "history", linear: HistoryLinear, solid: HistoryLinear },
  { name: "home", linear: HomeLinear, solid: HomeSolid },
  { name: "inbox", linear: InboxLinear, solid: InboxSolid },
  { name: "info-circle", linear: InfoCircleLinear, solid: InfoCircleSolid },
  { name: "key", linear: KeyLinear, solid: KeySolid },
  {
    name: "layers-minimalistic",
    linear: LayersMinimalisticLinear,
    solid: LayersMinimalisticSolid,
  },
  { name: "magnifier", linear: MagnifierLinear, solid: MagnifierSolid },
  { name: "menu-dots", linear: MenuDotsLinear, solid: MenuDotsSolid },
  { name: "minus", linear: MinusLinear, solid: MinusLinear },
  {
    name: "panel-left-close",
    linear: PanelLeftCloseLinear,
    solid: PanelLeftCloseSolid,
  },
  {
    name: "panel-left-open",
    linear: PanelLeftOpenLinear,
    solid: PanelLeftOpenSolid,
  },
  { name: "paperclip", linear: PaperclipLinear, solid: PaperclipLinear },
  { name: "pause", linear: PauseLinear, solid: PauseSolid },
  { name: "pen", linear: PenLinear, solid: PenSolid },
  {
    name: "pen-new-square",
    linear: PenNewSquareLinear,
    solid: PenNewSquareSolid,
  },
  { name: "refresh", linear: RefreshLinear, solid: RefreshLinear },
  { name: "routing", linear: RoutingLinear, solid: RoutingLinear },
  { name: "ruler", linear: RulerLinear, solid: RulerSolid },
  { name: "settings", linear: SettingsLinear, solid: SettingsSolid },
  {
    name: "shield-check",
    linear: ShieldCheckLinear,
    solid: ShieldCheckSolid,
  },
  {
    name: "shield-keyhole",
    linear: ShieldKeyholeLinear,
    solid: ShieldKeyholeSolid,
  },
  {
    name: "sort-vertical",
    linear: SortVerticalLinear,
    solid: SortVerticalLinear,
  },
  { name: "stars", linear: StarsLinear, solid: StarsSolid },
  { name: "structure", linear: StructureLinear, solid: StructureSolid },
  {
    name: "trash-bin-minimalistic",
    linear: TrashBinMinimalisticLinear,
    solid: TrashBinMinimalisticSolid,
  },
  { name: "tuning-2", linear: Tuning2Linear, solid: Tuning2Solid },
  {
    name: "upload-minimalistic",
    linear: UploadMinimalisticLinear,
    solid: UploadMinimalisticLinear,
  },
  {
    name: "users-group-rounded",
    linear: UsersGroupRoundedLinear,
    solid: UsersGroupRoundedSolid,
  },
  { name: "widget-2", linear: Widget2Linear, solid: Widget2Solid },
  { name: "wrench", linear: WrenchLinear, solid: WrenchSolid },
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
