export const obtenerEstadoEnvio = (value,row) => {
 if (row.acuse === "CERRADA" || row.acuse === "CANCELADA") {
    return row.acuse;
  }

  if (
    ["R", "PPU", "MS", "X", "N/A"].includes(row.liberada_por_matrices) &&
    row.liberada_por_bu === "ACEPTADA" &&
    row.liberada_por_planeacion === "ACEPTADA"
  ) {
    if (row.qty === "MAL" || row.add_elim_item !== "N/A" || row.precio !== "OK") {
      if (row.liberada_por_auditoria === "ACEPTADA" && row.liberada_por_sap === "ACEPTADA") {
        return "ENVIO";
      } else {
        return "AUDITORIA/SAP";
      }
    } else {
      return "ENVIO";
    }
  }

  if (!["R", "PPU", "MS", "X", "N/A"].includes(row.liberada_por_matrices)) {
    if (row.liberada_por_bu !== "ACEPTADA") {
      if (
        [
          "Mecánica 1",
          "Der. Petróleo 1",
          "Máquinas 2",
          "Htas. Manuales 1",
          "Volteck 1",
          "Volteck 2",
          "Volteck 3",
          "VOLTECK 1",
          "VOLTECK 2",
          "VOLTECK 3"
        ].includes(row.unidad_de_negocio)
      ) {
        return "COMPRAS/PLANEACION";
      } else {
        return "COMPRAS";
      }
    } else {
      return "PLANEACION";
    }
  }
if (
        [
          "Mecánica 1",
          "Der. Petróleo 1",
          "Máquinas 2",
          "Htas. Manuales 1",
          "Volteck 1",
          "Volteck 2",
          "Volteck 3",
          "VOLTECK 1",
          "VOLTECK 2",
          "VOLTECK 3"
        ].includes(row.unidad_de_negocio)
      ) {
        return "COMPRAS/PLANEACION";
      } else {
        return "COMPRAS";
      }   } ;
export const BUs_Piloto = (value,row) => {
  if (["Mecánica 1","Der. Petróleo 1","Máquinas 2","Htas. Manuales 1","VOLTECK 1","VOLTECK 2","VOLTECK 3","Volteck 1","Volteck 2","Volteck 3","VOLTECK 1", "VOLTECK 2", "VOLTECK 3"].includes(row.unidad_de_negocio)){
             return false;
           }  else{
             return false;
           }
        
}    
