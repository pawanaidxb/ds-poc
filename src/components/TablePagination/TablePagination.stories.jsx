import React, { useState } from "react";
import { TablePagination } from "./TablePagination";

export default { title: "Table/Pagination", component: TablePagination };
export const MultiplePages = { render: () => { const [p, setP] = useState(1); const [s, setS] = useState(12); return <TablePagination page={p} pageCount={24 / s >= 1 ? Math.ceil(24 / s) : 1} pageSize={s} onPageChange={setP} onPageSizeChange={(v) => { setS(v); setP(1); }} />; } };
export const SinglePage = { args: { page: 1, pageCount: 1 } };
