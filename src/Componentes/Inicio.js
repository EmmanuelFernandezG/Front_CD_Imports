import React, { useEffect, useState } from 'react'
import Clienteservice from '../service/ClientesService';
import { Link , useNavigate } from 'react-router-dom';
import Stack from '@mui/material/Stack';
import ListaComponentes from './ListaComponentes';
import {DataGrid } from "@mui/x-data-grid";

export const Inicio = () => {

  const [ultimos3,setultimos3]= useState({})
  const navigate = useNavigate();
  const direc = (e) =>{
        navigate('/record/clientes' , {state:{e: e.target.value}});

  } 
  const perfillocalusuario = localStorage.getItem('perfil')

  const opciones = { day: "2-digit", month: "2-digit", year: "numeric" };

const columns = [
  {
    field: 'fecha_inicio',
    headerClassName: "gris",
    headerName: 'Fecha ',
    width: 150,
    editable: false,
      valueFormatter: (params) => {
        const date = new Date(params).toLocaleDateString("es-MX", opciones);
        return date;
      },
},
  {
    field: 'folio_tt',
    headerClassName: "gris",
    headerName: 'No. PO',
    width: 100,
    editable: false,
  },
  {
    field: 'no_oc',
    headerClassName: "gris",
    headerName: 'NO. OC',
    editable: false,
  },
  {
    field: 'area_destino',
    headerClassName: "gris",
    headerName: 'Area Destino',
    sortable: false,
    width: 200,
  },
  {
    headerClassName: "gris",
  },
];

useEffect(() => {
    traerultimosReg();
  }, []);

  const traerultimosReg = () =>{
    Clienteservice.getporUser().then((response)=>{
      setultimos3(response.data)
    }).catch((error)=>{
      console.log(error)
    })
  };

if(localStorage.getItem('perfil') === "ControlDocumental"){
return (
    <div style={{padding:"7%",width: '60%' }}>
      <span style={{padding:"1%", border: "1px solid black"}}>{localStorage.getItem("username").toUpperCase()}</span>
      <p></p>
      <div style={{width: '100%' }}>
      <DataGrid
        rows={ultimos3}
        columns={columns}
        pageSizeOptions={[]} 
        paginationModel={undefined}
        pagination={false}      />
    </div>
    </div>
  );

}else{
    return (
          <div className='container' >
      <h2 className='text-center'> Recordatorios </h2>
      
      <div className="imgbox">
      </div>      
      <br></br>
      {perfillocalusuario === "admin" ? 
      <Link to="/record/add-Clientes" className='btn btn-secondary mb-1'>Agregar Recordatorio</Link>
      :
      <h5></h5>        
    }
       <Stack className='btn btn-warning' direction="column" height={180} spacing={2} style={{backgroundColor:'ButtonShadow'}}>
          <h3 className='text-center'> Dirección </h3>
        <Stack direction='row' spacing={2}>

            <button  className="button-10" onClick={e => {direc(e)}} value ="Importaciones" role="button">
              Importaciones
            </button>
            <button  className="button-10" onClick={e => {direc(e)}} value ="Exportaciones" role="button">
              Exportaciones
            </button>

            <button  className="button-10" onClick={e => {direc(e)}} value ="Planta" role="button">
              Planta
            </button>
          </Stack>
        </Stack>
        <div className="imgbox"></div>
    </div>


  )
}}
export default Inicio;