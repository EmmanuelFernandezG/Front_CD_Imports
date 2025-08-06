import React, { useState } from 'react';
import ClientesService from '../../service/ClientesService';
import { responsiveFontSizes, Stack } from '@mui/material';
import { BUs , colocador ,ordenador } from '../materialReutilizable/RangosReusables';
import CircularProgress from "@mui/material/CircularProgress";
import TablaHistorialSOC from './tablaHistorialSOC';

function Socs() {
    const [sololectura, setsololectura] = useState(true)
    const [inicial, setinicial] = useState(true)
    const[popi, setpopi] = useState()
    const [tipoOb, settipoOb] = useState(false);
    const [registro,setregistro] = useState({});
    const [Soc,setSoc] = useState({});
    const [loading, setLoading] = useState(false);  
    const [colocadorotro,setColocadorotro] = useState(true);
    const [monedavisi,setMonedavisi] = useState(true);
    const [tablahistorial,settablahistorial] = useState(true);
    const [historialSOC , sethistorialSOC] = useState([]);
    const [RegistroHistorialSoc, setRegistroHistorialSoc] = useState({})
  const [visibilidadSOC,setvisibilidadSOC] = useState(true)    
    const GetSocR = () => {
            setLoading(true)
      setvisibilidadSOC(true)
      setinicial(false);
            ClientesService.getsocsR(popi).then((response)=>{
              if(response.data !==null){
                setregistro(response.data)
                            setLoading(false)
                  ClientesService.getHistorialSoc(response.data.nooc).then((rsp)=>{
                    sethistorialSOC(rsp.data)
                  }).catch((err)=>{
                    console.log(err)
                  });
                setpopi("")
                  settipoOb(false)
              }else
                {
                  if(popi.startsWith("1")){
                    setregistro({ ...registro, nooc: popi })
                  }else if (popi.startsWith("8")){
                  setregistro({ ...registro, foliott: popi })
                }
                  settipoOb(true);
                  setpopi("")
              }
              setregistro(prev => ({
                ...prev,
                status_problema: "- - - - - - - - -",
                fecha_de_reciboactrlpos: new Date().toISOString().split("T")[0]
              }));
            }).catch((error)=>{
                console.log(error)
            })
    }
    const crearhistSoc = (e) =>{
          const hoy = new Date().toISOString().split("T")[0] ;
      setRegistroHistorialSoc({...RegistroHistorialSoc, 
        ["registro"]: hoy ,
        ["foliott"]: registro.foliott ,
        ["nooc"]: registro.nooc,
        ["unidadde_negocio"]: registro.unidad_de_negocio,
        [e.target.id] : e.target.value
      } )
    }
    const listarhistoriaSoc = () =>{
      setinicial(true)
      setLoading(true)
      ClientesService.getSocHistorial().then((response)=>{
        setSoc(response.data)
        setvisibilidadSOC(false)
         setLoading(false);
      }).catch((error)=>{
        console.log(error)
      })
    }
    const Guardar =  ()=>{
         if (tipoOb){
            ClientesService.postNuevoSOC(registro).then((response)=>{
              alert("Registro Guardado " + registro.foliott )
                setregistro({})
                  window.location.reload()
              }).catch((error)=>{
                console.log(error)
              })
         }else{
           ClientesService.putNuevoSOC(registro.id, registro).then((response)=>{
             alert("Registro Guardado " + registro.foliott )
             setregistro({})
                     window.location.reload()

           }).catch((error)=>{
             console.log(error);
           })
         }
    }

    const prov_familia = (i)=>{
        if (i.target.id === "no_de_proveedor"){
            ClientesService.getProveedor(i.target.value).then((response)=>{
                  setregistro({ ...registro, ...response.data})      
            }).catch((error)=>{
              console.log(error)
            });
        }else if ( i.target.id  === "primer_item"){
              ClientesService.getFamilia(i.target.value).then((response)=>{
                  setregistro({ ...registro, ...response.data})      
              }).catch((error)=>{
                console.log(error)
              })
        }
    };
        const handleKeyPress = (event) => {
      if(event.key === 'Enter'){
        GetSocR();
      }
    }
    const ActualizarRegistro = (e , nume) =>{
      if  (e.target.id === "monto_de_po") {
        setregistro({ ...registro, [e.target.id]:  nume })
      }else{
      setregistro({ ...registro, [e.target.id]:  e.target.value })
    }}
    const Limpiar = () =>{
        window.location.reload()
    }

    const guardarHistorialSoc = ()=>{
       ClientesService.postHistorialSOC(RegistroHistorialSoc).then((response)=>{
           sethistorialSOC((prev) => [...prev, response.data]);
           setRegistroHistorialSoc({ comentarios: ""});
        }).catch((error)=>{
          console.log(error)
        })
    }
    const fechaformat = () =>{
    const hoy = new Date();
const dia = String(hoy.getDate()).padStart(2, '0');
const mes = String(hoy.getMonth() + 1).padStart(2, '0');
const anio = String(hoy.getFullYear()).slice(-2); // últimos 2 dígitos
const fechaFormateada = `${dia}.${mes}.${anio}`;
return  fechaFormateada;
}

if (loading) {
  return (
    <div style={{
      position: "fixed",
      top: "50%",
      left: "50%",
      transform: "translate(-50%, -50%)",
      display: "flex",
      flexDirection: "column",
      alignItems: "center",
      backgroundColor: "rgba(255,255,255,0.9)",
      padding: "30px",
      borderRadius: "12px",
      boxShadow: "0 0 15px rgba(0,0,0,0.2)",
      zIndex: 9999
    }}>
      <CircularProgress />
      <p style={{ marginTop: "12px", fontWeight: "bold" }}>Actualizando...</p>
    </div>
  );
}
    return (
    <div style={{padding:"3%"}}>
        <input type='number' onChange={(e)=>{setpopi(e.target.value)}} value={popi} onKeyPress={handleKeyPress}  ></input>
        <button  style={{marginLeft:"1%"}} className='btn btn-success' onClick={()=>{GetSocR()}} >Buscar PO o PI</button>
        <button  style={{marginLeft:"1%"}} className='btn btn-danger' onClick={()=>{listarhistoriaSoc()}} >Tabla SOC </button>
<hr></hr>
<Stack spacing={3} direction="row">
</Stack>
<div hidden={inicial} className="border border-dark-subtle p-3 bg-light rounded shadow-sm">
  <Stack direction="row" >
    <div style={{width:"100%"}}>
    <span><b>No OC:</b></span> 
    <input type='number' readOnly={inicial} onChange={(e) => ActualizarRegistro(e)}  id='nooc' defaultValue={registro.nooc}/> 
    <span style={{marginLeft:"2%"}}><b>Folio TT:</b></span> 
    <input type='number' readOnly={inicial}  onChange={(e) => ActualizarRegistro(e)}  id='foliott' defaultValue={registro.foliott}/>
    </div>
    <div style={{width:"100%"}}>
  <span style={{marginLeft:"11%" , fontSize:"34px"}} hidden={inicial}><b>{registro.foliott === "" ? "No.OC. " + registro.nooc : "Folio TT. " + registro.foliott}</b></span>
      </div>
</Stack>
    <br></br>
  <div hidden={inicial} className="row mb-3">
    <div className="col-md-3">
      <label htmlFor="fecha_de_reciboactrlpos" className="form-label fw-bold">Fecha de Recepción de PO</label>
      <input type="date"  onChange={(e) => ActualizarRegistro(e)}  id="fecha_de_reciboactrlpos" className="form-control" value={registro.fecha_de_reciboactrlpos}/>
    </div>

    <div className="col-md-5">
      <div className="mb-2 d-flex align-items-center justify-content-between">
        <label className="form-label fw-bold">Ordenador</label>
        <select className="form-select w-50"  onChange={(e) => ActualizarRegistro(e)}  id='status_problema'>
          <option>{registro.status_problema}</option>
        {ordenador.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
        </select>
      </div>
      <input type="text" className="form-control mt-2"  onChange={(e) => ActualizarRegistro(e)}  id='reporte_con_problemas' defaultValue={registro.reporte_con_problemas} />
    </div>

    <div className="col-md-4">
      <Stack direction="row">
      <Stack>
      <label htmlFor="unidad_de_negocio" className="form-label fw-bold">Unidad de Negocio</label>
      <select  onChange={(e) => ActualizarRegistro(e)}  id="unidad_de_negocio" className="form-select w-100">
        <option>{registro.unidad_de_negocio}</option>
        {BUs.map((item) => (
          <option key={item} value={item}>
            {item}
          </option>
        ))}
      </select>
      </Stack> &nbsp;
          <Stack border="dotted gray 1px" style={{width:"30%",marginLeft:"10%" , alignItems:"center"  , height:"300px"}} direction="column">
            <br></br><br></br>
            <button  style={{marginTop:"10%"}} onClick={()=>{Guardar()}} className='btn btn-success'> Guardar </button>
            <button style={{marginTop:"10%"}} onClick={()=>{ Limpiar()}} className='btn btn-secondary'> Limpiar </button>          
        </Stack>
      </Stack>
    </div>
        <Stack direction="row" sx={{marginTop:"-16%", marginBottom:"2%", padding:"1%", width:"100%", width:"85%" , outline:"dotted gray 1px"}}>
                <Stack  direction="column" sx={{width:"30%" , alignItems:"initial"}}>          
                      <Stack direction="row">
                      <Stack>
                          <label for="monto_po" style={{width:"130px"}} >Monto PO.</label> 
                          {/* <input type='number' style={{marginLeft:"1%"}}  onChange={(e) => ActualizarRegistro(e)}  id='monto_de_po' defaultValue={registro.monto_de_po}/ > */}
                          <Stack direction="column">
                            <input className='input-group mb-1' style={{width:"120px"}} title="SOLO PERMITE PEGAR" onKeyDown={(e) => {
                                                  const isPaste = (e.ctrlKey || e.metaKey) && e.key.toLowerCase() === 'v';
                                                  const isTab = e.key === 'Tab';
                                                  if (!isPaste && !isTab) {
                                                  e.preventDefault();
                                                  }}}
                          onPaste={(e) => {
                            const textoPegado = e.clipboardData.getData('text');
                            const textoLimpio = textoPegado.replace(/[^\d.,]/g, '');
                            const regex = /^(\d{1,3}(,\d{3})*|\d+)(\.\d{1,2})?$/;
                            if (regex.test(textoLimpio)) {
                              const numero = textoLimpio.replace(/,/g, '');
                              ActualizarRegistro(e, numero);
                              e.preventDefault();
                            } else {
                              e.preventDefault();}}}  id="monto_de_po"  value={registro.monto_de_po === undefined ? '' : Number(registro.monto_de_po).toLocaleString("es-MX", {
                              style: "currency",currency: "MXN"})} />
                           </Stack>
                           </Stack>
                           <Stack style={{marginLeft:"4%"}}>
                            <label  style={{marginLeft:"2%"}} for="moneda" >   Moneda </label>
                            <select onChange={(e)=> { e.target.value ==="OTRA" ? setMonedavisi(false) : ActualizarRegistro(e)  }} className="form-select" style={{marginLeft:"3%", marginTop:"1%", width:"100%"}} id='moneda'>
                                  <option>{registro.moneda}</option>
                                  <option> -----</option>
                                  <option> MXN</option>
                                  <option> USD</option>
                                  <option> CNY</option>
                                  <option> TWD</option>
                                  <option> EUR</option>
                                  <option> CHF</option>
                                  <option> OTRA</option>
                            </select>
                            <input hidden={monedavisi}  onChange={(e) => ActualizarRegistro(e)}  id='moneda' style={{ marginLeft:"1%", width:"70%"}} />
                          </Stack>
                       </Stack> 
                      <Stack direction="row" style={{marginTop:"1%"}}>
                          <Stack direction="column">
                          <label for="pto_envio">P. Emb.</label>
                          <input style={{marginLeft:"2%", width:"120px"}} onChange={(e) => ActualizarRegistro(e)} className='input-group mb-1'  id='puerto_de_embarque' defaultValue={registro.puerto_de_embarque}/>
                          </Stack>
                          <Stack direction="column" style={{marginLeft:"4%"}}>
                          <label for="colocador" style={{marginTop:"1%"}}>Colocador </label>
                            <select onChange={(e)=> { e.target.value ==="OTRO" ? setColocadorotro(false) : ActualizarRegistro(e)  }} style={{marginLeft:"1%", marginTop:"1%"}} id='colocador' className="form-select w-100">  
                                  <option>{registro.colocador}</option>
                                  {colocador.map((item) => (
                                  <option key={item} value={item}>
                                        {item}
                                  </option>
                                  ))} 
                            </select>
                            <input hidden={colocadorotro}  onChange={(e) => ActualizarRegistro(e)}  id='colocador' style={{ marginLeft:"1%", width:"70%"}} />
                          </Stack>
                       </Stack>                           
                  </Stack>
                  <Stack  style={{marginLeft:"3%", width:"100%" }}>
                      <Stack  direction="row" style={{backgroundColor:"yellow"}} >
                  </Stack>
                <Stack style={{marginTop:"1%" }} direction="row">
                          <label style={{marginLeft:"8%"}}  >Proveedor </label>
                          <input style={{ marginLeft:"3%"}}  type='number'  onChange={(e) => ActualizarRegistro(e)} onBlur={(i)=>{prov_familia(i)}} id='no_de_proveedor' defaultValue={registro.no_de_proveedor}/>
                          <input readOnly type='text' style={{width:"50%"}}  id='proveedor' defaultValue={registro.proveedor} />
                </Stack>
                <Stack style={{marginTop:"1%"}} direction="row">
                          <label  style={{marginLeft:"2%"}} >Termino de Pago </label>
                          <input style={{marginLeft:"3%" , width:"72%"}} type='text'  onChange={(e) => ActualizarRegistro(e)}  id='terminos_de_pago' value={registro.terminos_de_pago} />
                </Stack>
                <Stack style={{marginTop:"1%"}} direction="row">
                          <label  >1er. Item de la O.C. </label>
                          <input   style={{marginLeft:"3%"}} type='number'   onBlur={(i)=>{prov_familia(i)}} id='primer_item' />
                          <input type='text' style={{width:"50%"}} id='familia_del_producto' defaultValue={registro.familia_del_producto} />
                </Stack>
                <label style={{margin:"1%"}}> Es Full Container
              <input id='full' style={{ marginTop: "1%", marginLeft: "5%" }} type="checkbox" checked={registro.full === "F"} onChange={(e) => setregistro({ ...registro, full: e.target.checked ? "F" : "" })}/> </label>
              </Stack>
            </Stack>
<hr></hr>
<Stack direction="column">
<Stack spacing={3} direction="row" >
   <Stack direction="column">
        <label>Emision de la O.C.</label>
        <input  onChange={(e) => ActualizarRegistro(e)}  id='fecha_de_emisionoc' type='date'  defaultValue={registro.fecha_de_emisionoc}/ >
   </Stack>
   <Stack direction="column">
        <label>Embarque de la O.C.</label>
        <input  onChange={(e) => ActualizarRegistro(e)}  id='fecha_de_embarque_de_laoc' type='date' defaultValue={registro.fecha_de_embarque_de_laoc}/ >
   </Stack> 
       <Stack direction="column">
        <label>Control Interno</label>
        <select  onChange={(e) => ActualizarRegistro(e)}  id="control_interno" >
          <option>{registro.control_interno}</option>
          <option>------------</option>
          <option>Colocación</option>
          <option>Dir. Compras</option>
          <option>Dir. Planeación</option>
          <option>Gest.Documental</option>
          <option>SAP</option>
          <option>Análisis de la Demanda</option>
        </select>
   </Stack>     
    <Stack direction="column">
        <label>Status del Embarque</label>
        <select   onChange={(e) => ActualizarRegistro(e)}  id="status_de_embarque" >
          <option>{registro.status_de_embarque}</option>
          <option>------------</option>
          <option>A</option>
          <option>C</option>
          <option>X</option>
        </select>
   </Stack>     
   </Stack>    
      <Stack direction="row">
        <Stack direction="row">
            <Stack direction="column">
                  <label>Fecha Revisado                   
                    <input  onChange={(e) => ActualizarRegistro(e)}  id='rea' style={{marginLeft:"2%", width:"10%"}} defaultValue={registro.rea}/>
                  <label style={{marginLeft:"2%"}}>EA</label>
                  <input style={{marginLeft:"2%"}} hidden={registro.rea === "EA" ? false :true}  id='ea' type='checkbox' checked={registro.rea === "EA" ? true :false}/>
           </label>
                  <input  onChange={(e) => ActualizarRegistro(e)}  id='fecha_de_emisionrea' type='date' defaultValue={registro.fecha_de_emisionrea}  style={{width:"50%"}} / >
            </Stack>
          </Stack>
    <Stack style={{marginLeft:"-5%" , marginTop:".5%"}} direction="column">
        <label>Envío de la O.</label>
        <input  onChange={(e) => ActualizarRegistro(e)}  id='envio_de_laocal_proveedoreoc' type='date' defaultValue={registro.envio_de_laocal_proveedoreoc}  style={{width:"130%",marginTop:"6%"}} / >
   </Stack>     
   </Stack>     

</Stack>
<Stack spacing={3} direction="row" sx={{ margin:"1%"}}>

    <Stack direction="column" sx={{width:"30%"}}>

          <label>Observaciones</label>
          <Stack spacing={3} direction="row" >

            <textarea readOnly={sololectura} style={{width:"1500px"}} onChange={(e) => ActualizarRegistro(e)} id='observaciones' value={registro.observaciones} > </textarea>
            </Stack>
              <div style={{padding:"5%"}}>                    
              <button className='btn btn-success' onClick={() => {setregistro({ ...registro, observaciones: fechaformat() + " " }); setsololectura(false);}} style={{ height:"100%" }} >Insertar Fecha</button>
            </div>
    </Stack>
</Stack>
<hr></hr>
<h6>Historial</h6>                                                      {/* // crear estado para el Historial */}
<Stack spacing={3} direction="row" sx={{padding:"2%"}}>
    <Stack direction="column" sx={{width:"30%"}}>
            <textarea id='comentarios' onChange={(e)=>{crearhistSoc(e)}} value={RegistroHistorialSoc.comentarios} ></textarea>
<Stack direction="row"  >            
  <Stack direction="row" spacing={3} sx={{marginTop:"10%" , marginLeft:"2%"}}>
            <button style={{height:"50%"}}  id='registrarhist' className='btn btn-secondary' onClick={()=>{ guardarHistorialSoc()}}> Registrar</button>
              <button   style={{height:"50%"}}   onClick={()=>{Guardar()}} className='btn btn-success'> Guardar </button>
   </Stack>
   <span style={{margin:"10%"}} >Ver Historial </span>
   <input type='checkbox' onClick={()=> tablahistorial === false ? settablahistorial(true) : settablahistorial(false)} defaultChecked={false}/>
</Stack>
    </Stack>
<Stack sx={{width:"60%"}}>
<table hidden={tablahistorial} className="table table-striped table-bordered table-hover">
  <thead>
    <tr>
      <th scope="col">Registro</th>
      <th scope="col">Unidad de Negocio</th>
      <th scope="col">Comentarios</th>
    </tr>
  </thead>
  <tbody>
            {historialSOC.length === undefined ? "" : historialSOC.map((item,index) => (
              <tr  style={{ padding: "4px 8px",  border:"solid 1px" }} key={index}>
                  <td style={{ width:"20%", padding: "4px 8px", border:"solid 1px" }}>
                    {(() => {
                      const fecha = new Date(item.registro + "T00:00:00");
                      const dia = String(fecha.getDate()).padStart(2, '0');
                      const mes = String(fecha.getMonth() + 1).padStart(2, '0'); // +1 porque enero = 0
                      const anio = fecha.getFullYear();
                      return `${dia}/${mes}/${anio}`;
                    })()}
                  </td>
                  <td style={{ width:"30%", padding: "4px 8px" , border:"solid 1px " }}>{item.unidadde_negocio}</td>
                  <td style={{ width:"100%", padding: "4px 8px" , border:"solid 1px " }}>{item.comentarios}</td>
              </tr>
            ))}
  </tbody>
</table>
</Stack>
</Stack>
  </div>
</div>
<div hidden={visibilidadSOC} >
<TablaHistorialSOC datos={Soc} />
</div>    
    </div>
  )
}

export default Socs