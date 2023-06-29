/*
Nombre del programa: CRUD_TAREAS
Descripción:  Realiza todas las acciones necesarias para tareas en Javascript,
              crea, edita, elimina, lee los datos de una tarea, lee todos los registros de tareas
              las marca como completadas, las comparte, y algunas funciones extra que permiten el
              correcto funcionamiento de las anteriores.
*/

let idEliminar=0;
let idActualizar=0;
let idLeer=0;
let idMarcar=0;

// ----------------  CREATE TAREAS  -----------------
// Funciona al oprimir el botón de Nueva Tarea
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
  //console.log(numeros[0]);
  let num_empleado= numeros[0];
  // Compara las fechas y actualiza el estado
  /*
  if(fecha == fechaFormateada || fecha > fechaFormateada){
      estadoAct = 0;
  }else if (fecha < fechaFormateada) {
      estadoAct = 2;
  }else{
    estadoAct = 0;
  }
  */


  //const email = await obtenerCorreo();

  // Validaciones not null, para asegurar que llene todos los campos
  if(fecha_solicitada === "" || hora_inicio === "" || descripcion === "" || hora_fin === ""){
      console.log('No puso todos los campos');
      toastr.error("Favor de rellenar todos los campos. Intente de nuevo.");
  }else{
      
      
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
            //alert(JSONRespuesta.mensaje);
            tabla = $("#example2").DataTable();
            // if(estadoAct == 0){
            //   estadoActT = "Pendiente";
            // }
            // if(estadoAct == 2){
            //   estadoActT = "Retrasada";
            // }
            let Botones="";
            Botones += '<i class="fas fa-eye" style="font-size:25px;color: #af66eb; margin-right: 10px;" data-toggle="modal" data-target="#modal_read_tarea" onclick="actionReadById(' + JSONRespuesta.id + ')"></i>';    
              Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+JSONRespuesta.id+')"></i>';
             
            tabla.row.add([fecha_solicitada,descripcion,estadoprint,  Botones]).draw().node().id="renglon_"+JSONRespuesta.id;
            //toastr.success(JSONRespuesta.mensaje);
          }else{
            toastr.error(JSONRespuesta.mensaje);
          }
        }
    });
  }    
}

// -----------------  READ TAREAS  ------------------
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
      url: "../php/crud_solicitudes.php",
      data: {
        accion: "read",
        num_empleado: email,
        fechaHoy: fechaFormateada
      },
      success: function( respuesta ) {
        JSONRespuesta = JSON.parse(respuesta);
        console.log(JSONRespuesta.estado);

        
        // var elemento = document.getElementById("num_empleado");
        // var valorVariable = elemento.textContent;
        // var expresionRegular = /\d+/;
        // var numeros = valorVariable.match(expresionRegular);
        //console.log(numeros[0]);
        //let num_empleado= numeros[0];
  
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
                  Botones += '<i class="fas fa-eye" style="font-size:25px;color: #af66eb; margin-right: 10px;" data-toggle="modal" data-target="#modal_read_tarea" onclick="actionReadById(' + solicitud.idSolicitud + ')"></i>';    
                  Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+solicitud.idSolicitud+')"></i>';
                  
                tabla.row.add([solicitud.fecha_solicitada, solicitud.descripcion, estadoprint, Botones]).draw().node().id="renglon_"+solicitud.idSolicitud;
              });
        console.log(respuesta);
      }
    });
  }
  // -----------------  READ_BY_ID TAREAS  ------------------
  // Funciona al oprimir el botón de morado de leer para cada tarea, o cuando se selecciona desde el calendario
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
        //if(JSONRespuesta.estado==1){
          let fecha_solicitada = document.getElementById("fecha_solicitadaRead");
          fecha_solicitada.value=JSONRespuesta.fecha_solicitada;
          let descripcion = document.getElementById("descripcionRead");
          descripcion.value=JSONRespuesta.descripcion;
          let hora_inicio = document.getElementById("hora_inicioRead");
          hora_inicio.value=JSONRespuesta.hora_inicio;
          let hora_fin = document.getElementById("hora_finRead");
          hora_fin.value=JSONRespuesta.fecha;
          let fecha_creacion = document.getElementById("fecha_creacionRead");
          fecha_creacion.value=JSONRespuesta.duracion;

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
          
          //let completadaCheckbox = document.getElementById("completadaRead");
          //completadaCheckbox.checked = JSONRespuesta.estadoAct == 1;
  
        //}else{
          //toastr.error("Registro no encontrado");
        //  }
      }
    });
}

// -----------------  READ_BY_ID TAREAS  ------------------
// Funciona al oprimir el botón de morado de leer para cada tarea, o cuando se selecciona desde el calendario
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
      // if(JSONRespuesta.estado==1){
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
          //let completadaCheckbox = document.getElementById("completadaRead");
          //completadaCheckbox.checked = JSONRespuesta.estadoAct == 1;
      // }else{
      //   toastr.error("Registro no encontrado");
      // }
    }
  });
}

// -----------------  UPDATE TAREAS  ------------------
// Funciona al oprimir el botón verde de editar para cada tarea
async function actionUpdate(){
  const email = await obtenerCorreo();

  let nom_tarea = document.getElementById("nombreTarea_Update").value;
  let fecha = document.getElementById("fecha_Update").value;
  let lugar = document.getElementById("lugar_Update").value;
  let duracion = document.getElementById("duracion_Update").value;
  let descripcion = document.getElementById("descripcion_Update").value;
  let estadoAct;

  let fechaActual = new Date();
  
  let anio = fechaActual.getFullYear();
  let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
  let dia = String(fechaActual.getDate()).padStart(2, '0');
  let fechaFormateada = anio + '-' + mes + '-' + dia;

  console.log(fecha);
  console.log(fechaFormateada);

  if(nom_tarea === "" || descripcion === "" || lugar === "" || fecha === "" || duracion === ""){
    console.log('No puso todos los campos');
    toastr.error("Favor de rellenar todos los campos. Intente de nuevo.");
  }else{
    var formData = new FormData();
        formData.append('id', idActualizar);
        formData.append('nom_tarea', nom_tarea);
        formData.append('fecha', fecha);
        formData.append('lugar', lugar);
        formData.append('duracion', duracion);
        formData.append('descripcion', descripcion);
        formData.append('estadoAct', estadoAct);
        formData.append('fechaHoy', fechaFormateada);
        formData.append('accion', "update");
        formData.append('correo', email);
  
    $.ajax({
      method:"POST",
      url: "../php/crud_tareas.php",
      data: formData,
      contentType: false,
      processData: false,
      
      success: function( respuesta ) {
        JSONRespuesta = JSON.parse(respuesta);
        if(JSONRespuesta.estado==1){
          let tabla = $("#example2").DataTable();
          console.log(JSONRespuesta.estadoAct)
          let EstAct;
          if(JSONRespuesta.estadoAct == 1){
            EstAct = "Completada";
          }
          if(JSONRespuesta.estadoAct == 0){
            EstAct = "Pendiente";
          }
          if(JSONRespuesta.estadoAct == 2){
            EstAct = "Retrasada";
          }
          let Botones="";
            Botones = '<i class="fas fa-eye" style="font-size:25px;color: #af66eb; margin-right: 10px;" data-toggle="modal" data-target="#modal_read_tarea" onclick="actionReadById('+idActualizar+')"></i>';
            Botones += '<i class="fas fa-edit" style="font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_update_tarea" onclick="identificarActualizar('+idActualizar+')"></i>';    
            Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+idActualizar+')"></i>';
            Botones += '<i class="fas fa-share" style="font-size:25px;color: #1855b1; margin-right: 10px;" data-toggle="modal" data-target="#modal_share_tarea" onclick="Compartirid('+idActualizar+')"></i>';
          ////////////////////////////////////////////////
          var temp = tabla.row("#renglon_"+idActualizar).data();
          temp[0] = nom_tarea;
          temp[1] = fecha;
          temp[2] = duracion;
          temp[3] = EstAct;
          temp[4] = Botones;
          tabla.row("#renglon_"+idActualizar).data(temp).draw();
          /////////////////////////////////////////////////
          toastr.success(JSONRespuesta.mensaje);
        }else{
          toastr.error(JSONRespuesta.mensaje);
      }
      }
    });
  }
}

// -----------------  DELETE TAREAS  ------------------
// Funciona al oprimir el botón rojo de eliminar para cada tarea
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

// -----------------  MARCAR COMO COMPLETADA  ------------------
// Hace que el estado de la tarea sea 1 = "Completada"
async function marcarCompletada(estadoCompletada){
  idMarcar=idLeer;
  const email = await obtenerCorreo();

  let fechaActual = new Date();
  
  let anio = fechaActual.getFullYear();
  let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
  let dia = String(fechaActual.getDate()).padStart(2, '0');
  let fechaFormateada = anio + '-' + mes + '-' + dia;

  console.log(estadoCompletada);
  
  $.ajax({
    method:"POST",
    url: "../php/crud_tareas.php",
    data: {
      id: idMarcar,
      estadoCompletada: estadoCompletada,
      fechaHoy: fechaFormateada,
      accion:"read_idMarc",
      correo: email
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
        if(JSONRespuesta.estado==1){
          let tabla = $("#example2").DataTable();
          console.log(JSONRespuesta.estadoAct)
          let estadoCompletada;
          if(JSONRespuesta.estadoAct == 1){
            estadoCompletada = "Completada";
          }
          if(JSONRespuesta.estadoAct == 0){
            estadoCompletada = "Pendiente";
          }
          if(JSONRespuesta.estadoAct == 2){
            estadoCompletada = "Retrasada";
          }

          let nomTarea = JSONRespuesta.nom_tarea;
          let fecha = JSONRespuesta.fecha;
          let duracion = JSONRespuesta.duracion;
        
          let Botones="";
            Botones = '<i class="fas fa-eye" style="font-size:25px;color: #af66eb; margin-right: 10px;" data-toggle="modal" data-target="#modal_read_tarea" onclick="actionReadById('+idMarcar+')"></i>';
            Botones += '<i class="fas fa-edit" style="font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_update_tarea" onclick="identificarActualizar('+idMarcar+')"></i>';    
            Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+idMarcar+')"></i>';
            Botones += '<i class="fas fa-share" style="font-size:25px;color: #1855b1; margin-right: 10px;" data-toggle="modal" data-target="#modal_share_tarea"></i>';
          
          var temp = tabla.row("#renglon_"+idMarcar).data();
          temp[0] = nomTarea;
          temp[1] = fecha;
          temp[2] = duracion;
          temp[3] = estadoCompletada;
          temp[4] = Botones;
          tabla.row("#renglon_"+idMarcar).data(temp).draw();
          
          toastr.info(JSONRespuesta.mensaje);
          
      }else{
        toastr.error("No se pudo marcar como completada. Volver a intentarlo.");
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
    //alert(idActualizar);
  
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

// Recupera el nombre del usuario al que se va a compartir la tarea
function Compartirid(id) {
  idtarea = id;
  document.getElementById("nombreUsuario").value = "";  // Limpiar el campo de nombreUsuario si es necesario
}

// -----------------  SHARE TAREAS  ------------------
// Comparte una tarea de un usuario a otro
async function Compartir() {
  let nombreUsuario = document.getElementById("nombreUsuario").value;
  const email = await obtenerCorreo();
 if(nombreUsuario == "")
 {
  toastr.error("Ingrese el nombre del ususario a compartir.");
 }
 else
 {
  $.ajax({
    method: "POST",
    url: "../php/crud_tareas.php",
    data: {
      id: idtarea,
      nombre: nombreUsuario,
      correo: email,
      accion: "share"
    },
    success: function(respuesta) {
      JSONRespuesta = JSON.parse(respuesta);
      if (JSONRespuesta.estado == 1) {
        toastr.success("Se compartió la tarea con éxito.");
      } else if (JSONRespuesta.estado == 2) {
        toastr.error("Favor de elegir un nombre diferente al suyo.");
      }
      else if(JSONRespuesta.estado == 3){
        toastr.error("Error al compartir. Intentelo de nuevo.");
      } else {
        toastr.error("Nombre no encontrado en la base de datos. Favor de verificar que el nombre sea el correcto.");
      }
    }
  });
 }   
}