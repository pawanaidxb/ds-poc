import React, { useState } from "react";
import { TableHeaderCell } from "./TableHeaderCell";

const wrap = (Story) => <table style={{ borderCollapse: "collapse", width: 240 }}><thead><tr><Story /></tr></thead></table>;

export default {
  title: "Table/Header cell",
  component: TableHeaderCell,
  argTypes: {
    title: { control: "text" },
    align: { control: "inline-radio", options: ["left", "right"] },
    sort: { control: "inline-radio", options: ["none", "asc", "desc"] },
    showSort: { control: "boolean" }, showFilter: { control: "boolean" }, showDragHandle: { control: "boolean" },
    filtered: { control: "boolean" }, resizing: { control: "boolean" }, dragging: { control: "boolean" },
    dropTarget: { control: "boolean" }, disabled: { control: "boolean" },
  },
  decorators: [wrap],
};

export const Default = { args: { title: "Account" } };
export const Ascending = { args: { title: "Account", sort: "asc" } };
export const Descending = { args: { title: "Account", sort: "desc" } };
export const Filtered = { args: { title: "Status", filtered: true } };
export const Resizing = { args: { title: "Owner", resizing: true } };
export const Dragging = { args: { title: "Owner", dragging: true } };
export const DropTarget = { args: { title: "Owner", dropTarget: true } };
export const Disabled = { args: { title: "Owner", disabled: true } };
export const RightAligned = { args: { title: "ARR", align: "right" } };

export const ClickToSort = {
  render: () => {
    const [sort, setSort] = useState("none");
    const next = { none: "asc", asc: "desc", desc: "none" };
    return <TableHeaderCell title="Seats" align="right" sort={sort} onSort={() => setSort(next[sort])} />;
  },
};
