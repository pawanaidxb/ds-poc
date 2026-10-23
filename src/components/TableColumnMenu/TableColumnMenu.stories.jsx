import React, { useState } from "react";
import { TableColumnMenu } from "./TableColumnMenu";
import { TableMenuOption } from "../TableMenuOption/TableMenuOption";
import { Input } from "../Input/Input";
import { Button } from "../Button/Button";

export default { title: "Table/Column menu", component: TableColumnMenu };

export const ColumnFilter = {
  render: () => {
    const [picked, setPicked] = useState({ Editor: true, Viewer: false });
    const all = Object.values(picked).every(Boolean);
    return (
      <TableColumnMenu title="Filter by role"
        footer={<><Button variant="secondary">Reset</Button><Button variant="primary">Apply</Button></>}>
        <Input size="small" width="100%" showLabel={false} showHelper={false} label="Search values" placeholder="Search values…" />
        <TableMenuOption label="Select all" detail="24" selected={all} onSelect={(on) => setPicked({ Editor: on, Viewer: on })} />
        <TableMenuOption label="Editor" detail="12" selected={picked.Editor} onSelect={(on) => setPicked({ ...picked, Editor: on })} />
        <TableMenuOption label="Viewer" detail="12" selected={picked.Viewer} onSelect={(on) => setPicked({ ...picked, Viewer: on })} />
      </TableColumnMenu>
    );
  },
};

export const ColumnVisibility = {
  render: () => {
    const cols = ["Account", "Workspace", "Status", "Owner", "Role", "Seats", "ARR", "Renewal date"];
    const [shown, setShown] = useState(Object.fromEntries(cols.map((c) => [c, c !== "Renewal date"])));
    const count = Object.values(shown).filter(Boolean).length;
    return (
      <TableColumnMenu title="Show columns" note={`${count} of ${cols.length} data columns shown`}
        footer={<Button variant="secondary" onClick={() => setShown(Object.fromEntries(cols.map((c) => [c, true])))}>Restore defaults</Button>}>
        <Input size="small" width="100%" showLabel={false} showHelper={false} label="Find a column" placeholder="Find a column…" />
        {cols.map((c) => <TableMenuOption key={c} label={c} showDetail={false} selected={shown[c]} onSelect={(on) => setShown({ ...shown, [c]: on })} />)}
      </TableColumnMenu>
    );
  },
};

export const ColumnWidth = {
  render: () => {
    const [w, setW] = useState(490);
    return (
      <TableColumnMenu title="Account column" note={`Width · ${w} px`} footer={<span>Drag the header edge to resize.</span>}>
        <Input size="small" width="100%" showLabel={false} showHelper={false} label="Column width" value={`${w} px`} readOnly />
        <TableMenuOption kind="action" label="Increase width" detail="+ 24 px" onSelect={() => setW(w + 24)} />
        <TableMenuOption kind="action" label="Decrease width" detail="− 24 px" onSelect={() => setW(Math.max(80, w - 24))} />
        <TableMenuOption kind="action" label="Auto-fit to content" showDetail={false} onSelect={() => setW(240)} />
      </TableColumnMenu>
    );
  },
};
