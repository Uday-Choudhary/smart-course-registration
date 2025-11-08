import React from 'react';

const Table = ({ columns, data, renderRow }) => {
  return (
    <table className="min-w-full divide-y divide-gray-200 mt-4">
      <thead className="bg-gray-50">
        <tr>
          {columns.map((col) => (
            <th
              key={col.accessor}
              className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${col.className || ''}`}
            >
              {col.header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="bg-white divide-y divide-gray-200">
        {data.map(renderRow)}
      </tbody>
    </table>
  );
};

export default Table;
