const MAX_EXPORT_ROWS = 1000;

interface ExportableRow {
  [key: string]: string | number | boolean | null | undefined;
}

export function buildCsv(headers: string[], rows: ExportableRow[]): string {
  const limited = rows.slice(0, MAX_EXPORT_ROWS);
  const escape = (val: unknown) => {
    const str = String(val ?? "");
    return str.includes(",") || str.includes('"') || str.includes("\n")
      ? `"${str.replace(/"/g, '""')}"`
      : str;
  };

  const lines = [
    headers.map(escape).join(","),
    ...limited.map((row) => headers.map((h) => escape(row[h])).join(",")),
  ];

  return lines.join("\n");
}

export function downloadCsv(filename: string, csv: string): void {
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export async function downloadPdf(
  title: string,
  headers: string[],
  rows: ExportableRow[]
): Promise<void> {
  const limited = rows.slice(0, MAX_EXPORT_ROWS);
  const { default: jsPDF } = await import("jspdf");
  const { default: autoTable } = await import("jspdf-autotable");

  const doc = new jsPDF();
  doc.setFontSize(16);
  doc.text(title, 14, 20);
  doc.setFontSize(10);
  doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 28);

  autoTable(doc, {
    startY: 35,
    head: [headers],
    body: limited.map((row) => headers.map((h) => String(row[h] ?? ""))),
    styles: { fontSize: 8 },
    headStyles: { fillColor: [0, 172, 193] },
  });

  doc.save(`${title.toLowerCase().replace(/\s+/g, "-")}.pdf`);
}
