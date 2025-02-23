import React from 'react';

interface TableRow {
  item: string;
  price: string;
}

interface DynamicTableProps {
  data: TableRow[];
  onEditPrice: (index: number) => void;    // <-- add
  onDeleteRow: (index: number) => void;    // <-- add
}

const DynamicTable: React.FC<DynamicTableProps> = ({   data,
    onEditPrice,
    onDeleteRow, }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left border-collapse">
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
              Item
            </th>
            <th className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
              Price
            </th>
            {/* New column for Actions */}
            <th className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
              Actions
            </th>
          </tr>
        </thead>
        <tbody>
          {data.map((row, index) => (
            <tr key={index} className="transition-colors hover:bg-blue-50">
              <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                {row.item}
              </td>
              <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                {row.price}
              </td>
              <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                <button
                  onClick={() => onEditPrice(index)}
                  className="mr-2 px-2 py-1 bg-blue-500 text-black rounded"
                >
                  Edit
                </button>
                <button
                  className="px-2 py-1 bg-red text-white rounded"
                  onClick={() => onDeleteRow(index)}
                >
                  Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
