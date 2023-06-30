/*

*/

let idEliminar=0;
let idActualizar=0;
let idLeer=0;
let idMarcar=0;

// ----------------  Crear solicitud  -----------------
// Funciona al oprimir el botón de Nueva solicitud
async function actionCreate(){
  //Recuperamos los datos del formulario
  let fecha_solicitada = document.getElementById('fecha_solicitada').value;
  let hora_inicio = document.getElementById('hora_inicio').value;
  let hora_fin = document.getElementById('hora_fin').value;
  let descripcion = document.getElementById('descripcion').value;

  let estadoprint='<div ><div class="external-event bg-warning">Pendiente</div></div>';
  let estado="2";
  let fecha = new Date();
  let anio = fecha.getFullYear();
  let mes = String(fecha.getMonth() + 1).padStart(2, '0');
  let dia = String(fecha.getDate()).padStart(2, '0');
  let fecha_creacion = anio + '-' + mes + '-' + dia;
  
  var elemento = document.getElementById("num_empleado");
  var valorVariable = elemento.textContent;
  var expresionRegular = /\d+/;
  var numeros = valorVariable.match(expresionRegular);

  let num_empleado= numeros[0];

  // Validaciones not null, para asegurar que llene todos los campos
  if(fecha_solicitada === "" || hora_inicio === "" || descripcion === "" || hora_fin === ""){
      console.log('No puso todos los campos');
      toastr.error("Favor de rellenar todos los campos. Intente de nuevo.");
  }else if(fecha_solicitada< fecha_creacion){
    toastr.error("No es posible seleccionar una fecha anterior a la actual, intente de nuevo");
  }
  else{
      
      var formData = new FormData();
      formData.append('fecha_solicitada', fecha_solicitada);
      formData.append('fecha_creacion', fecha_creacion);
      formData.append('hora_inicio', hora_inicio);
      formData.append('hora_fin', hora_fin);
      formData.append('descripcion', descripcion);
      formData.append('estado', estado);
      formData.append('num_empleado', num_empleado);
      formData.append('accion',"create");
      console.log(fecha_solicitada);
      console.log(fecha_creacion);
      console.log(descripcion);
      console.log(fecha_creacion);
      console.log(hora_inicio);
      console.log(hora_fin);
      console.log(estado);
      console.log(num_empleado);

      limpiarpagina();

      $.ajax({ 
        method:"POST",
        url: "../php/crud_solicitudes.php",
        data: formData,

        contentType: false,
        processData: false,
        success: function(respuesta) {
          JSONRespuesta = JSON.parse(respuesta); 
          console.log(JSONRespuesta.estado)
          if(JSONRespuesta.estado==1){

            tabla = $("#example2").DataTable();

            let Botones="";
            Botones += '<center><i class="fas fa-eye" style="font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_read_tarea" onclick="actionReadById(' + JSONRespuesta.id + ')"></i></center>';    
              Botones += '<center><i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+JSONRespuesta.id+')"></i></center>';
             
            tabla.row.add([fecha_solicitada,descripcion,estadoprint,  Botones]).draw().node().id="renglon_"+JSONRespuesta.id;
            toastr.success(JSONRespuesta.mensaje);
          }else{
            toastr.error(JSONRespuesta.mensaje);
          }
        }
    });
  }    
}

// -----------------  leer solicitudes  ------------------
// Pone en la tabla los registros de la BD creados por el usuario,
//siempre y cuendo no haya pasado la fecha solicitada
async function actionRead() {
    const email = await obtenerCorreo();
    let fechaActual = new Date();

    let anio = fechaActual.getFullYear();
    let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
    let dia = String(fechaActual.getDate()).padStart(2, '0');
    let fechaFormateada = anio + '-' + mes + '-' + dia;

    $.ajax({
      method:"POST",
      url: "../php/crud_solicitudes.php",
      data: {
        accion: "read",
        num_empleado: email,
        fechaHoy: fechaFormateada
      },
      success: function( respuesta ) {
        JSONRespuesta = JSON.parse(respuesta);
        console.log(JSONRespuesta.estado);
  
          tabla = $("#example2").DataTable();
              JSONRespuesta.entregas.forEach(solicitud => {
                let estadoprint="";
                if(solicitud.estado=="1"){
                  estadoprint='<div ><div class="external-event bg-danger">Rechazado</div></div>';
              }
              if(solicitud.estado=="2"){
                  estadoprint='<div ><div class="external-event bg-warning">Pendiente</div></div>';
              }
              if(solicitud.estado=="3"){
                  estadoprint='<div  ><div class="external-event bg-success">Aceptado</div></div>';
              }
              
                
                let Botones="";
                  Botones += '<i class="fas fa-eye" style="font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_read_tarea" onclick="actionReadById(' + solicitud.idSolicitud + ')"></i>';    
                  Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+solicitud.idSolicitud+')"></i>';
                  
                tabla.row.add([solicitud.fecha_solicitada, solicitud.descripcion, estadoprint, Botones]).draw().node().id="renglon_"+solicitud.idSolicitud;
              });
        console.log(respuesta);
      }
    });
  }
  

// -----------------  READ_BY_ID solicitudes  ------------------
// Funciona al oprimir el botón de ojo, coloca los datos existentes 
//en el formulario, unicamente lectura
function actionReadById(id){
  idLeer=id;

  $.ajax({
    method:"POST",
    url: "../php/crud_solicitudes.php",
    data: {
      id: idLeer,
      accion:"read_id"
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);

        let fecha_solicitada = document.getElementById("fecha_solicitadaRead");
          fecha_solicitada.value=JSONRespuesta.fecha_solicitada;
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

          if(JSONRespuesta.estado==='1'){
            rechazado.style.display = "block"}else{rechazado.style.display = "none"}
  
          if(JSONRespuesta.estado==='2'){
            pendiente.style.display = "block";}else{pendiente.style.display = "none"}
  
          if(JSONRespuesta.estado==='3'){
            aceptado.style.display = "block"}else{aceptado.style.display = "none"}
    }
  });
}



// -----------------  DELETE solicitud  ------------------
// Funciona al oprimir el botón rojo de eliminar para cada solicitud
function actionDelete() {
  $.ajax({
    method:"POST",
    url: "../php/crud_solicitudes.php",
    data: {
      id: idEliminar,
      accion:"delete"
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
      if(JSONRespuesta.estado==1){
        let tabla = $("#example2").DataTable();
        tabla.row("#renglon_"+idEliminar).remove().draw();
        toastr.success(JSONRespuesta.mensaje);
      }else{
        toastr.error(JSONRespuesta.mensaje);
      }
    }
  });
}



//Limpia las variables del create
function limpiarpagina()
{
    document.getElementById("fecha_solicitada").value = "";
    document.getElementById("hora_inicio").value = "";
    document.getElementById("hora_fin").value = "";
    document.getElementById("descripcion").value = "";
}

//Leemos el correo de la sesion
async function obtenerCorreo() {
  const response = await fetch("../php/session.php");
  const data = await response.json();
  const user = data.num_empleado;
  return user;
}

//Función para rellenar lo que hay en BD, para despues poder actualizar
function identificarActualizar(id){
    idActualizar=id;

  
    $.ajax({
      method:"POST",
      url: "../php/crud_tareas.php",
      data: {
        id: idActualizar,
        accion:"read_idAct"
      },
      success: function( respuesta ) {
        JSONRespuesta = JSON.parse(respuesta);
        if(JSONRespuesta.estado==1){
          let nom_tarea = document.getElementById("nombreTarea_Update");
          nom_tarea.value = JSONRespuesta.nom_tarea;
          let descripcion = document.getElementById("descripcion_Update");
          descripcion.value = JSONRespuesta.descripcion;
          let lugar = document.getElementById("lugar_Update");
          lugar.value = JSONRespuesta.lugar;
          let fecha = document.getElementById("fecha_Update");
          fecha.value = JSONRespuesta.fecha;
          let duracion = document.getElementById("duracion_Update");
          duracion.value = JSONRespuesta.duracion;
          
        }else{
          toastr.error("Registro no encontrado");
        }
      }
    });
  }
 
//Asigna el id al idEliminar
function identificarEliminar(id){
  idEliminar=id;
  //alert(idEliminar);
}
