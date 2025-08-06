import { DataGrid } from '@mui/x-data-grid';
import { useState, useEffect } from 'react';
import { Box, TextField } from '@mui/material';
import { ExportarExcel } from '../materialReutilizable/ExportarExcel'

export default function TablaHistorialSOC({ datos }) {
  const [filasOriginales, setFilasOriginales] = useState([]);
  const [filasFiltradas, setFilasFiltradas] = useState([]);

  // Estados para los filtros
  const [filtroColocador, setFiltroColocador] = useState('');
  const [filtroMoneda, setFiltroMoneda] = useState('');

  useEffect(() => {
    if (datos && datos.length > 0) {
      setFilasOriginales(datos);
    }
  }, [datos]);

    useEffect(() => {
    let filtradas = filasOriginales;

    if (filtroColocador.trim() !== '') {
      filtradas = filtradas.filter((fila) =>
        fila.colocador?.toLowerCase().includes(filtroColocador.toLowerCase())
      );
    }

    if (filtroMoneda.trim() !== '') {
      filtradas = filtradas.filter((fila) =>
        fila.moneda?.toLowerCase().includes(filtroMoneda.toLowerCase())
      );
    }

    setFilasFiltradas(filtradas);
  }, [filasOriginales, filtroColocador, filtroMoneda]);
  const [sortModel, setSortModel] = useState([
    {
      field: "fecha_de_reciboactrlpos",
      sort: "desc",
    },
  ]);
  const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };
  const columns = [
    { field: 'fecha_de_reciboactrlpos', headerName: 'Fecha Recibo Ctrl POS', width: 160 , valueFormatter: (params) => {
        const date = new Date(params).toLocaleDateString("es-MX", opciones);
        return date;
      }, headerClassName: "gris",},
    { field: 'status_problema', headerName: 'Status Problema', width: 130  , headerClassName: "gris",},
    { field: 'unidad_de_negocio', headerName: 'Unidad Negocio', width: 130, headerClassName: "gris"},
    { field: 'no_de_proveedor', headerName: 'No. Proveedor', width: 110, headerClassName: "gris"},
    { field: 'foliott', headerName: 'Folio TT', width: 90, headerClassName: "gris"},
    { field: 'nooc', headerName: 'No. OC', width: 90, headerClassName: "gris"},
    { field: 'familia_del_producto', headerName: 'Familia Producto', width: 120, headerClassName: "gris"},
    { field: 'full', headerName: 'Full', width: 90, headerClassName: "gris"},
    { field: 'fecha_de_emisionoc', headerName: 'Fecha Emisión OC', width: 120 , valueFormatter: (params) => {
        const date = new Date(params).toLocaleDateString("es-MX", opciones);
        return date;
     }, headerClassName: "gris"},
    { field: 'rea', headerName: 'REA', width: 90, headerClassName: "gris"},
    { field: 'fecha_de_emisionrea', headerName: 'Fecha Emisión REA', width: 120 , valueFormatter: (params) => {
        const date = new Date(params).toLocaleDateString("es-MX", opciones);
        return date;
     }, headerClassName: "gris"},
    { field: 'fecha_de_embarque_de_laoc', headerName: 'Fecha Embarque OC', width: 140 , valueFormatter: (params) => {
        const date = new Date(params).toLocaleDateString("es-MX", opciones);
        return date;
     }, headerClassName: "gris"},
    { field: 'envio_de_laocal_proveedoreoc', headerName: 'Envío Local Proveedor OC', width: 180 , valueFormatter: (params) => {
        const date = new Date(params).toLocaleDateString("es-MX", opciones);
        return date;
    }, headerClassName: "gris"},
    { field: 'recepcion_de_la_proformarp', headerName: 'Recepción Proforma RP', width: 150, headerClassName: "gris"},
    { field: 'envio_de_proforma_autorizadaaproveedor', headerName: 'Envío Proforma Autorizada', width: 180, headerClassName: "gris"},
    { field: 'confirmacion_de_proforma_por_parte_del_proveedor', headerName: 'Confirmacion Proforma Proveedor', width: 180, headerClassName: "gris"},
    { field: 'promesa_de_embarque_proforma', headerName: 'Promesa Embarque Proforma', width: 180, headerClassName: "gris"},
    { field: 'control_interno', headerName: 'Control Interno', width: 120, headerClassName: "gris"},
    { field: 'status_de_embarque', headerName: 'Status Embarque', width: 140, headerClassName: "gris"},
    { field: 'observaciones', headerName: 'Observaciones', width: 180, headerClassName: "gris"},
    { field: 'reporte_con_problemas', headerName: 'Reporte Problemas', width: 140, headerClassName: "gris"},
    { field: 'aplica', headerName: 'Aplica', width: 90, headerClassName: "gris"},
    { field: 'colocador', headerName: 'Colocador', width: 90, headerClassName: "gris"},
    { field: 'puerto_de_embarque', headerName: 'Puerto Embarque', width: 140, headerClassName: "gris"},
    { field: 'monto_de_overstock', headerName: 'Monto Overstock', width: 130, headerClassName: "gris"},
    { field: 'monto_de_po', headerName: 'Monto PO', width: 90, headerClassName: "gris"},
    { field: 'moneda', headerName: 'Moneda', width: 90, headerClassName: "gris"},
    { field: 'asistentepos', headerName: 'Asistentepos', width: 90, headerClassName: "gris"},
    { field: 'ubicacion_en_archivo', headerName: 'Ubicación Archivo', width: 150, headerClassName: "gris"},
  ];

  return (
    <Box sx={{ marginLeft: "-10%", width: '120%',
          "& .MuiDataGrid-columnHeaderTitle": {
            whiteSpace: "normal",
            lineHeight: "normal",
          },
          "& .MuiDataGrid-columnHeader": {
            borderBottom: '1px solid #A6A6A6',
             borderRight: '1px solid #A6A6A6',
          },
          "& .MuiDataGrid-columnHeaders": {
            maxHeight: "168px !important",
          },
          "& .MuiDataGrid-cell": {
            borderRight: '1px solid #F2F2F2',  
            borderBottom: '1px solid #F2F2F2', 
          },
        
     }}>
      {/* Filtros */}
      <Box sx={{ display: 'flex', gap: 2, mb: 2 }}>
        <TextField
          label="Filtrar Colocador"
          variant="outlined"
          size="small"
          value={filtroColocador}
          onChange={(e) => setFiltroColocador(e.target.value)}
        />
        <TextField
          label="Filtrar Moneda"
          variant="outlined"
          size="small"
          value={filtroMoneda}
          onChange={(e) => setFiltroMoneda(e.target.value)}
        />
        <ExportarExcel columns={columns} rows={filasFiltradas}/ >
      </Box>

      <Box sx={{ height: 500 }}>
        <DataGrid
          rows={filasFiltradas}
          columns={columns}
          getRowId={(row) => row.id || `${row.nooc}-${row.foliott}`}
          sortModel={sortModel}
          initialState={{
            pagination: {
              paginationModel: { pageSize: 10 },
            },
          }}
          pageSizeOptions={[5, 10, 20]}
        />
      </Box>
    </Box>
  );
}
