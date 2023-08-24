<?php
    /*
    Nombre del programa: PHP para tareas
    Descripción: Son todas las funciones PHP relacionadas con las tareas
    Funciones: 
        actionReadPHP()
        actionUpdatePHP()
        actionReadByIdPHP()

    */
    
    //Conexión a la base de datos
    include 'connect.php';
    $Respuesta = array();
    $accion    = $_POST['accion'];

    switch ($accion) {
        case 'create':
            actionCreatePHP($conex);
            break;
        case 'update':
            actionUpdatePHP($conex);
            break;
        case 'delete':
            actionDeletePHP($conex);
            break;
        case 'read':
            actionReadPHP($conex);
            break;
        case 'read_id':
            actionReadByIdPHP($conex);
            break;
        case 'read_idAct':
            actionReadByIdPHP($conex);
            break;
        case 'read_idMarc':
            actionMarcarPHP($conex);
            break;
        case 'share':
            actionShare($conex);
        default:
            # code...
            break;
    }

   
    /* 
    - Ler solicitudes -
    La función actionReadPHP() recupera todos los registros de solicitudes que existen en la BD
    siempre y cuendo no haya pasado la fecha solicitada.
    */
    function actionReadPHP($conex) {
        if (isset($_POST['num_empleado'])) {
            $num_empleado = $_POST['num_empleado'];

            $querynum_empleado = "SELECT idUsuario FROM usuario WHERE num_empleado = '$num_empleado'";
            $resultadonum_empleado = mysqli_query($conex, $querynum_empleado);
            
            // Verificar si se obtuvo algún resultado
            if ($resultadonum_empleado && mysqli_num_rows($resultadonum_empleado) > 0) {
                $fila = mysqli_fetch_assoc($resultadonum_empleado);
                $idnum_empleado = $fila['idUsuario'];
            }
        }        

        $fechaHoy = $_POST['fechaHoy'];

        // Recopila todos los registros de solicitudes que están relacionados con la sesión del usuario
        $queryRead =    "SELECT u.nom_usuario, s.* FROM usuario u, solicitud s WHERE u.num_empleado=s.num_empleado";
        $resultadoRead = mysqli_query($conex, $queryRead);
        $numeroRegistros = mysqli_num_rows($resultadoRead);
        // Si hay registros los envía al Javascript
        // Si no hay registros envía un mensaje diciendo que no hay registros para mostrar
        // Si ocurre un error dentro del if, envía mensajes de error
        if ($numeroRegistros > 0) {
            $Respuesta['entregas'] = array();
            
                while ($renglonEntrega = mysqli_fetch_assoc($resultadoRead)) {
                    if($renglonEntrega['fecha_solicitada'] >= $fechaHoy ){
                       
                        $Entrega = array();
                        $Entrega['nom_usuario'] = $renglonEntrega['nom_usuario'];
                        $Entrega['idSolicitud'] = $renglonEntrega['idSolicitud'];
                        $Entrega['fecha_solicitada'] = $renglonEntrega['fecha_solicitada'];
                        $Entrega['descripcion'] = $renglonEntrega['descripcion'];
                        $Entrega['estado'] = $renglonEntrega['estado'];
                        array_push($Respuesta['entregas'], $Entrega);
                }
            }
        } else {
            
            $Respuesta['mensaje'] = "Lo siento, pero no hay registros para mostrar";
        }
        
        // Envía la respuesta para poder utilizarla en el javascript
        echo json_encode($Respuesta);
        mysqli_close($conex); 
    }
    
    /* 
    - Editar solicitud -
    La función actionUpdatePHP() actualiza una solicitud específica de la BD
    unicamente actualiza su estado y comentario.
    */
    function actionUpdatePHP($conex){
        $id = $_POST['id'];

        $fecha_solicitada = $_POST['fecha_solicitada'];
        $fecha_creacion = $_POST['fecha_creacion'];
        $hora_inicio = $_POST['hora_inicio'];
        $hora_fin = $_POST['hora_fin'];
        $descripcion = $_POST['descripcion'];
        $comentario = $_POST['comentario'];
        $estado = $_POST['estado'];

        
        $queryUpdate = "UPDATE solicitud SET
                 
                 descripcion='".$descripcion."', 
                 comentario='".$comentario."',
                 hora_inicio='".$hora_inicio."',
                 hora_fin='".$hora_fin."',
                 estado='".$estado."',
                 fecha_creacion='".$fecha_creacion."', 
                 fecha_solicitada='".$fecha_solicitada."'
                 
                 WHERE idSolicitud=".$id;   

        if(mysqli_query($conex,$queryUpdate)){
            if(mysqli_affected_rows($conex)>0){  
                $Respuesta['mensaje'] = "Se respondió la solicitud correctamente";
            }else{
                $Respuesta['mensaje'] = "No se realizaron cambios";
            }
        }else{
            $Respuesta['estado'] = 0;
            $Respuesta['mensaje'] = "Ocurrió un error desconocido";
        } 
        echo json_encode($Respuesta);
        mysqli_close($conex);
    }

    /* 
    - Leer los datos de una solicitud específica -
    La función actionReadByIdPHP() recupera los datos de una solicitud .
    */
    function actionReadByIdPHP($conex){
        $id = $_POST['id'];

        // Lee los datos del registro según el id de la solicitud
        $queryReadById = "SELECT u.nom_usuario, s.* FROM usuario u, solicitud s WHERE u.num_empleado=s.num_empleado AND s.idSolicitud='".$id."'";
         
        $resultById = mysqli_query($conex,$queryReadById);
        $numeroRegistrosById = mysqli_num_rows($resultById);

        // Si encuentra el registro, guarda los datos en $Respuesta
        // Sino envía un mensaje de error
        if($numeroRegistrosById>0){
            $Respuesta['estado']  = 1;
             
            $renglonEntregaById = mysqli_fetch_assoc($resultById);

            $Respuesta['idSolicitud'] = $renglonEntregaById['idSolicitud'];
            $Respuesta['nom_usuario'] = $renglonEntregaById['nom_usuario'];
            $Respuesta['fecha_solicitada'] = $renglonEntregaById['fecha_solicitada'];
            $Respuesta['fecha_creacion'] = $renglonEntregaById['fecha_creacion'];
            $Respuesta['hora_inicio'] = $renglonEntregaById['hora_inicio'];
            $Respuesta['hora_fin'] = $renglonEntregaById['hora_fin'];
            $Respuesta['descripcion'] = $renglonEntregaById['descripcion'];
            $Respuesta['estado'] = $renglonEntregaById['estado'];
            $Respuesta['comentario'] = $renglonEntregaById['comentario'];
        }else{
            $Respuesta['estado'] = 0;
            $Respuesta['mensaje'] = "No se encuentra el registro";
        }

        // Envía la respuesta para poder utilizarla en el javascript
        echo json_encode($Respuesta);
        mysqli_close($conex);
    }


?>