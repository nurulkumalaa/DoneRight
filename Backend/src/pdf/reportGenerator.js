import PDFDocument from "pdfkit";

const drawTable = (doc, startX, startY, colWidths, headers, rows) => {
    const rowHeight = 30;
    let y = startY;

    // Header Background
    doc.fillColor("#dddddd")
        .rect(startX, y, colWidths[0] + colWidths[1], rowHeight)
        .fill();
    doc.fillColor("#000000");

    // Header Text
    doc.font("Helvetica-Bold").fontSize(12);
    doc.text(headers[0], startX + 10, y + 10);
    doc.text(headers[1], startX + colWidths[0] + 10, y + 10);

    // Header Borders
    doc.rect(startX, y, colWidths[0], rowHeight).stroke();
    doc.rect(startX + colWidths[0], y, colWidths[1], rowHeight).stroke();

    y += rowHeight;

    // Row Data
    doc.font("Helvetica").fontSize(12);
    rows.forEach(row => {
        // Draw Borders
        doc.rect(startX, y, colWidths[0], rowHeight).stroke();
        doc.rect(startX + colWidths[0], y, colWidths[1], rowHeight).stroke();

        // Draw Text
        doc.text(row.label, startX + 10, y + 10);
        doc.text(row.value.toString(), startX + colWidths[0] + 10, y + 10);

        y += rowHeight;
    });
};

// =====================================
// GLOBAL PDF
// =====================================
export const generateGlobalPDF =
    (res, stats) => {

        const doc =
            new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            "attachment; filename=global-report.pdf"
        );

        doc.pipe(res);

        doc
            .fontSize(20)
            .text(
                "DONE RIGHT SYSTEM REPORT",
                {
                    align:
                        "center",
                }
            );

        doc.moveDown();

        doc.fontSize(14);

        const totalUsers =
            Number(
                stats.total_users
            ) || 0;

        const totalTasks =
            Number(
                stats.total_tasks
            ) || 0;

        const onTime =
            Number(
                stats.on_time
            ) || 0;

        const pending =
            Number(
                stats.pending
            ) || 0;

        const overdue =
            Number(
                stats.overdue
            ) || 0;

        // PRODUCTIVITY
        const productivity =
            totalTasks > 0
                ? (
                    (
                        onTime /
                        totalTasks
                    ) * 100
                ).toFixed(1)
                : "0.0";

        doc.moveDown();
        const tableTop = doc.y;

        const rows = [
            { label: "Total Users", value: totalUsers },
            { label: "Total Tasks", value: totalTasks },
            { label: "On Time", value: onTime },
            { label: "Pending", value: pending },
            { label: "Overdue", value: overdue },
            { label: "System Productivity", value: `${productivity}%` }
        ];

        const margin = doc.page.margins.left;
        const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const colWidth = contentWidth / 2;

        drawTable(doc, margin, tableTop, [colWidth, colWidth], ["Indikator", "Nilai"], rows);

        doc.end();
    };

// =====================================
// USER PDF
// =====================================
export const generateUserPDF =
    (res, user) => {

        const doc =
            new PDFDocument();

        res.setHeader(
            "Content-Type",
            "application/pdf"
        );

        res.setHeader(
            "Content-Disposition",
            `attachment; filename=user-${user.id_users}.pdf`
        );

        doc.pipe(res);

        doc
            .fontSize(20)
            .text(
                "DONE RIGHT USER REPORT",
                {
                    align:
                        "center",
                }
            );

        doc.moveDown();

        doc.fontSize(14);

        const totalTasks =
            Number(
                user.total_tasks
            ) || 0;

        const onTime =
            Number(
                user.on_time
            ) || 0;

        const overdue =
            Number(
                user.overdue
            ) || 0;

        const pending =
            Number(
                user.pending
            ) || 0;

        doc.text(`Username: ${user.username}`);
        doc.text(`Email: ${user.email}`);

        doc.moveDown();

        const productivity =
            totalTasks > 0
                ? (
                    (
                        onTime /
                        totalTasks
                    ) * 100
                ).toFixed(1)
                : "0.0";

        doc.moveDown();
        const tableTop = doc.y;

        const rows = [
            { label: "Total Task", value: totalTasks },
            { label: "On Time", value: onTime },
            { label: "Overdue", value: overdue },
            { label: "Pending", value: pending },
            { label: "Productivity", value: `${productivity}%` }
        ];

        const margin = doc.page.margins.left;
        const contentWidth = doc.page.width - doc.page.margins.left - doc.page.margins.right;
        const colWidth = contentWidth / 2;

        drawTable(doc, margin, tableTop, [colWidth, colWidth], ["Indikator", "Nilai"], rows);

        doc.end();
    };