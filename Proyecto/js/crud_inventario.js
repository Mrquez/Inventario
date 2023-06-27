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
  let nombre = document.getElementById('nombre').value;
  let cantidad = document.getElementById('cantidad').value;
  let Descripcion = document.getElementById('Descripcion').value;

  let estadoAct;

  let fecha = new Date();
  let anio = fecha.getFullYear();
  let mes = String(fecha.getMonth() + 1).padStart(2, '0');
  let dia = String(fecha.getDate()).padStart(2, '0');
  let fecha_creacion = anio + '-' + mes + '-' + dia;
  let fecha_modificacion = fecha_creacion ;

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
  console.log(estadoAct);

  //const email = await obtenerCorreo();

  // Validaciones not null, para asegurar que llene todos los campos
  if(nombre === "" || cantidad === "" || Descripcion === "" || fecha_creacion === ""){
      console.log('No puso todos los campos');
      toastr.error("Favor de rellenar todos los campos. Intente de nuevo.");
  }else{
      var formData = new FormData();
      formData.append('nombre', nombre);
      formData.append('fecha_creacion', fecha_creacion);
      formData.append('fecha_modificacion', fecha_modificacion);
      formData.append('cantidad', cantidad);
      formData.append('Descripcion', Descripcion);
      formData.append('accion',"create");
      

      console.log(nombre);
      console.log(cantidad);
      console.log(Descripcion);
      console.log(fecha_creacion);
      console.log(fecha_modificacion);

      limpiarpagina();

      $.ajax({ 
        method:"POST",
        url: "../php/crud_inventario.php",
        data: formData,

        contentType: false,
        processData: false,
        success: function(respuesta) {
          //alert(respuesta);
          JSONRespuesta = JSON.parse(respuesta); 
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
              Botones += '<i class="fas fa-edit" style="font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_update_tarea" onclick="identificarActualizar('+JSONRespuesta.id+')"></i>';    
              Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+JSONRespuesta.id+')"></i>';
             
            tabla.row.add([nombre,Descripcion,  cantidad, fecha_creacion, fecha_modificacion, Botones]).draw().node().id="renglon_"+JSONRespuesta.id;
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


  $.ajax({
    method:"POST",
    url: "../php/crud_inventario.php",
    data: {
      accion: "read",
      correo: email,

    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
      console.log(JSONRespuesta.estado);

        tabla = $("#example2").DataTable();
            JSONRespuesta.entregas.forEach(articulo => {

              
              let Botones="";
                Botones += '<i class="fas fa-edit" style="font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_update_tarea" onclick="identificarActualizar('+articulo.idarticulo+')"></i>';    
                Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+articulo.idarticulo+')"></i>';
                
              tabla.row.add([articulo.nombre, articulo.Descripcion, articulo.cantidad, articulo.fecha_creacion,articulo.fecha_modificacion, Botones]).draw().node().id="renglon_"+articulo.idarticulo;
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
    url: "../php/crud_inventario.php",
    data: {
      id: idLeer,
      accion:"read_id"
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);
      if(JSONRespuesta.estado==1){
        let nom_tarea = document.getElementById("nombreTareaRead");
        nom_tarea.value=JSONRespuesta.nom_tarea;
        let descripcion = document.getElementById("descripcionRead");
        descripcion.value=JSONRespuesta.descripcion;
        let lugar = document.getElementById("lugarRead");
        lugar.value=JSONRespuesta.lugar;
        let fecha = document.getElementById("fechaRead");
        fecha.value=JSONRespuesta.fecha;
        let duracion = document.getElementById("duracionRead");
        duracion.value=JSONRespuesta.duracion;
        
        let completadaCheckbox = document.getElementById("completadaRead");
        completadaCheckbox.checked = JSONRespuesta.estadoAct == 1;

      }else{
        toastr.error("Registro no encontrado");
      }
    }
  });
}

// -----------------  UPDATE TAREAS  ------------------
// Funciona al oprimir el botón verde de editar para cada tarea
async function actionUpdate(){

  let nombre = document.getElementById("nombre_Update").value;
  let cantidad = document.getElementById("cantidad_Update").value;
  let Descripcion = document.getElementById("Descripcion_Update").value;
  let fecha_creacion = document.getElementById("fechaCreacion_Update").value;

  let estadoAct;

  let fechaActual = new Date();

  let anio = fechaActual.getFullYear();
  let mes = String(fechaActual.getMonth() + 1).padStart(2, '0');
  let dia = String(fechaActual.getDate()).padStart(2, '0');
  let fecha_modificacion = anio + '-' + mes + '-' + dia;

  console.log(fechaActual);
  console.log(fecha_modificacion);

  if(nombre === "" || cantidad === "" || Descripcion === "" || fecha_modificacion === "" ){
    console.log('No puso todos los campos');
    toastr.error("Favor de rellenar todos los campos. Intente de nuevo.");
  }else{
    var formData = new FormData();
        formData.append('id', idActualizar);
        formData.append('nombre', nombre);
        formData.append('Descripcion', Descripcion);
        formData.append('cantidad', cantidad);
        formData.append('fecha_creacion', fecha_creacion);
        formData.append('fecha_modificacion', fecha_modificacion);
        formData.append('accion', "update");
  
    $.ajax({
      method:"POST",
      url: "../php/crud_inventario.php",
      data: formData,
      contentType: false,
      processData: false,
      
      success: function( respuesta ) {
        JSONRespuesta = JSON.parse(respuesta);
        if(JSONRespuesta.estado==1){
          let tabla = $("#example2").DataTable();
          console.log(JSONRespuesta.estadoAct)
          let EstAct;
          
          let Botones="";
           
            Botones += '<i class="fas fa-edit" style="font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_update_tarea" onclick="identificarActualizar('+idActualizar+')"></i>';    
            Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+idActualizar+')"></i>';
            
          ////////////////////////////////////////////////
          var temp = tabla.row("#renglon_"+idActualizar).data();
          temp[0] = nombre;
          temp[1] = Descripcion;
          temp[2] = cantidad;
          temp[3] = fecha_creacion;
          temp[4] = fecha_modificacion;
          temp[5] = Botones;
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
    url: "../php/crud_inventario.php",
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
    url: "../php/crud_inventario.php",
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
    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("Descripcion").value = "";

}

//Leemos el correo de la sesion
async function obtenerCorreo() {
  const response = await fetch("../php/session.php");
  const data = await response.json();
  const user = data.correo;
  return user;
}

//Función para rellenar lo que hay en BD, para despues poder actualizar
function identificarActualizar(id){
  idActualizar=id;
  //alert(idActualizar);

  $.ajax({
    method:"POST",
    url: "../php/crud_inventario.php",
    data: {
      id: idActualizar,
      accion:"read_idAct"
    },
    success: function( respuesta ) {
      JSONRespuesta = JSON.parse(respuesta);

        let nombre = document.getElementById("nombre_Update");
        nombre.value = JSONRespuesta.nombre;
        let cantidad = document.getElementById("cantidad_Update");
        cantidad.value = JSONRespuesta.cantidad;
        let Descripcion = document.getElementById("Descripcion_Update");
        Descripcion.value = JSONRespuesta.Descripcion;
        let fecha_creacion = document.getElementById("fechaCreacion_Update");
        fecha_creacion.value = JSONRespuesta.fecha_creacion;
       
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
    url: "../php/crud_inventario.php",
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