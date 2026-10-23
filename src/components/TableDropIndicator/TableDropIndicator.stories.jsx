import React from "react";
import { TableDropIndicator } from "./TableDropIndicator";

export default { title: "Table/Drop indicator", component: TableDropIndicator };
export const RowActive = { render: () => <div style={{ width: 400 }}><TableDropIndicator axis="row" /></div> };
export const RowInactive = { render: () => <div style={{ width: 400 }}><TableDropIndicator axis="row" active={false} /></div> };
export const Column = { render: () => <div style={{ height: 200 }}><TableDropIndicator axis="column" /></div> };
