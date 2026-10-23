import React, { useState } from "react";
import { TableFilterLogic } from "./TableFilterLogic";

export default { title: "Table/Filter logic", component: TableFilterLogic };
export const And = { args: { value: "AND" } };
export const Or = { args: { value: "OR" } };
export const Interactive = { render: () => { const [v, setV] = useState("AND"); return <TableFilterLogic value={v} onChange={setV} />; } };
