/*

*/

let idEliminar=0;
let idActualizar=0;
let idLeer=0;
let idMarcar=0;



// -----------------  Leer solicitudes  ------------------
// Pone en la tabla todos los registros de la BD
async function actionRead() {
    const email = await obtenerCorreo();
    let fechaActual = new Date();

    let anio = fechaActual.getFullYear();
    let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    let dia = String(fechaActual.getDate()).padStart(2, '0');
    let fechaFormateada = anio + '-' + mes + '-' + dia;

    $.ajax({
      method:"POST",
      url: "../php/crud_solicitudes_admin.php",
      data: {
        accion: "read",
        fechaHoy: fechaFormateada
      },
      success: function( respuesta ) {
        JSONRespuesta = JSON.parse(respuesta);
        console.log(JSONRespuesta.estado);

          tabla = $("#example2").DataTable();
        
              JSONRespuesta.entregas.forEach(solicitud => {
                let estadoprint;
                
                if(solicitud.estado=="1"){
                    estadoprint='<div ><div style="cursor: default;" class="external-event bg-danger">Rechazado</div></div>';
                }
                if(solicitud.estado=="2"){
                    estadoprint='<div ><div style="cursor: default;" class="external-event bg-warning">Pendiente</div></div>';
                }
                if(solicitud.estado=="3"){
                    estadoprint='<div  ><div style="cursor: default;" class="external-event bg-success">Aceptado</div></div>';
                }
                
                let Botones="";
                  Botones += '<center><i class="fas fa-eye" style="cursor: pointer; font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_read_tarea" onclick="actionReadById(' + solicitud.idSolicitud + ')"></i></center>';
                 
                  
                  
                tabla.row.add([solicitud.nom_usuario, solicitud.fecha_solicitada, solicitud.descripcion, estadoprint, Botones]).draw().node().id="renglon_"+solicitud.idSolicitud;
              });
        console.log(respuesta);
      }
    });
  }


// -----------------  READ_BY_ID solicitudes  ------------------
// Funciona al oprimir el botón de morado de leer para cada solicitud
function actionReadById(id){
  idLeer=id;
    idActualizar=id;
  $.ajax({
    method:"POST",
    url: "../php/crud_solicitudes_admin.php",
    data: {
      id: idLeer,
      accion:"read_id"
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
      console.log(JSONRespuesta);

        
        let nom_usuario = document.getElementById("nom_usuarioRead");
        nom_usuario.value=JSONRespuesta.nom_usuario;
        console.log(nom_usuario);
        let fecha_solicitada = document.getElementById("fecha_solicitadaRead");
        fecha_solicitada.value=JSONRespuesta.fecha_solicitada;
        console.log(fecha_solicitada);
        let descripcion = document.getElementById("descripcionRead");
        descripcion.value=JSONRespuesta.descripcion;
        let hora_inicio = document.getElementById("hora_inicioRead");
        hora_inicio.value=JSONRespuesta.hora_inicio;
        let hora_fin = document.getElementById("hora_finRead");
        hora_fin.value=JSONRespuesta.hora_fin;
        let fecha_creacion = document.getElementById("fecha_creacionRead");
        fecha_creacion.value=JSONRespuesta.fecha_creacion;
        let comentario = document.getElementById("comentarioRead");
        comentario.value=JSONRespuesta.comentario;

        if(JSONRespuesta.estado=="1"){
            let estado = document.getElementById("estadoRead");
            estado.value= "1";
           
        }
        if(JSONRespuesta.estado=="2"){
            let estado = document.getElementById("estadoRead");
            estado.value= "2";
            
        }
        if(JSONRespuesta.estado=="3"){
            let estado = document.getElementById("estadoRead");
            estado.value= "3";
            
        }

    }
  });
}

// -----------------  actualizar solicitud  ------------------
// Funciona al oprimir el botón verde de editar para cada solicitud
async function actionUpdate(){
 
    let estado = document.getElementById("estadoRead").value;
    let comentario = document.getElementById("comentarioRead").value;
    let nom_usuario= document.getElementById("nom_usuarioRead").value;
    let fecha_solicitada= document.getElementById("fecha_solicitadaRead").value;
    let hora_inicio= document.getElementById("hora_inicioRead").value;
    let hora_fin= document.getElementById("hora_finRead").value;
    let descripcion= document.getElementById("descripcionRead").value;
    let fecha_creacion= document.getElementById("fecha_creacionRead").value;
    let fechaActual = new Date();
  
    let anio = fechaActual.getFullYear();
    let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    let dia = String(fechaActual.getDate()).padStart(2, '0');
    let fecha_modificacion = anio + '-' + mes + '-' + dia;
  console.log(comentario);
  console.log(estado);
  console.log(nom_usuario);
    console.log(fechaActual);
    console.log(fecha_modificacion);

      var formData = new FormData();
          formData.append('id', idActualizar);
         

          formData.append('fecha_solicitada', fecha_solicitada);
          formData.append('hora_inicio', hora_inicio);
          formData.append('hora_fin', hora_fin);
          formData.append('descripcion', descripcion);
          formData.append('fecha_creacion', fecha_creacion);
          formData.append('estado', estado);
          formData.append('comentario', comentario);
          formData.append('accion', "update");
    
      $.ajax({
        method:"POST",
        url: "../php/crud_solicitudes_admin.php",
        data: formData,
        contentType: false,
        processData: false,
        
        success: function( respuesta ) {
          JSONRespuesta = JSON.parse(respuesta);
            
            let tabla = $("#example2").DataTable();
            console.log(JSONRespuesta.estadoAct)
            
            let Botones="";
            if(estado=="1"){
                estadoprint='<div><div style="cursor: default;" class="external-event bg-danger">Rechazado</div></div>';
            }
            if(estado=="2"){
                estadoprint='<div><div style="cursor: default;" class="external-event bg-warning">Pendiente</div></div>';
            }
            if(estado=="3"){
                estadoprint='<div><div style="cursor: default;" class="external-event bg-success">Aceptado</div></div>';
            }
             
               
              Botones += '<center><i  class="fas fa-eye" style="cursor: pointer; font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_read_tarea" onclick="actionReadById('+idActualizar+')"></i></center>';
            ////////////////////////////////////////////////
            var temp = tabla.row("#renglon_"+idActualizar).data();
            temp[0] = nom_usuario;
            temp[1] = fecha_solicitada;
            temp[2] = descripcion;
            temp[3] = estadoprint;
            temp[4] = Botones;
            tabla.row("#renglon_"+idActualizar).data(temp).draw();
            /////////////////////////////////////////////////
            toastr.success(JSONRespuesta.mensaje);

        }
      });
}


//Leemos el correo de la sesion
async function obtenerCorreo() {
  const response = await fetch("../php/session.php");
  const data = await response.json();
  
  const user = data.nom_usuario;

  return user;
}

