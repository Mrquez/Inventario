
/*
Nombre del programa: register.js
Descripción:
Contiene las funciones necesarias para mostrar hacer el registro validado de usuarios
*/

function validateForm(){
    var x = document.forms["registrar"]["num_empleado"].value;
    var x1 = document.forms["registrar"]["contrasena"].value;
    var x2 = document.forms["registrar"]["nom_usuario"].value;
    var x3 = document.forms["registrar"]["contrasena2"].value;


      if(x==""|| x1=="" || x2==""){

        document.getElementById('error-message1').style.display = 'block';
        document.getElementById('error-message2').style.display = 'none';
        document.getElementById('condif').style.display = 'none';
        return false;

      }
      else if (x != x1){
        document.getElementById('condif').style.display = 'block';
        document.getElementById('error-message2').style.display = 'none';
        document.getElementById('error-message1').style.display = 'none';
        return false;
      }
      else if(x1 != x3)
      {
        document.getElementById('error-message1').style.display = 'none';
        document.getElementById('error-message2').style.display = 'block';
        document.getElementById('condif').style.display = 'none';
        return false;
      }
    } 