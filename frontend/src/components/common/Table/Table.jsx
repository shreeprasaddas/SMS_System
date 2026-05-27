import React from 'react';
import clsx from 'clsx';

function Table({ headers = [], data = [], renderRow, className = '', emptyMessage = 'No data available' }) {
  return (
    <div className={clsx('overflow-x-auto w-full border border-secondary-200 rounded-lg shadow-sm', className)}>
      <table className="min-w-full divide-y divide-secondary-200 text-left text-sm bg-white">
        <thead className="bg-secondary-50 text-secondary-700 uppercase text-xs font-semibold tracking-wider">
          <tr>
            {headers.map((h, i) => (
              <th key={i} className="px-6 py-3">
                {h}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="divide-y divide-secondary-200 text-secondary-900">
          {data.length === 0 ? (
            <tr>
              <td colSpan={headers.length} className="px-6 py-10 text-center text-secondary-500">
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr key={rowIndex} className="hover:bg-secondary-50 transition-colors">
                {renderRow ? renderRow(row, rowIndex) : null}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
}

export default Table;
