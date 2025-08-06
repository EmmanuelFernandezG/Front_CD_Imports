import React from 'react';
import ExcelJS from 'exceljs';
import { saveAs } from 'file-saver';
import { anchos } from './RangosReusables';

export const ExportarExcel = ({ columns = [], rows = [] }) => {
  const exportar = async () => {
    const workbook = new ExcelJS.Workbook();
    const worksheet = workbook.addWorksheet("Datos");
 worksheet.properties.defaultGridlines = false;
    const hoy = new Date();
    const dia = String(hoy.getDate()).padStart(2, '0');
    const mes = String(hoy.getMonth() + 1).padStart(2, '0');
    const anio = hoy.getFullYear();
    const fechaCorta = `${dia}/${mes}/${anio}`;
    worksheet.getCell("A1").value = fechaCorta;
    worksheet.getCell("A1").font = { size: 14, bold: true };
    worksheet.getCell("A1").alignment = { horizontal: 'left' };
    const headerRowNumber = 3;
    const headerRow = worksheet.getRow(headerRowNumber);
    columns.forEach((col, index) => {
      const cell = headerRow.getCell(index + 1);
      cell.value = col.headerName || col.field;
      cell.font = { bold: true };
      cell.fill = {
        type: "pattern",
        pattern: "solid",
        fgColor: { argb: "FF999999" },
      };
      cell.border = {
        top: { style: "thin" },
        left: { style: "thin" },
        bottom: { style: "thin" },
        right: { style: "thin" },
      };
    });

    rows.forEach((rowData, rowIndex) => {
      const row = worksheet.getRow(headerRowNumber + 1 + rowIndex);
      columns.forEach((col, colIndex) => {
        const value = rowData[col.field];
        const cell = row.getCell(colIndex + 1);
        if (col.field.includes("fecha") || col.field.includes("etd_pi") || col.field.includes("etd_po")) {
          cell.value = value ? new Date(value) : null;
          cell.numFmt = 'dd/mm/yyyy';
        } else if (col.field.includes("monto")) {
          cell.value = typeof value === 'number' ? value : parseFloat(value || 0);
          cell.numFmt = '"$"#,##0.00;[Red]\-"$"#,##0.00';
        } else {
          cell.value = value ?? '';
        }
        cell.border = {
          top: { style: "thin" },
          left: { style: "thin" },
          bottom: { style: "thin" },
          right: { style: "thin" },
        };
      });
    });
    worksheet.columns.forEach((col, index) => {
      let max = 10;
      col.eachCell?.((cell) => {
        const len = (cell.value?.toString().length || 10) + 2;
        if (len > max) max = len;
      });
      col.width = anchos[index] ?? max;;
    });

    const buffer = await workbook.xlsx.writeBuffer();
    saveAs(new Blob([buffer]), `reporte_${dia}-${mes}-${anio}.xlsx`);
  };

  return (
    <button className="btn btn-outline-primary" onClick={exportar}>
      Exportar Excel
    </button>
  );
};
