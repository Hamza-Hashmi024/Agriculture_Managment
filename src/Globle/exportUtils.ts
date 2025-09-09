import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";


// 👉 Export Function (Reusable)
export function exportData({
  fileType,
  fileName,
  headers,
  rows,
}: {
  fileType: "csv" | "pdf";
  fileName: string;
  headers: string[];
  rows: (string | number)[][];
}) {
  if (fileType === "csv") {
    // ===== CSV Export =====
    const csvContent = [
      headers.join(","), // header row
      ...rows.map((row) => row.map((val) => `"${val}"`).join(",")), // data rows
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);

    const link = document.createElement("a");
    link.href = url;
    link.setAttribute("download", `${fileName}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  }

  if (fileType === "pdf") {
    // ===== PDF Export =====
    const doc = new jsPDF();

    // ✅ Company Logo Add karo (Top-left)
    // NOTE: PNG ya JPG Base64 string deni hogi ya public folder ka path
    const logo = "/SolutyicsFavicon.png";// <-- yahan apna logo path rakho (public folder me)
    const imgWidth = 30; // width (mm)
    const imgHeight = 30; // height (mm)
    try {
      doc.addImage(logo, "PNG", 10, 10, imgWidth, imgHeight);
    } catch (err) {
      console.warn("Logo load failed:", err);
    }

    // Title aur date thoda neeche shift kar dete hain
    doc.setFontSize(16);
    doc.text(`${fileName} Report`, 14, 50);
    doc.setFontSize(12);
    doc.text(`Generated: ${new Date().toLocaleDateString()}`, 14, 58);

    // Table
    autoTable(doc, {
      head: [headers],
      body: rows,
      startY: 65,
      styles: { fontSize: 10 },
    });

    doc.save(`${fileName}.pdf`);
  }
}