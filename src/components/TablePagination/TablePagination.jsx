import React from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "../TableIcons/TableIcons";
import "./TablePagination.css";

/**
 * TablePagination — matches "Table / Pagination" in Figma.
 * State=Multiple pages/Single page -> derived from page and pageCount
 */
export function TablePagination({ page = 1, pageCount = 2, pageSize = 12, pageSizes = [12, 24, 48], onPageChange, onPageSizeChange }) {
  const prevOff = page <= 1, nextOff = page >= pageCount;
  return (
    <nav className="poc-tpage" aria-label="Pagination">
      <label className="poc-tpage__label" htmlFor="poc-tpage-size">Rows per page</label>
      <span className="poc-tpage__size">
        <select id="poc-tpage-size" value={pageSize} onChange={(e) => onPageSizeChange && onPageSizeChange(Number(e.target.value))}>
          {pageSizes.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
      </span>
      <span className="poc-tpage__count" aria-live="polite">Page {page} of {pageCount}</span>
      <button type="button" className="poc-tpage__btn" disabled={prevOff} onClick={() => onPageChange && onPageChange(page - 1)} aria-label="Previous page"><ChevronLeftIcon /></button>
      <button type="button" className="poc-tpage__btn" disabled={nextOff} onClick={() => onPageChange && onPageChange(page + 1)} aria-label="Next page"><ChevronRightIcon /></button>
    </nav>
  );
}

export default TablePagination;
