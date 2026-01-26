import React from "react";

export const Table = ({ children, ...props }: any) => (
    <div className="overflow-x-auto">
        <table className="w-full table-auto divide-y divide-gray-200" {...props}>
            {children}
        </table>
    </div>
);

export const TableHeader = ({ children, ...props }: any) => (
    <thead className="bg-gray-50" {...props}>
    {children}
    </thead>
);

export const TableBody = ({ children, ...props }: any) => (
    <tbody className="bg-white divide-y divide-gray-200" {...props}>
    {children}
    </tbody>
);

export const TableRow = ({ children, ...props }: any) => <tr {...props}>{children}</tr>;

export const TableHead = ({ children, ...props }: any) => (
    <th
        className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider"
        {...props}
    >
        {children}
    </th>
);

export const TableCell = ({ children, ...props }: any) => (
    <td className="px-6 py-4 whitespace-nowrap" {...props}>
        {children}
    </td>
);
