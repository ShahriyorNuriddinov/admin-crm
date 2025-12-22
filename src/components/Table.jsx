const Table = ({ columns, data }) => {
  return (
    <div className="overflow-x-auto rounded-lg border">
      <table className="min-w-full text-sm">
        <thead className="bg-gray-100">
          <tr>
            {columns.map((col, i) => (
              <th
                key={i}
                className="px-4 py-3 text-left font-semibold border-b"
              >
                {col.title}
              </th>
            ))}
          </tr>
        </thead>

        <tbody>
          {data.length > 0 ? (
            data.map((row, rowIndex) => (
              <tr
                key={row._id || rowIndex}
                className="hover:bg-gray-50 border-b"
              >
                {columns.map((col, colIndex) => (
                  <td key={colIndex} className="px-4 py-2">
                    {col.render
                      ? col.render(row)
                      : row[col.dataIndex]}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td
                colSpan={columns.length}
                className="text-center py-6 text-gray-500"
              >
                Maʼlumot yo‘q
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;