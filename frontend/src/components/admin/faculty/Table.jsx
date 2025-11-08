const Table = ({ columns, data, renderRow }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white">
        <thead>
          <tr className="border-b border-gray-200">
            {columns.map((col) => (
              <th key={col.accessor} className={`py-3 px-4 text-left text-sm font-medium text-gray-600 uppercase tracking-wider ${col.className}`}>
                {col.header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.map(renderRow)}
        </tbody>
      </table>
    </div>
  );
};

export default Table;
