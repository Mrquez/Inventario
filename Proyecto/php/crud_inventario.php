<?php
    /*
    Nombre del programa: PHP para inventario
    Descripción: Son todas las funciones PHP relacionadas con el inventario
    Funciones: 
        actionCreatePHP()
        actionReadPHP()
        actionUpdatePHP()
        actionReadByIdPHP()
        actionDeletePHP()

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
    - Crear artículo -
    La función actionCreatePHP() crea en la BD los datos de un artículo nuevo y crea la relación con el usuario, los datos 
    los debe recibir desde crud_inventario.js y envía una Respuesta con lo que necesita el Javascript, y mensajes en caso de error.
    */
    function actionCreatePHP($conex){
       
        // Recupera los datos que el usuario ingresó
        $nombre = $_POST['nombre'];
        $cantidad = $_POST['cantidad'];
        $Descripcion = $_POST['Descripcion'];
        $fecha_creacion= $_POST['fecha_creacion'];
        $fecha_modificacion= $_POST['fecha_modificacion'];

        // Crea el nuevo registro de tarea en la BD
        $queryCreate = "INSERT INTO `articulo`(`nombre`,`fecha_creacion`,`fecha_modificacion`,`cantidad`,`Descripcion`) 
                        VALUES ('$nombre','$fecha_creacion','$fecha_modificacion','$cantidad','$Descripcion')";
                        if(mysqli_query($conex,$queryCreate)){
                            $Respuesta['id'] = mysqli_insert_id($conex);   
                
                                    $Respuesta['estado'] = 1;
                                    $Respuesta['mensaje'] = "El artículo se guardó correctamente";
                
                                    echo json_encode($Respuesta);
                                    mysqli_close($conex);   
                                
                
                            }else{
                                $Respuesta['estado'] = 0;
                                $Respuesta['mensaje'] = "Ocurrió un error desconocido";
                                $Respuesta['id'] = -1;
                
                                echo json_encode($Respuesta);
                                mysqli_close($conex);   
                            }
        

    }

    /* 
    - Leer atrículos -
    La función actionReadPHP() recupera todos los registros de artículos que existen en la BD.
    */
    function actionReadPHP($conex) {
        $QueryRead =    "SELECT * FROM articulo";
        $ResultadoRead = mysqli_query($conex, $QueryRead);
        $numeroRegistros = mysqli_num_rows($ResultadoRead);

        if ($numeroRegistros > 0) {
            $Respuesta['entregas'] = array();
            
            while ($RenglonEntrega = mysqli_fetch_assoc($ResultadoRead)) {
                $Entrega = array();
                $Entrega['idarticulo'] = $RenglonEntrega['idarticulo'];
                $Entrega['nombre'] = $RenglonEntrega['nombre'];
                $Entrega['Descripcion'] = $RenglonEntrega['Descripcion'];
                $Entrega['cantidad'] = $RenglonEntrega['cantidad'];
                $Entrega['fecha_creacion'] = $RenglonEntrega['fecha_creacion'];
                $Entrega['fecha_modificacion'] = $RenglonEntrega['fecha_modificacion'];

                array_push($Respuesta['entregas'], $Entrega);
            }
        } else {
            $Respuesta['estado'] = 0;
            $Respuesta['mensaje'] = "Lo siento, pero no hay registros para mostrar";
        }
        
        echo json_encode($Respuesta);
        mysqli_close($conex);
    }
    
    /* 
    - Editar artículo -
    La función actionUpdatePHP() actualiza un artículo específico de la BD.
    */
    function actionUpdatePHP($conex){
        $id = $_POST['id'];
        $nombre = $_POST['nombre'];
        $Descripcion = $_POST['Descripcion'];
        $cantidad = $_POST['cantidad'];
        $fecha_creacion= $_POST['fecha_creacion'];
        $fecha_modificacion= $_POST['fecha_modificacion'];

        $queryUpdate = "UPDATE articulo SET
                 nombre='".$nombre."',
                 Descripcion='".$Descripcion."', 
                 cantidad='".$cantidad."', 
                 fecha_creacion='".$fecha_creacion."', 
                 fecha_modificacion='".$fecha_modificacion."'
                 
                 WHERE idarticulo=".$id;   

        if(mysqli_query($conex,$queryUpdate)){
            if(mysqli_affected_rows($conex)>0){   
                $Respuesta['estado'] = 1;
                $Respuesta['mensaje'] = "El artículo se actualizó correctamente";
            }else{
                $Respuesta['estado'] = 0;
                $Respuesta['mensaje'] = "No se realizaron cambios";
            }
        }else{
            $Respuesta['estado'] = 0;
            $Respuesta['mensaje'] = "Ocurrio un error desconocido";
        } 
        echo json_encode($Respuesta);
        mysqli_close($conex);
    }

    /* 
    - Leer datos de un artículo enespecífico -
    La función actionReadByIdPHP() recupera los datos de un artículo desde la BD.
    */
    function actionReadByIdPHP($conex){
        $id                  = $_POST['id'];
        $queryReadById       = "SELECT * FROM articulo  
                                WHERE idarticulo='".$id."' ";
        $resultById          = mysqli_query($conex,$queryReadById);
        $numeroRegistrosById = mysqli_num_rows($resultById);

        if($numeroRegistrosById>0){
           
            $Respuesta['mensaje'] = "Registro encontrado";
             
            $RenglonEntregaById = mysqli_fetch_assoc($resultById);

            $Respuesta['idarticulo'] = $RenglonEntregaById['idarticulo'];
            $Respuesta['nombre'] = $RenglonEntregaById['nombre'];
            $Respuesta['cantidad'] = $RenglonEntregaById['cantidad'];
            $Respuesta['Descripcion'] = $RenglonEntregaById['Descripcion'];
            $Respuesta['fecha_creacion'] = $RenglonEntregaById['fecha_creacion'];
            $Respuesta['fecha_modificacion'] = $RenglonEntregaById['fecha_modificacion'];
           
        }else{
            
            $Respuesta['mensaje'] = "No se encuentra el registro";
        }
        echo json_encode($Respuesta);
        mysqli_close($conex);
    }

    /* 
    - Eliminar artículo -
    La función actionDeletePHP() elimina un artículo específico de la BD.
    */
    function actionDeletePHP($conex){
        $id = $_POST['id'];



            $queryEliminar = "DELETE FROM articulo WHERE idarticulo=".$id;
            mysqli_query($conex,$queryEliminar);

            if(mysqli_affected_rows($conex)>0){
                $Respuesta['estado']  = 1;
                $Respuesta['mensaje'] = "El artículo se eliminó correctamente.";
            }else{
                $Respuesta['estado']  = 0;
                $Respuesta['mensaje'] = "No se pudo eliminar el artículo.";
            }

        echo json_encode($Respuesta);
        mysqli_close($conex);
    }

?>