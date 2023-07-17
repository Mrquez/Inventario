<?php
    /*
    Nombre del programa: PHP para solicituds
    Descripción: Son todas las funciones PHP relacionadas con las solicituds
    Funciones: 
        actionCreatePHP()
        actionReadPHP()
        actionUpdatePHP()
        actionReadByIdPHP()
        actionDeletePHP()
        actionMarcarPHP()
        actionShare()
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
    - CREAR solicitud -
    La función actionCreatePHP() crea en la BD los datos de una solicitud nueva
     y envía una Respuesta con lo que necesita el Javascript, y mensajes en caso de error.
    */
    function actionCreatePHP($conex){
        
        if (isset($_POST['num_empleado'])) {
            $num_empleado = $_POST['num_empleado'];
            //echo json_encode($num_empleado);
            // Realizar una consulta para obtener el ID del usuario según el correo
            $querynum_empleado = "SELECT idUsuario FROM usuario WHERE num_empleado = '$num_empleado'";
            $resultadonum_empleado = mysqli_query($conex, $querynum_empleado);
            
            // Verificar si se obtuvo algún resultado
            if ($resultadonum_empleado && mysqli_num_rows($resultadonum_empleado) > 0) {
                $fila = mysqli_fetch_assoc($resultadonum_empleado);
                $idnum_empleado = $fila['idUsuario'];
            }
        }  
        
        // Recupera los datos que el usuario ingresó
        //$fecha = $_POST['fecha'];  
        $hora_inicio = $_POST['hora_inicio'];
        $hora_fin = $_POST['hora_fin'];
        $descripcion = $_POST['descripcion'];
        $fecha_creacion= $_POST['fecha_creacion'];
        $fecha_solicitada= $_POST['fecha_solicitada'];
        $estado= $_POST['estado'];
        $num_empleado= $_POST['num_empleado'];
        $comentario= $_POST['comentario'];
        

        // Crea el nuevo registro de solicitud en la BD
        $queryCreate = "INSERT INTO `solicitud`(`fecha_creacion`, `hora_inicio`, `hora_fin`, `descripcion`, `fecha_solicitada`,`estado`,`num_empleado`,`comentario`) 
                        VALUES ('$fecha_creacion','$hora_inicio','$hora_fin','$descripcion','$fecha_solicitada','$estado','$num_empleado','$comentario')";
                        if(mysqli_query($conex,$queryCreate)){
                            $Respuesta['id'] = mysqli_insert_id($conex);   
                                    
                                    $Respuesta['estado'] = 1;
                                    $Respuesta['mensaje'] = "Se creó la solicitud correctamente";
                
                                    echo json_encode($Respuesta);
                                    mysqli_close($conex);   
                                
                
                            }else{
                                $Respuesta['estado'] = 0;
                                $Respuesta['mensaje'] = "Ocurrio un error desconocido 2";
                                $Respuesta['id'] = -1;
                
                                echo json_encode($Respuesta);
                                mysqli_close($conex);   
                            }
        
       
    }

    /* 
    - LEER solicitudes -
    La función actionReadPHP() recupera todos los registros de solicitudes que existen en la BD relacionados con
    el usuario.
    */
    function actionReadPHP($conex) {
        if (isset($_POST['num_empleado'])) {
            $num_empleado = $_POST['num_empleado'];
            
            // Realizar una consulta para obtener el ID del usuario según el correo
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
        $queryRead =    "SELECT * FROM solicitud
                        WHERE solicitud.num_empleado= '$num_empleado'";
        $resultadoRead = mysqli_query($conex, $queryRead);
        $numeroRegistros = mysqli_num_rows($resultadoRead);

       
        // Si no hay registros envía un mensaje diciendo que no hay registros para mostrar
        // Si ocurre un error dentro del if, envía mensajes de error
        if ($numeroRegistros > 0) {
            $Respuesta['entregas'] = array();
            
                while ($renglonEntrega = mysqli_fetch_assoc($resultadoRead)) {
                    if($renglonEntrega['fecha_solicitada'] >= $fechaHoy ){
                    $Entrega = array();
                    
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
    - Leer los datos de una solicitud en específico -
    La función actionReadByIdPHP() recupera los datos de una solicitud desde la BD relacionada con
    el usuario.
    */
    function actionReadByIdPHP($conex){
        $id = $_POST['id'];

        // Lee los datos del registro según el id de la solicitud
        $queryReadById = "SELECT * FROM solicitud 
                                WHERE idSolicitud='".$id."'";

        $resultById = mysqli_query($conex,$queryReadById);
        $numeroRegistrosById = mysqli_num_rows($resultById);

        // Si encuentra el registro, guarda los datos en $Respuesta
        // Sino envía un mensaje de error
        if($numeroRegistrosById>0){
            $Respuesta['estado']  = 1;
            $Respuesta['mensaje'] = "Registro encontrado";
             
            $renglonEntregaById = mysqli_fetch_assoc($resultById);

            $Respuesta['idSolicitud'] = $renglonEntregaById['idSolicitud'];
            $Respuesta['fecha_solicitada'] = $renglonEntregaById['fecha_solicitada'];
            $Respuesta['fecha_creacion'] = $renglonEntregaById['fecha_creacion'];
            $Respuesta['hora_inicio'] = $renglonEntregaById['hora_inicio'];
            $Respuesta['hora_fin'] = $renglonEntregaById['hora_fin'];
            $Respuesta['descripcion'] = $renglonEntregaById['descripcion'];
            $Respuesta['estado'] = $renglonEntregaById['estado'];
            $Respuesta['comentario'] = $renglonEntregaById['comentario'];
           // $Respuesta['estadoAct'] = $renglonEntregaById['estado'];
        }else{
            $Respuesta['estado'] = 0;
            $Respuesta['mensaje'] = "No se encuentra el registro";
        }

        // Envía la respuesta para poder utilizarla en el javascript
        echo json_encode($Respuesta);
        mysqli_close($conex);
    }

    /* 
    - Eliminar solicitud -
    La función actionDeletePHP() elimina una solicitud específica de la BD la cual debe estar relacionada con
    el usuario.
    */
    function actionDeletePHP($conex){
        $id = $_POST['id'];

            $queryEliminar = "DELETE FROM solicitud WHERE idSolicitud=".$id;
            mysqli_query($conex,$queryEliminar);

            if(mysqli_affected_rows($conex)>0){
                $Respuesta['estado']  = 1;
                $Respuesta['mensaje'] = "La Solicitud se eliminó correctamente.";
            }else{
                $Respuesta['estado']  = 0;
                $Respuesta['mensaje'] = "No se pudo eliminar la solicitud.";
            }

        // Envía la respuesta para poder utilizarla en el javascript
        echo json_encode($Respuesta);
        mysqli_close($conex);
    }

?>