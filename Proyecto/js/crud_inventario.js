/*

*/

let idEliminar=0;
let idActualizar=0;
let idLeer=0;
let idMarcar=0;

// ----------------  Crear artículo  -----------------
// Funciona al oprimir el botón de Nuevo artículo


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

  console.log(estadoAct);

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
          
          JSONRespuesta = JSON.parse(respuesta); 
          if(JSONRespuesta.estado==1){
            
            tabla = $("#example2").DataTable();
            
            let Botones="";
              Botones += '<i class="fas fa-edit" style="font-size:25px;color: #168645; margin-right: 10px;" data-toggle="modal" data-target="#modal_update_tarea" onclick="identificarActualizar('+JSONRespuesta.id+')"></i>';    
              Botones += '<i class="fas fa-trash" style="font-size:25px;color: #da2c2c; margin-right: 10px;" data-toggle="modal" data-target="#modal_delete_tarea" onclick="identificarEliminar('+JSONRespuesta.id+')"></i>';
             
            tabla.row.add([nombre,Descripcion,  cantidad, fecha_creacion, fecha_modificacion, Botones]).draw().node().id="renglon_"+JSONRespuesta.id;
            toastr.success(JSONRespuesta.mensaje);
          }else{
            toastr.error(JSONRespuesta.mensaje);
          }
        }
    });
  }    
}

// -----------------  Leer los artículos  ------------------
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


// -----------------  Actualizar artículo  ------------------
// Funciona al oprimir el botón verde de editar para cada artículo
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

// -----------------  Eliminar artículo  ------------------
// Funciona al oprimir el botón rojo de eliminar para cada artículo
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



//Limpia las variables del create
function limpiarpagina()
{
    document.getElementById("nombre").value = "";
    document.getElementById("cantidad").value = "";
    document.getElementById("Descripcion").value = "";

}

//Leemos el numero de empleado de la sesion
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


