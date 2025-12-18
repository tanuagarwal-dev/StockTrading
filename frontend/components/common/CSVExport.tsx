'use client';

interface CSVHeader<T> {
  key: keyof T;
  label: string;
}

interface CSVExportProps<T> {
  data: T[];
  filename: string;
  headers: CSVHeader<T>[];
}

export default function CSVExport<T extends object>({
  data,
  filename,
  headers,
}: CSVExportProps<T>) {
  const downloadCSV = () => {
    if (!data.length) return;

    const headerRow = headers.map(h => h.label).join(',');
    const rows = data.map(row =>
      headers
        .map(h => {
          const value = row[h.key];
          const text =
            typeof value === 'object' ? JSON.stringify(value) : String(value);
          const escaped = text.replace(/"/g, '""');
          return text.includes(',') || text.includes('"') || text.includes('\n')
            ? `"${escaped}"`
            : escaped;
        })
        .join(',')
    );

    const csv = [headerRow, ...rows].join('\n');
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);

    const link = document.createElement('a');
    link.href = url;
    link.download = filename;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <button
      onClick={downloadCSV}
      className="px-3 py-1.5 text-sm rounded bg-blue-600 text-white hover:bg-blue-700"
      disabled={!data.length}
    >
      Export CSV
    </button>
  );
}
