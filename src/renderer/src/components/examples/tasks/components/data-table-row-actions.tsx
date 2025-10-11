"use client";

import { Row } from "@tanstack/react-table";
import { MoreHorizontal } from "lucide-react";

import { Button } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubContent,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger
} from "@renderer/components/ui/dropdown-menu";

import { labels } from "../data/data";
import type { Task } from "../data/schema";

type ActionItem<TData> = {
  label: string;
  onSelect?: (row: TData) => void;
  variant?: "default" | "destructive";
};

type LabelsConfig<TData> = {
  title?: string;
  options: { label: string; value: string }[];
  getSelected: (row: TData) => string;
  onChange?: (row: TData, value: string) => void;
};

interface DataTableRowActionsProps<TData> {
  row: Row<TData>;
  actions?: ActionItem<TData>[];
  labelsConfig?: LabelsConfig<TData>;
}

export function DataTableRowActions<TData>({ row, actions, labelsConfig }: DataTableRowActionsProps<TData>) {
  const defaultActions: ActionItem<TData>[] = [
    { label: "Edit" },
    { label: "Make a copy" },
    { label: "Favorite" },
    { label: "Delete", variant: "destructive" }
  ];

  const items = actions?.length ? actions : defaultActions;

  const labelsCfg: LabelsConfig<TData> | undefined = labelsConfig || {
    title: "Labels",
    options: labels,
    getSelected: (r) => (r as unknown as Task).label ?? "",
    onChange: undefined
  };

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" className="data-[state=open]:bg-muted size-8">
          <MoreHorizontal />
          <span className="sr-only">Open menu</span>
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end" className="w-[180px]">
        {items
          .filter((it) => it.variant !== "destructive")
          .map((it) => (
            <DropdownMenuItem key={it.label} onClick={() => it.onSelect?.(row.original as TData)}>
              {it.label}
            </DropdownMenuItem>
          ))}
        {labelsCfg ? (
          <>
            <DropdownMenuSeparator />
            <DropdownMenuSub>
              <DropdownMenuSubTrigger>{labelsCfg.title ?? "Labels"}</DropdownMenuSubTrigger>
              <DropdownMenuSubContent>
                <DropdownMenuRadioGroup value={labelsCfg.getSelected(row.original as TData)}>
                  {labelsCfg.options.map((opt) => (
                    <DropdownMenuRadioItem
                      key={opt.value}
                      value={opt.value}
                      onClick={() => labelsCfg.onChange?.(row.original as TData, opt.value)}
                    >
                      {opt.label}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuSubContent>
            </DropdownMenuSub>
          </>
        ) : null}
        {items.some((it) => it.variant === "destructive") ? (
          <>
            <DropdownMenuSeparator />
            {items
              .filter((it) => it.variant === "destructive")
              .map((it) => (
                <DropdownMenuItem
                  key={it.label}
                  variant="destructive"
                  onClick={() => it.onSelect?.(row.original as TData)}
                >
                  {it.label}
                  <DropdownMenuShortcut>Del</DropdownMenuShortcut>
                </DropdownMenuItem>
              ))}
          </>
        ) : null}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default DataTableRowActions;

