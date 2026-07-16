import { Stack, Switch } from '@mui/material'
import React, { useEffect, useState } from 'react'
import { BUs, familia, Orden_Etd_Cur, Revisados_Masivo, Revisados_Unica, tipos_modif } from '../materialReutilizable/RangosReusables'
import { ContentCopy, CurtainsOutlined, Scale } from '@mui/icons-material'
import '../../Componentes/button.css'
import ClientesService from '../../service/ClientesService'

function FormatoRevisados() {
    const [aplicaSN,setaplicaSN] = useState('');
    const [Arancel,setArancel]= useState([]);
    const [posMasivo,setposMasivo]= useState([]);
    const [verprecios,setverprecios] = useState(true)
    const [provsUnicos,setprovsUnicos]= useState('');
    const [itemsPO, setitemsPO] = useState(false);
    const [preciosPO, setpreciosPO] = useState(false);
    const [tablavisible, settablavisible] = useState('')
    const [clickcambio,setclickcambio]= useState(true);
    const [clickEA,setclickEA]= useState(true);
    const [clicksidocs, setclicksidocs] = useState(true);
    const [tabla, settabla] = useState({visible:true , tipotabla:''});
    const [NoSolped,setNoSolped] = useState(true)    
    const [otro,setotro] = useState(true)    
    const [molde,setmolde] = useState(true)    
    const [filasTab, setfilasTab] = useState(2);
    const [filasinput, setfilasinput] = useState(1);
    const [proveedores, setproveedores ] = useState([]);
    const [contactos, setcontactos ] = useState([]);
    const [precios, setprecios ] = useState([]);
    const [registro, setregistro] = useState([]);
    const [aditem,setaditem] = useState(false);
    const [datosTpPm, setdatosTpPm] = useState([]);
    const [titulosColor,settitulosColor] = useState({Precio:false , Cantidad:false , monto:false , solped:false , um:false , descripcion:false , etd:false  ,termPago:false })
    useEffect(()=>{
        ClientesService.getproveedoresall().then((response)=>{
            setproveedores(response.data)
        }).catch((err)=>{
            console.log(err)
        })
        ClientesService.getcontactosall().then((response)=>{
            setcontactos(response.data)
        }).catch((err)=>{
            console.log(err)
        })
        ClientesService.getPreciosAll().then((response)=>{
            setprecios(response.data)
        }).catch((err)=>{
            console.log(err)
        })
    ClientesService.getArancel().then((response)=>{
          setArancel(response.data || []);
        }).catch((error)=> console.error("Error:",error));

    },[])
// console.log(registro)
    const tablaC = (e) =>{
                settabla({visible:false , tipotabla:e.target.value})
                settablavisible(e.target.value)
    setregistro((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    };
    const tipoM = (e)=>{
            if (e.target.value ==="Solped"){
                    setNoSolped(e.target.checked ? false : true)
                settitulosColor((prev) => ({...prev,
                solped: e.target.checked   
            }))
            }  else if (e.target.value === "Adición item / other item"){
                setaditem(e.target.checked ? true : false)
                settitulosColor((prev) => ({...prev,
            Cantidad: e.target.checked , Precio: e.target.checked , monto: e.target.checked, descripcion: e.target.checked , um: e.target.checked , etd: e.target.checked , solped: e.target.checked   
            }))
            }  else if (e.target.value === "Otro"){
                setotro(e.target.checked ? false : true)
            }else if (e.target.value === "Molde recuperable"){
                setmolde(e.target.checked ? false : true)
            }
            else if (e.target.value === "Precio" || e.target.value === "Cantidad"){ 
                settitulosColor((prev) => ({...prev,
            [e.target.value]: e.target.checked 
            }))
            }else if (e.target.value === "Adición de línea" ){ 
                settitulosColor((prev) => ({...prev,
             etd: e.target.checked    
            }))            
            }else if (e.target.value === "Término de pago" ){ 
                const proveedorOk = proveedores.find(p => p.noProveedor === Number(registro.proveedor.substring(0, 6)));
                setregistro((prev) => ({ ...prev, terminos_de_pago: proveedorOk?.terminos_de_pago, clvterm: proveedorOk?.clvterm }));
                settitulosColor((prev) => ({...prev,
                    termPago: e.target.checked    
                    }))            
                    };
                    // console.log("tipoModif") AGREGAR UN ESTADO PARA ESTAS TIPOS DE CAMBIO TIPO JSON
    };
    const fechahoy = new Date()
    const fechaFormateada = fechahoy.toISOString().split('T')[0];
    
    const cambiofila = async (e) => {
        const coincide = ["u0", "m2", "m6"].some(prefijo => e?.target?.id?.startsWith(prefijo));
        if (coincide && (e.target.innerText).length >= 4  ){
            const texto = e.target.id
                let palabras = texto.split(" ");    
                let primera = palabras[0]; 
                let fila = texto.split(" ").slice(1).join(" "); 
        }else if ((e.target.id).includes("m0") && (e.target.innerText).includes("\n")) {
            
                let variasPOs = e.target.innerText 
                const var2 = variasPOs.split("\n");
                    setfilasTab(var2.length)
                      setposMasivo(prev => ({...prev,...var2}))
                const POsUnicas = [...new Set(var2)];
                try {
                        const respuestas = await Promise.all(
                        POsUnicas.map(item => ClientesService.getTpPm(item))
                );
                        const datos = respuestas.flatMap(r => r.data);
                        setdatosTpPm(prev => ({...prev, ...datos }));
                        setregistro(prev => ({...prev, proveedor: datos[0].proveedor,...datos}));
                } catch (error) {
                        console.log(error);
        }} else if ((e.target.id).includes("m0")) {
                  let variasPOs = e.target.innerText 
                 const var2 = e.target.innerText;
                     setfilasTab(filasTab)
                     setposMasivo(prev => ({...prev, [Object.keys(prev).length]: var2}))
                         const POsUnicas = var2;
                        try {
                        const datos = await ClientesService.getTpPm(POsUnicas);
                            const index = Object.keys(datosTpPm).length;
                            setdatosTpPm(prev => ({...prev, [index]: datos.data[0]}));
                            setregistro(prev => ({ ...prev, ...datos.data[0]}));
                        } catch (error) {
                            console.log(error);
                }} 
            }
        const añadirfila = (e) =>{
        if (e.target.innerText === "+"){
        setfilasTab(Number(filasTab) + Number(filasinput))
        }else if (e.target.innerText === "-") {
        setfilasTab(Number(filasTab) - Number(filasinput) <= 0 ? 1 : Number(filasTab) - Number(filasinput))
    }};
    const resultado =  (e) =>{
        if (e.target.id === "bu"){
        const res = contactos.find(
        item => item.unidaddeNegocio === e.target.value
        );
        setregistro((prev) => ({ ...prev, responsable: res.gerenteBU , unidad_de_negocio : res.unidaddeNegocio  }));
    }else{
        if (e.target.id === "cuentadocs" && e.target.value === "si"  ) {
            setclicksidocs(false)
        }else if (e.target.id === "cuentadocs" && e.target.value === "no"){  
            setclicksidocs(true)
        }
        if (e.target.value === "ea"){
            setclickEA(e.target.checked ? false : true)
        }else if (e.target.value === "revisado" || e.target.value === "reimpresion" ){
            setclickEA(e.target.checked ? true : true)
        }
        setclickcambio(e.target.checked ? false : true);
        setregistro((prev) => ({ ...prev, [e.target.id]: e.target.value }))
    }
}
const getordenTP = (e)=>{
    const medida = (e.target.value).length
        if (medida === 7) {
              ClientesService.getTpPm(e.target.value).then((response)=>{
                setdatosTpPm(response.data);
                setregistro((prev) => ({ ...prev, proveedor:response.data[0].proveedor, ...response.data}))
            }).catch((error)=>{
                console.log(error)
              })}
}
const solpedfunc = (e) =>{
            setregistro((prev) => ({ ...prev, solpedval: e.target.value }))
}
const cambioSwith = (e)=>{
    if (e.target.id === "itemP"){
        if (e.target.checked === false) {
            setfilasTab(datosTpPm.length)
        }
        setitemsPO(itemsPO ? false : true)
    }else if (e.target.id === "preciosP"){
        setverprecios(e.target.checked)
        setpreciosPO(preciosPO ? false : true)
    }
    // crear un estado para ver si son precios/Items manuales o automaticos y ese dato llevarlo al estado "registro"
}
const clavesunicas = [...new Set(proveedores.map(p => p.clvterm))];

const nuevotermPago = (e) =>{
    const nterm = proveedores.find(p => p.clvterm === e.target.value)?.terminos_de_pago;
    setregistro((prev) => ({ ...prev,  nuevotermpago: nterm  }));
 }
 const AplicaPOs = (e)=>{
    setaplicaSN(e.target.value)
 }

 return (
    <div >
        <Stack direction='row' alignItems='end' spacing={2} sx={{padding:'1%',marginLeft:'70%' }}>
            <span className="input-group-text bg-white border-secondary-subtle fw-bold text-muted small">Folio:
            <input type="text" id="folioBusqueda" className="form-control form-control-sm text-center border-secondary-subtle fw-bold text-uppercase" />
            </span>
            <button className="btn btn-primary btn-sm fw-bold px-4" style={{height:'40px'}}>Buscar</button>
        </Stack>
        <section style={{padding:'.5%', border:'solid #dfdfdf 1px'}}>
            <h5 className="fw-bold" style={{ color: '#F29111' , textAlign:'center' }}>SOLICITUD PARA MODIFICACIÓN / CANCELACIÓN TOTAL Y/O PARCIAL EN ÓRDENES DE COMPRA</h5>
            <section style={{alignItems:'center',display:'flex' , gap: '1rem' , border:'sold #EAEAEA 1px'}}>
                <label style={{width:'75px' , textWrap:'pretty'}}>Unidad de Negocio</label>
                <select onChange={(e)=>{resultado(e)}} id='bu' className='form-select' style={{width:'15%'}}>
                    <option>Seleccione</option>
                        {BUs.map((item) => (
                        <option key={item} value={item}>
                        {item}
                        </option>))}
                </select>
                <label style={{width:'75px' , textWrap:'pretty'}}>Responsable </label>
                <input value={registro.responsable || []} disabled/>
                <label style={{width:'75px' , textWrap:'pretty'}}>Fecha </label>
                <input disabled style={{backgroundColor:'#f8f8f8'}} type='date' value={fechaFormateada} />
                <label style={{width:'75px' , textWrap:'pretty' , marginLeft:'10%'}}>FOLIO</label>
                <input disabled />
            </section> 
            <section style={{padding:'20px', alignItems:'center',display:'flex' , gap:'1rem' ,border:'solid #d1cece 1px ' }}>
                <input style={{marginLeft:'90px' , transform: 'scale(1.3)'}} onClick={(e)=>{ resultado(e)}} type='radio' id="tipoRev" name="cambio" value="modificacion" />
                <label for="modificacion">Modificación</label>
                <input style={{marginLeft:'90px', transform: 'scale(1.3)'}} onClick={(e)=>{resultado(e)}} type='radio' id="tipoRev" name="cambio" value="canceltot" />
                <label for="canceltot">Cancelación total</label>
                <input style={{marginLeft:'90px', transform: 'scale(1.3)'}} onClick={(e)=>{resultado(e)}} type='radio' id="tipoRev" name="cambio" value="cancelparc" />
                <label for="cancelparc">Cancelación parcial (No hay PI)</label>
            </section>
            <section hidden={clickcambio} style={{marginTop:'1%', alignItems:'center',display:'flex' , gap:'1rem', border:'solid #d1cece 1px ' }}>
                <input style={{marginLeft:'90px' , transform: 'scale(1.3)'}} onClick={(e)=>{resultado(e)}} type='radio' id="clasir" name="subcambio" value="ea" />
                <label for="ea">EA</label>
                <input style={{marginLeft:'90px', transform: 'scale(1.3)'}} onClick={(e)=>{resultado(e)}} type='radio' id="clasir" name="subcambio" value="revisado" />
                <label for="revisado">REVISADO</label>
                <input style={{marginLeft:'90px', transform: 'scale(1.3)'}} onClick={(e)=>{resultado(e)}} type='radio' id="clasir" name="subcambio" value="reimpresion" />
                <label for="reimpresion">REIMPRESION(No hay PI)</label>
              </section>
            <section hidden={clickEA} style={{marginTop:'1%', alignItems:'center',display:'flex' , gap:'1rem', border:'solid #d1cece 1px ' }}>
                <label style={{marginLeft:'6%'}}><b>¿Cuenta con Documentos?</b></label>
                <input style={{marginLeft:'90px', transform: 'scale(1.3)'}} onClick={(e)=>{resultado(e)}}  type='radio' id="cuentadocs" name="sino" value="si" />
                <label for="revisado">Sí</label>
                <input style={{marginLeft:'90px', transform: 'scale(1.3)'}} onClick={(e)=>{resultado(e)}} type='radio' id="cuentadocs" name="sino" value="no" />
                <label for="reimpresion">No</label>
                <label hidden={clicksidocs} style={{color:'red'}}><b>Agregar confirmación de revocación de documentos</b></label>
            </section>
            <section  style={{marginTop:'1%', alignItems:'center',display:'flex' , gap:'1rem', border:'solid #d1cece 1px ' }}>
                <input style={{marginLeft:'90px', transform: 'scale(1.3)'}}  onClick={(e)=>{tablaC(e)}}  type='radio' id="tipotabla" name="tipotabla" value="unica" />
                <label for="unica">Única</label>
                <input style={{marginLeft:'90px', transform: 'scale(1.3)'}}  onClick={(e)=>{tablaC(e)}} type='radio' id="tipotabla" name="tipotabla" value="masivo" />
                <label for="masivo">Masivo</label>
                <div  style={{padding:'1%' , marginLeft:'2%' ,display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '2px' ,textAlign:'center' , maxWidth:'60%'  }}>
                    {Orden_Etd_Cur.map((item) => (
                    <label key={item} value={item} style={{color:'#4d73da', fontWeight:'bold'}} hidden={tablavisible === 'unica'  ? false : ( item.includes("Moneda") && tablavisible === 'masivo' )  ? false : true } > 
                    {item}<br></br><input onChange={(e)=>{getordenTP(e)}} readOnly={item.includes("PO PM") ? false : true } 
                         value={item === "PO TT" ? datosTpPm[0]?.poth : item === "Moneda" ? datosTpPm[0]?.moneda : 
                            item === "PO PM/TS" ? datosTpPm[0]?.po : item === "ETD" ? datosTpPm[0]?.etd : ''
                          } 
                        id={item === "etd" ? '' : item.includes("PO") ? 'miInput' : '{item}'} 
                        style={{ textAlign:'center' , width:item === "ETD" ? '' : item.includes("PO") ? '120px' : '70px'}} 
                        type={item === "ETD" ? 'date' : item.includes("PO") ? 'number' : 'text'}/>
                    </label>))}
                    <label hidden={tablavisible === 'unica'  ? false :false} style={{borderBottom:'solid 1px black', padding:'5%',width:'250%'}}> Proveedor:  {datosTpPm[0]?.proveedor}</label>
                </div>                
            </section>
            <div hidden={tabla.visible} style={{marginTop:'1%', alignItems:'center' , border:'solid #d1cece 1px ' }}>
               <label style={{marginTop:'10px', marginLeft:'10px'}}>Tipo de modificación</label>
            <Stack direction='row' >
                <div  style={{padding:'1%' , marginLeft:'1%' ,display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap:'10px', textAlign:'left' , minWidth:'70%'  }}>
                            {tipos_modif.map((item) => (
                            <label key={item} value={item}>  <input type='checkbox' onClick={(e)=>{tipoM(e)}} key={item} value={item}/ >&nbsp;&nbsp;
                            {item}
                            </label>))}
                </div>
                <Stack hidden={NoSolped} direction='row' style={{padding:'1%',marginLeft:'-10%',maxWidth:'60%'}}>
                    <span >No. Solped</span>&nbsp;
                    <input onChange={(e)=>{solpedfunc(e)}} value={registro.solpedval} style={{maxHeight:'50%' ,border:'none', borderBottom:'1px solid black'}} type='text' />
                </Stack>
            </Stack>
<Stack direction='row' justifyContent={molde && otro ? 'flex-end' : 'center'} sx={{width:'80%'}}>  
        <Stack hidden={molde} direction='row' style={{padding:'1%',marginLeft:'15%',maxWidth:'80%'}}>
            <span >Molde PO PM/TS:</span>&nbsp;
            <input style={{border:'none', borderBottom:'1px solid black'}} type='text' />
        </Stack>
        <Stack hidden={otro} direction='row' style={{padding:'1%',marginLeft:'12%',maxWidth:'80%'}}>
            <span >Motivo...</span>&nbsp;
            <input style={{border:'none', borderBottom:'1px solid black'}} type='text' />
        </Stack>        
</Stack>
    </div>
        </section>
    <section style={{padding:'.5%', border:'solid #dfdfdf 1px'}}>
<Stack style={{display:titulosColor.termPago ? '':'none' }} direction='row' spacing={8}>
    <Stack sx={{ display: "inline-flex", alignItems: "stretch" }} >
        <Stack direction="row">
            <input value={registro?.clvterm} style={{maxWidth:'25%'}} disabled />
            <input value={registro?.terminos_de_pago} style={{minWidth:'75%'}} disabled />
        </Stack>
        <label style={{ borderTop: "1px solid black", textAlign: "center", paddingTop: "4px" }} >
    Término de pago actual
        </label>
    </Stack>
    <Stack sx={{alignItems:'center'}}>
        <label>¿Aplica para todas las Pos?</label>
        <div style={{alignItems:'center',display:'flex' , gap: '1rem'}}>
            <label>Si</label><input onClick={(e)=>{AplicaPOs(e)}} style={{transform: 'scale(1.3)'}} type='radio' id="aplicaAllPOs" value='si' name='si_no'/>
            <label>No</label><input onClick={(e)=>{AplicaPOs(e)}} style={{ transform: 'scale(1.3)'}} type='radio' id="aplicaAllPOs" value='No' name='si_no'/>
        </div>
        {console.log(aplicaSN)}
        <div style={{display:aplicaSN === "Si" ? '' :'none' ,marginTop:'3%', alignItems:'center',display:'flex' , gap: '1rem'}}>
            <label>Indicar POs</label>
            <input type='text' style={{border:'none',borderBottom:'1px solid black '}} />
        </div>
        
    </Stack>

    <Stack sx={{ display: "inline-flex", alignItems: "stretch" }} >
        <Stack direction="row">
            <select onChange={(e)=>{nuevotermPago(e)}}>
                <option> Select </option>
                 {clavesunicas.map((item) => (
                    <option key={item} value={item}>
                {item}
                </option>))} 
            </select>
            <input value={registro.nuevotermpago} size={registro.nuevotermpago?.length || 1}  />
        </Stack>
        <label style={{ borderTop: "1px solid black", textAlign: "center", paddingTop: "4px" }} >
    Término de pago nuevo
        </label>
    </Stack>
</Stack>
    <div  hidden={(tablavisible === "unica" ? false : true )} style={{marginTop:'2%' , Width:'80%' , border:'solid #d1cece 1px' , borderRadius:'10px'}}> 
            <div >
                <button style={{marginLeft:'1%'}} onClick={(e)=> añadirfila(e)} className="btn btn-danger btn-sm fw-bold px-2 py-0" >-</button>
                    <input  onChange={(e) => {setfilasinput(e.target.value)}} id='miInput' type='number'  defaultValue={filasinput} style={{fontWeight:'bold'  ,textAlign:'center',fontSize:'12px', marginLeft:'1%',width:'3%'}}/ >
                <button style={{marginLeft:'1%'}} onClick={(e)=> añadirfila(e)} className="btn btn-success btn-sm fw-bold px-2 py-0" >+</button>             
             <label style={{marginLeft:'5%',fontWeight:itemsPO ? 'bold': ''}}>Items PO</label>
                <Switch id="itemP" onChange={(e)=>{cambioSwith(e)}} defaultChecked color='warning' />
             <label style={{fontWeight:itemsPO ? '': 'bold'}}>Items Manual</label>
             <label style={{marginLeft:'5%', fontWeight:preciosPO ? 'bold': ''}}>Precio Automatico</label>
                <Switch id="preciosP" onChange={(e)=>{cambioSwith(e)}} defaultChecked color='success' />
             <label style={{fontWeight:preciosPO ? '': 'bold'}}>Precio Manual</label>
                <button className='btn btn-light' style={{marginLeft:'7%'}}>Ver tabla Parcelmobi</button>

            </div>
            <div style={{display:titulosColor.Cantidad ? '':'none' , color:'red', marginLeft:'5%' , height:'45px'}}>Para ajustes de cantidad únicamente considerar líneas que indiquen información en el campo "Cantidad Nueva"</div>
            <table className='table'>
                <thead className='thead-dark' style={{textAlign:'center'}} >
                <tr>
                    {Revisados_Unica.map((item) => 
                        <th key={item} id={item} 
                        style={{ fontSize:'small'  ,display:item === "UM" && aditem === false ? 'none' :'' , 
                     backgroundColor:((item.includes("PRECIO") && titulosColor.Precio) || (item.includes("CANTIDAD") && titulosColor.Cantidad) ||
                    (item.includes("MONTO") && titulosColor.monto) || (item.includes("DESCRIPCIÓN") && titulosColor.descripcion) ||
                    (item.includes("UM") && titulosColor.um) || (item.includes("ETD") && titulosColor.etd || (item.includes("SOLPED") && titulosColor.solped))) ? "#FBE2D5" : ''}}   
                    >{item}</th>
                    )} 
                </tr>      
                 </thead>  
                    <tbody onInput={(e)=>{cambiofila(e)}}>
                        {Array.from({ length: filasTab }).map((_, indexFila) => (
                            <tr key={indexFila} style={{  backgroundColor: 'gray', }} >
                            {Revisados_Unica.map((item, indexItem) => (
                                <td key={'u'+ indexItem} id={'u'+ indexItem + " " + indexFila} data-columna={item} 
                                contentEditable='true' style={{width:'100px',textAlign:'center', border:'dotted black 1px' , borderRadius:'6px', display:item === "UM" && aditem === false ? 'none' :''}}>
                                {item === "ETD" ? <input id={'u'+ indexItem + " " + indexFila} type="date" /> : (item === "ITEM" && itemsPO === true) ? datosTpPm[indexFila]?.material : 
                                 (item === "CLAVE" && itemsPO === true) ? datosTpPm[indexFila]?.clave : (item === "POSICIÓN" && itemsPO === true) ? datosTpPm[indexFila]?.posicion : 
                                  (item === "CANTIDAD ACTUAL" && titulosColor.Cantidad === true) ? datosTpPm[indexFila]?.cantidad : 
                                  (item === "PRECIO UNITARIO" && verprecios === false) ? `$${(datosTpPm[indexFila]?.precio ?? 0).toFixed(2)}` : null }
                                </td>
                            ))}
                            </tr>
                        ))}
                    </tbody>            
            </table>
        </div>
    <div  hidden={(tablavisible === "masivo" ? false : true )} style={{marginTop:'2%' , Width:'80%' , border:'solid #d1cece 1px' , borderRadius:'10px'}}> 
            <div >
                <button style={{marginLeft:'1%'}} onClick={(e)=> añadirfila(e)} className="btn btn-danger btn-sm fw-bold px-2 py-0" >-</button>
                    <input  onChange={(e) => {setfilasinput(e.target.value)}} id='miInput' type='number'  defaultValue={filasinput} style={{fontWeight:'bold'  ,textAlign:'center',fontSize:'12px', marginLeft:'1%',width:'3%'}}/ >
                <button style={{marginLeft:'1%'}} onClick={(e)=> añadirfila(e)} className="btn btn-success btn-sm fw-bold px-2 py-0" >+</button>

             <label style={{marginLeft:'30%', fontWeight:preciosPO ? 'bold': ''}}>Precio Automatico</label>
                <Switch id="preciosP" onChange={(e)=>{cambioSwith(e)}} defaultChecked color= 'success' />
             <label style={{fontWeight:preciosPO ? '': 'bold'}}>Precio Manual</label>
                <button className='btn btn-light' style={{marginLeft:'7%'}}>Ver tabla Parcelmobi</button>
            </div>
            <table className='table'>
                <thead className='thead-dark' style={{textAlign:'center'}} >
                <tr>
                    {Revisados_Masivo.map((item) => 
                        <th key={item} id={item} style={{display:item === "UM" && aditem === false ? 'none' :'',
                             backgroundColor:((item.includes("PRECIO") && titulosColor.Precio) || (item.includes("CANTIDAD") && titulosColor.Cantidad) ||
                    (item.includes("MONTO") && titulosColor.monto) || (item.includes("DESCRIPCIÓN") && titulosColor.descripcion) ||
                    (item.includes("UM") && titulosColor.um) || (item.includes("ETD") && titulosColor.etd || (item.includes("SOLPED") && titulosColor.solped))) ? "#FBE2D5" : ''}}>{item}</th>
                    )} 
                </tr>      
                 </thead>  
                    <tbody onInput={(e)=>{cambiofila(e)}} >
                        {Array.from({ length: filasTab }).map((_, indexFila) => (
                            <tr key={indexFila} style={{ borderBlock: '1px solid #d1cece', backgroundColor: 'gray', textAlign:'center'}} >
                            {Revisados_Masivo.map((item, indexItem) => (
                                <td key={'m'+indexItem} id={'m'+ indexItem + " " + indexFila}  data-columna={item}
                                contentEditable='true' style={{fontSize:item === "CLAVE" ? '13px': '15px' ,width:item === "CLAVE" ? '250px': '' ,display:item === "UM" && aditem === false ? 'none' :''}}>
                                {item === "ETD" ? <input id={'m'+ indexItem + " " + indexFila} type="date" /> : item === "PO PM/TS" ? posMasivo[indexFila] 
                            : item === "PO TT" ? datosTpPm[indexFila]?.poth : item === "ITEM" ? datosTpPm[indexFila]?.material 
                            : item === "CLAVE" ? datosTpPm[indexFila]?.clave : item === "POSICIÓN" ? datosTpPm[indexFila]?.posicion 
                            : item === "CANTIDAD ACTUAL" && titulosColor.Cantidad === true ? datosTpPm[indexFila]?.cantidad : item === "PRECIO UNITARIO" && verprecios === false ? `$${(datosTpPm[indexFila]?.precio ?? 0).toFixed(2)}` : null}
                                </td>
                            ))}
                            </tr>
                        ))}
                    </tbody>            
            </table>
        </div>
       </section> 
        <Stack hidden={true} marginLeft='40%' direction='row' spacing={2}>
            <button className='btn btn-success'>Guardar</button>
            <button className='btn btn-danger'>Cancelar</button>
        </Stack>
        <br></br>
    </div>
  )
}

export default FormatoRevisados