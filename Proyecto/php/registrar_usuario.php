<?php
 /* 
Nombre del programa: registar_usuario.php
Descripción: Este documento permite dar de alta a un usuario en la base de datos
Funciones: ninguna
*/ 

include('connect.php');

$nom_usuario=$_POST['nom_usuario'];
$num_empleado=$_POST['num_empleado'];
$contrasena=$_POST['contrasena'];

$consulta = "SELECT * FROM usuario WHERE num_empleado = '$num_empleado'";
$resultado = mysqli_query($conex,$consulta);
$rconsulta = mysqli_num_rows($resultado);

if($rconsulta)
{
    echo "
    <script>
        alert('El num_empleado ya se encuentra asociado a un usuario');
        window.location = '../html/register.html';
    </script>
    ";
}
else
{
    $query = "INSERT INTO usuario(nom_usuario,num_empleado,contrasena) VALUES ('$nom_usuario','$num_empleado','$contrasena')";
    $resultado = mysqli_query($conex,$query);
    echo "
    <script>
        alert('El usuario se registro correctamente');
        window.location = '../html/index.html';
    </script>
    ";

        if($resultado)
    {
        echo "
        <script>
            document.getElementById('good').style.display = 'none';
        </script>
        ";

    }
}

?>