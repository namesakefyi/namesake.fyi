"use client";

import {
  RiArrowDownSLine,
  RiArrowUpSLine,
  RiDraggable,
} from "@remixicon/react";
import {
  Cell as AriaCell,
  Column as AriaColumn,
  Row as AriaRow,
  Table as AriaTable,
  TableBody as AriaTableBody,
  TableHeader as AriaTableHeader,
  Button,
  type CellProps,
  Collection,
  type ColumnProps,
  type RowProps,
  type TableBodyProps,
  type TableHeaderProps,
  type TableProps,
  useTableOptions,
} from "react-aria-components";
import { Checkbox } from "../Checkbox";
import "./Table.css";

export function Table(props: TableProps) {
  return <AriaTable {...props} />;
}

export function Column(
  props: Omit<ColumnProps, "children"> & { children?: React.ReactNode },
) {
  return (
    <AriaColumn {...props}>
      {({ allowsSorting, sortDirection }) => (
        <div className="column-header">
          {props.children}
          {allowsSorting && (
            <span aria-hidden="true" className="sort-indicator">
              {sortDirection === "ascending" ? (
                <RiArrowUpSLine size={14} />
              ) : (
                <RiArrowDownSLine size={14} />
              )}
            </span>
          )}
        </div>
      )}
    </AriaColumn>
  );
}

export function TableHeader<T extends object>({
  columns,
  children,
  ...otherProps
}: TableHeaderProps<T>) {
  const { selectionBehavior, selectionMode, allowsDragging } =
    useTableOptions();

  return (
    <AriaTableHeader {...otherProps}>
      {/* Add extra columns for drag and drop and selection. */}
      {allowsDragging && <AriaColumn />}
      {selectionBehavior === "toggle" && (
        <AriaColumn width={40} minWidth={0}>
          {selectionMode === "multiple" && <Checkbox slot="selection" />}
        </AriaColumn>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaTableHeader>
  );
}

export function Row<T extends object>({
  id,
  columns,
  children,
  ...otherProps
}: RowProps<T>) {
  const { selectionBehavior, allowsDragging } = useTableOptions();

  return (
    <AriaRow id={id} {...otherProps}>
      {allowsDragging && (
        <Cell>
          <Button slot="drag">
            <RiDraggable size={16} />
          </Button>
        </Cell>
      )}
      {selectionBehavior === "toggle" && (
        <Cell>
          <Checkbox slot="selection" />
        </Cell>
      )}
      <Collection items={columns}>{children}</Collection>
    </AriaRow>
  );
}

export function TableBody<T extends object>(props: TableBodyProps<T>) {
  return <AriaTableBody {...props} />;
}

export function Cell(props: CellProps) {
  return <AriaCell {...props} />;
}
