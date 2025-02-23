import React from 'react';

interface TableRow {
  item: string;
  price: string;
}

interface DynamicTableProps {
  data: TableRow[];
}

const DynamicTable: React.FC<DynamicTableProps> = ({ data }) => {
  return (
    <div className="overflow-x-auto rounded-lg border border-gray-200 bg-white">
      <table className="w-full text-left border-collapse">
        {/* Table Head */}
        <thead className="bg-gray-50">
          <tr>
            <th className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
              Item
            </th>
            <th className="px-4 py-3 border-b border-gray-200 text-sm font-semibold text-gray-600">
              Price
            </th>
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.map((row, index) => (
            <tr
              key={index}
              className="transition-colors hover:bg-blue-50" 
              /* Light-blue hover effect on the entire row */
            >
              <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                {row.item}
              </td>
              <td className="px-4 py-3 border-b border-gray-200 text-gray-700">
                {row.price}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default DynamicTable;
