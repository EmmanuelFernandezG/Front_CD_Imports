import React, { useEffect, useState } from 'react'
import { DataGrid } from '@mui/x-data-grid'
import ClientesService from '../../service/ClientesService';
import { CircularProgress , Hidden, Stack } from '@mui/material';
import '../../Componentes/button.css'
import { gruposColsSocPlanta } from './material_reutilizable_planta';
import { registerLocale } from 'react-datepicker';

function Soc_Planta() {
    const [tablatemp , settablatemp] = useState([]);
    const [listProveedores, setlistProveedores] = useState([]);
    const [bufferPlanta,setbufferPlanta] =useState([]);
    const [existe, setexiste] = useState(false);
    const [loading, setLoading] = useState(false);
    const [SocPlanta,setSocPlanta] = useState([])
    const [ancho, setAncho] = useState(window.screen.width);
    const [tabla1, settabla1] = useState(false);
    const [vistaRegistro, setvistaRegistro] = useState(false);
    const [Registro,setRegistro]= useState([]);
    const [sortModel, setSortModel] = React.useState([
       {
         field: "fecha_de_creacion",
         sort: "desc",
       },
    ]);
    const opciones = { day: "2-digit", month: "2-digit", year: "numeric", timeZone: "UTC" };
    useEffect(() => {
        const detectarCambio = () => {
          setAncho(window.screen.width);
        };
        window.addEventListener("resize", detectarCambio);
        return () => {
          window.removeEventListener("resize", detectarCambio);
        };
      }, []);
  
const complementar = (dataSoc_planta, data_Buffer) => {
  const resultado = dataSoc_planta.map(element => {
    const found = data_Buffer.find( elementBuffer => Number(elementBuffer.po_th) === Number(element.po) || Number(elementBuffer.po) === Number(element.po));
    return { ...element, ...found };
  });
  settablatemp(resultado);
};

useEffect(() => {
  const fetchData = async () => {
    setLoading(true);
    try {
      const [resProveedores, resBuffer , resSocplanta] = await Promise.all([
        ClientesService.getproveedoresall(),
        ClientesService.get_bufferSinTots(),
        ClientesService.get_soc_planta()
      ]);
      setlistProveedores(resProveedores.data);
      setbufferPlanta(resBuffer.data);
      complementar(resSocplanta.data , resBuffer.data )
      setSocPlanta(resSocplanta.data)
    } catch (error) {
      console.error('Error al cargar los datos:', error);
    } finally {
      setLoading(false);
      settabla1(true);
    }
  };
  fetchData();
}, []);

const actualizar_Bases = async () => {
  setLoading(true);
  try {
    await ClientesService.actualizarBasesPlanta();
  } catch (err) {
    console.error("Error en la actualización:", err);
  } finally {
    alert("Bases Actualizadas");
    setLoading(false);
  }
};


const columns_Soc_planta = [
        { field: 'fecha_de_creacion', headerName: 'Creacion',headerClassName: "gris" },
        { field: 'po_th', headerName: 'PO',headerClassName: "gris" , valueGetter: (value, row) => {
    if (!value || value.toString().trim() === '') {
      return row.po;
    }
    return value; }},
        { field: 'po', headerName: 'PO TH',headerClassName: "gris"},
        { field: 'prov', headerName: 'Fabrica',headerClassName: "gris"},
        { field: 'comprador', headerName: 'Comprador',headerClassName: "gris"},
        { field: 'confirmador', headerName: 'Confirmador',headerClassName: "gris"},
        { field: 'colocador', headerName: 'Colocador',headerClassName: "ama  "},
        { field: 'no_de_proveedor', headerName: 'No. De Proveedor',headerClassName: "gris"},
        { field: 'proveedor', headerName: 'PROVEEDOR',headerClassName: "gris"},
        { field: 'tipo', headerName: 'Tipo',headerClassName: "gris"},
        { field: 'revisado', headerName: 'Revisado ( DG )',headerClassName: "gris"},
        { field: 'urgente', headerName: 'Urgente',headerClassName: "trial"},
        { field: 'codigo', headerName: 'Código',headerClassName: "gris"},
        { field: 'clave', headerName: 'Clave',headerClassName: "gris"},
        { field: 'etd' , type: "date", headerName: 'ETD',headerClassName: "gris", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'fecha_inicial_sap', type: "date", headerName: 'Fecha Inicial ', headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'fecha_final_sap', type: "date", headerName: 'Fecha Final',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'inicio_proceso_cd', type: "date" , headerName: ' Inicio  proceso CD',headerClassName: "verde", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'tiempo_real_cd', headerName: 'Tiempo Real',headerClassName: "ama"},
        { field: 'fecha_inicial_colocacion', type: "date", headerName: 'Fecha Inicial ',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'fecha_final_colocacion', type: "date", headerName: 'Fecha Final',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'tiempo_real_colocacion', headerName: 'Tiempo Real',headerClassName: "ama"},
        { field: 'comentarios_colocacion', headerName: 'Comentarios CD',headerClassName: "rojooscuro"},
        { field: 'fecha_inicial_compras', type: "date", headerName: 'Fecha Inicial ',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'fecha_final_compras', type: "date", headerName: 'Fecha Final',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'tiempo_real_compras', headerName: 'Tiempo Real',headerClassName: "ama"},
        { field: 'comentarios_compras', headerName: 'Comentarios CD',headerClassName: "rojooscuro"},
        { field: 'fecha_inicial_planeacion', type: "date", headerName: 'Fecha Inicial ',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'fecha_final_planeacion', type: "date", headerName: 'Fecha Final',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'tiempo_real_planeacion', headerName: 'Tiempo Real',headerClassName: "ama"},
        { field: 'comentarios_planeacion', headerName: 'Comentarios CD',headerClassName: "rojooscuro"},
        { field: 'fecha_inicial_dircompras', type: "date", headerName: 'Fecha Inicial ',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'fecha_final_dircompras', type: "date", headerName: 'Fecha Final',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'tiempo_real_dircompras', headerName: 'Tiempo Real',headerClassName: "ama"},
        { field: 'comentarios_dircompras', headerName: 'Comentarios CD',headerClassName: "rojooscuro"},
        { field: 'fecha_inicial_mp', type: "date", headerName: 'Fecha Inicial ',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'fecha_final_mp', type: "date", headerName: 'Fecha Final',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'tiempo_real_mp', headerName: 'Tiempo Real',headerClassName: "ama"},
        { field: 'comentarios_mp', headerName: 'Comentarios CD',headerClassName: "rojooscuro"},
        { field: 'fecha_inicial_dg', type: "date", headerName: 'Fecha Inicial',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'fecha_final_dg', type: "date", headerName: 'Fecha final',headerClassName: "ama", valueFormatter: (params) => params ? new Date(params).toLocaleDateString("es-MX", opciones) : '-' },
        { field: 'tiempo_real_dg', headerName: 'Tiempo real',headerClassName: "ama"},
        { field: 'comentarios_dg', headerName: 'Comentarios CD',headerClassName: "rojooscuro"},
        { field: 'enviada', headerName: 'ENVIADA', headerClassName:'trial'},
        { field: 'er_comentario', headerName: 'ER',headerClassName:'rojooscuro'},
        { field: 'motivo_de_revisado', headerName: 'Motivo de Revisado', headerClassName:'trial'},
        { field: 'status', headerName: 'Status',headerClassName:'sap'},
        { field: 'días_totales_proceso', headerName: 'Días totales proceso',headerClassName:'sap'},
        {field:''},
        { field: 'observaciones_cd', headerName: 'Observaciones CD',headerClassName:'gris'},
        { field: 'correos_bu', headerName: 'correos BU'},
        { field: 'correos_confirmador', headerName: 'CORREOS CONFIRMADOR'},
        { field: 'correos', headerName: 'CORREOS'},
        { field: 'control_interno', headerName: 'Control Interno'},
]

const cambiofila = (e) => {
  // poner post hacia DB
  console.log(e);
}
const nuevo_modificar_Po = (e) => {
  console.log(tablatemp)
   const existe_en_Soc = tablatemp.find(elementotabla =>  Number(elementotabla.po_th) === Number(e) || Number(elementotabla.po) === Number(e) ); 
    if (existe_en_Soc !== undefined){
         settabla1(false);
         setvistaRegistro(true);
         setRegistro(existe_en_Soc)
         setexiste(true)
     }else{
         settabla1(false);
         setvistaRegistro(true);      
         setexiste(false)
     }
}
  return ( 
  <div> 
  {loading ? ( <div style={{padding:'25%'}}> <CircularProgress/><label>Actualizando</label>  </div> ) 
  : (
    <div style={{ display: tabla1 === false ? 'none': '', marginTop: '2%' }}>
        <Stack direction='row' spacing={2}>
          <input  type='number'  id='miInput' placeholder='Digita PO / PO TH'  onChange={(e)=>{if (e.target.value.length === 7) {nuevo_modificar_Po(e.target.value)}}} />
            <button style={{width:'15%'}} onClick={()=>{actualizar_Bases()}} className='btn btn-success'>Actuaizar Bases Planta</button> 
        </Stack>
    {/* <div style={{marginLeft:Number(ancho) < 2000 ? '-10%' :'-40%', marginTop:'5%' , width:ancho + 'px' , height:alto + 'px'}}> */}
<div style={{marginTop:'1%', width:"90vw"  , marginLeft: ancho >= 1290 ? 'calc(-16vw)' : 'calc(-4vw)' ,height:'35vw' }}>
    <DataGrid 
        columns={columns_Soc_planta} 
        rows={tablatemp}
        processRowUpdate={(e)=>{cambiofila(e)}}
        columnGroupingModel={gruposColsSocPlanta}
        sortModel={sortModel}
        columnVisibilityModel={{ fecha_de_creacion: false }}
        >
    </DataGrid>
    </div>
    </div>
)
}
                 {/* Vista de Registro Nuevo  */}
  <div style={{marginTop:'2vw',display:vistaRegistro === false ? 'none' : ''}}>
      <form onSubmit={(e) => e.preventDefault()} className="container max-w-lg p-4 bg-white rounded shadow-sm border">
        <div className="pb-4 mb-4 border-bottom">
          <h3 className="h5 text-dark mb-3">{existe ? "Modificar PO" : "Nueva PO"}</h3>
        <div  style={{padding:'1%' , marginLeft:'1%' ,display: 'grid', gridTemplateColumns: 'repeat(7, 1fr)', gap:'1px', textAlign:'left' , minWidth:'70%'  }}>
              <div>
                  <label className="form-label text-secondary small fw-medium">PO</label>
                  <input type="number" className="form-control" value={Registro.po_th === "" ? Registro.po : Registro.po_th} />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">PI</label>
                  <input type="number" className="form-control" value={Registro.po}  />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">Fábrica</label>
                  <input type="text" className="form-control" value={Registro.prov} />
              </div>
              <div style={{width:'auto'}}>
                  <label className="form-label text-secondary small fw-medium">No de Proveedor</label>
                  <input type="text" className="form-control" value={Registro.no_de_proveedor} />
              </div>
              <div style={{width:'auto'}}>
                  <label className="form-label text-secondary small fw-medium">Proveedor</label>
                  <input type="text" className="form-control" value={Registro.proveedor} />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">Revisado</label>
                  <input type="text" className="form-control" value={Registro.revisado} />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">Urgente</label>
                  <input type="text" className="form-control" value={Registro.urgente} />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">Código</label>
                  <input type="text" className="form-control" value={Registro.codigo} />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">Clave</label>
                  <input type="text" className="form-control" value={Registro.clave} />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">Comprador</label>
                  <input type="text" className="form-control" value={Registro.comprador} />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">Confirmador</label>
                  <input type="text" className="form-control" value={Registro.confirmador} />
              </div>
              <div>
                  <label className="form-label text-secondary small fw-medium">Colocador</label>
                  <input type="text" className="form-control" value={Registro.colocador} />
              </div>

        </div>
        </div>

        <div className="pb-4 mb-4 border-bottom">
          <h3 className="h5 text-dark mb-3">2. Fechas</h3>
          <div className="row g-3">
            <div className="col-12 col-md-6">
              <label className="form-label text-secondary small fw-medium">Fecha de Inicio</label>
              <input type="date" className="form-control" />
            </div>
            <div className="col-12 col-md-6">
              <label className="form-label text-secondary small fw-medium">Fecha de Término</label>
              <input type="date" className="form-control" />
            </div>
          </div>
        </div>

        <div className="mb-4">
          <h3 className="h5 text-dark mb-3">3. Estatus</h3>
          <div className="col-12">
            <label className="form-label text-secondary small fw-medium">Estatus Actual</label>
            <select className="form-select">
              <option value="activo">Activo</option>
              <option value="pendiente">Pendiente</option>
              <option value="inactivo">Inactivo</option>
            </select>
          </div>
        </div>

        <button type="submit" className="btn btn-primary w-100 fw-bold">
          Guardar Cambios
        </button>

      </form>
  </div>
</div>
)
}
export default Soc_Planta