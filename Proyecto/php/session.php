<?php
 /* 
Nombre del programa: session.php
Descripción: Este documento funciona para saber si existe una sesion o es nula y recuperar el correo del
usuario que ha iniciado sesión
Funciones: ninguna
*/ 

    session_start();
    $num_empleado = isset($_SESSION['num_empleado']) ? $_SESSION['num_empleado'] : null;
    echo json_encode(array('num_empleado' => $num_empleado));
?>

