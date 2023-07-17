<?php
 /* 
Nombre del programa: validar_ingreso.php
Descripción: Este documento permite revisar que el usuario con el que se desea iniciar sesión existe y
redireccionarlo a la pantalla de incio
Funciones: ninguna
*/ 

include('connect.php');
session_start();

$num_empleado = $_POST['num_empleado'];
$contrasena = $_POST['contrasena'];

$_SESSION['num_empleado'] = $num_empleado;

$consulta = "SELECT * FROM usuario WHERE num_empleado= '$num_empleado' and contrasena ='$contrasena'";
$resultado = mysqli_query($conex,$consulta);
$datos = mysqli_fetch_array($resultado);
$filas = mysqli_num_rows($resultado);
// if($filas=='0')
// {
    
//     header("location:../html/index.html");
// }

if($filas)
{
    
    header("location:../html/inicio.html");
}
else{
    echo "<script>
            alert('El numero de empleado no se encuentra asociado a un usuario');
            window.location = '../html/index.html';
       </script>";
    
}

mysqli_free_result($resultado);
mysqli_close($conex);
?>
