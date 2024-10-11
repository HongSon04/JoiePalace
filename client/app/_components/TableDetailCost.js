import React from 'react';

// Table Component
const TableDetailCost = ({ headers, data }) => {
  return (
    <div className="overflow-x-auto">
      <table className="min-w-full text-left text-sm text-gray-300 border-collapse">
        <TableHead headers={headers} />
        <TableBody data={data} />
      </table>
    </div>
  );
};

// TableHead Component
const TableHead = ({ headers }) => {
  return (
    <thead className="text-white font-semibold text-sm leading-[18px]">
      <tr>
        {headers.map((header, index) => (
          <th key={index} className=" border border-white p-4">
            {header}
          </th>
        ))}
      </tr>
    </thead>
  );
};

// TableBody Component
const TableBody = ({ data }) => {
  return (
    <tbody className="">
      {data.map((row, index) => (
        <TableRow key={index} row={row} />
      ))}
    </tbody>
  );
};

// TableRow Component
const TableRow = ({ row }) => {
  return (
    <tr>
      <td className="border border-white p-4 text-white leading-[18px]">{row.service}</td>
      <td className="border border-white p-4 text-white leading-[18px]">
        {Array.isArray(row.description) ? (
          <ul>
            {row.description.map((item, index) => (
              <li key={index} className='text-white leading-[18px]'>{item}</li>
            ))}
          </ul>
        ) : (
          row.description
        )}
      </td>
      <td className="border border-white p-4 text-white leading-[18px]">{row.cost}</td>
    </tr>
  );
};



const TableDetail = ({headers, data}) => {
  return (
    <div className="">
      <TableDetailCost headers={headers} data={data} />
    </div>
  );
};

export default TableDetail;
