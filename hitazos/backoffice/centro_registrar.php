<?php
$_global_active = "centros";
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $nombre = $_POST["nombre"];
  $red = $_POST["red"];
  $categoria = $_POST["categoria"];
  $pais = $_POST["pais"];
  $ciudad = $_POST["ciudad"];
  $direccion = $_POST["direccion"];
  $telefono1 = $_POST["telefono1"];
  $telefono2 = $_POST["telefono2"];
  $telefono3 = $_POST["telefono3"];
  $email = $_POST["email"];
  $horarios = $_POST["horarios"];
  $resonsable = $_POST["responsable"];
  $telefonoresponsable = $_POST["telefonoresponsable"];
  $idgrupotarifa = $_POST["idgrupotarifa"];
  $idmaster = $_POST["idmaster"];

  if($idgrupotarifa==0)
    $idgrupotarifa = $_POST["nuevogrupotarifa"];

  if($red==0)
    $red = $_POST["nuevared"];

  if($pais==0)
    $pais = $_POST["nuevopais"];

  $q = mysql_query("
  Insert into centros
  (Nombre, Red, Categoria, Pais, Ciudad, Direccion, Telefono1, Telefono2, Telefono3, Email, Horarios, Responsable, TelefonoResponsable, IDGrupoTarifa, idMaster, Status)
  Values
  ('$nombre', '$red', '$categoria', '$pais', '$ciudad', '$direccion', '$telefono2', '$telefono3', '$email', '$horarios', '$resonsable', '$telefonoresponsable', '$idgrupotarifa', '$idmaster', 1)
  ") or die(mysql_error());

  echo("<script>alert('Registro exitoso'); window.location.href='centros.php';</script>");
}

$query = "SELECT idgrupotarifa, nombre
          FROM  `centros`
          GROUP BY idgrupotarifa
          ORDER BY idgrupotarifa";
$q = mysql_query($query) or die(mysql_error());

//Obtenemos todas las redes
$query = "SELECT red
          FROM centros
          GROUP BY red
          ORDER BY 1 ";
$redes = mysql_query($query) or die(mysql_error());

//Obtenemos todos los paises
$query = "SELECT pais
          FROM centros
          GROUP BY pais
          ORDER BY 1";
$paises = mysql_query($query) or die(mysql_error());

//Obtenemos todos los paises
$query = "SELECT id, nombre
          FROM centros
          WHERE idmaster =0
          AND nombre <>  'HOME PRODUCTS'
          AND nombre <>  'Contact Center'
          GROUP BY id, nombre
          ORDER BY nombre";

$masters = mysql_query($query) or die(mysql_error());
?>
<div class="xs">
   <h3>Nuevo CD´s</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="productos_registrar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">Master</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="idmaster" name="idmaster" ng-model="model.idmaster" required="">
            <option value="0">Master</option>
            <?php
            while ($row = mysql_fetch_array($masters))
            {
            ?>
            <option value="<?= $row["id"]?>"><?= $row["nombre"]?></option>
            <?php
            }
            ?>


            <!--option value="1">R&P ELECTRONICS</option>
            <option value="18">RAYNET</option>
            <option value="6">ALBONSA</option>
            <option value="16">RYASA</option>
            <option value="19">REDELEC</option>
            <option value="8">SERVICIO MASTER</option>
            <option value="7">ILAE</option>
            <option value="24">CENSEL</option>
            <option value="22">SERVICENTER</option>
            <option value="21">PLUS SERVICES</option>
            <option value="25">ELECTROSERVICES</option>
            <option value="28">MOBIPLUS</option-->
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Nombre</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="nombre" name="nombre" ng-model="model.nombre" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Red</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="red" name="red" ng-model="model.red" required="">
           <!--option value="? undefined:undefined ?"></option>
           <option value="Master R&P"P>Master R&P</option>
           <option value="Red Albon">Red Albon</option>
           <option value="Red Censel">Red Censel</option>
           <option value="Red Electroservices">Red Electroservices</option>
           <option value="Red ILAE">Red ILAE</option>
           <option value="Red Mobiplus">Red Mobiplus</option>
           <option value="Red Plusservices">Red Plusservices</option>
           <option value="Red Raynet">Red Raynet</option>
           <option value="Red Redelec">Red Redelec</option>
           <option value="Red Ryasa">Red Ryasa</option>
           <option value="Red Servicenter">Red Servicenter</option>
           <option value="Red SMEcuador">Red SMEcuador</option-->
           <?php
           while ($row = mysql_fetch_array($redes))
           {
           ?>
           <option value="<?= $row["red"]?>"><?= $row["red"]?></option>
           <?php
           }
           ?>
           <option value="0">Nueva red</option>
         </select>
         <input type="text" placeholder="Nombre de la red" class="form-control1 ng-invalid ng-invalid-required ng-touched m-t-sm" id="nuevared" name="nuevared" ng-model="model.nuevared">
       </div>
       <div class="form-group">
         <label class="control-label">Categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="categoria" name="categoria" ng-model="model.categoria" required=""><option value="? undefined:undefined ?"></option>
           <option value="LB">LB</option>
           <option value="LB & MWO">LB & MWO</option>
           <option value="MWO">MWO</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">País</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="pais" name="pais" ng-model="model.pais" required="">
           <?php
           while ($row = mysql_fetch_array($paises))
           {
           ?>
           <option value="<?= $row["pais"]?>"><?= $row["pais"]?></option>
           <?php
           }
           ?>
           <!--option value="Argentina">Argentina</option>
           <option value="Bolivia">Bolivia</option>
           <option value="Chile">Chile</option>
           <option value="Colombia">Colombia</option>
           <option value="Costa Rica">Costa Rica</option>
           <option value="Ecuador">Ecuador</option>
           <option value="El Salvador">El Salvador</option>
           <option value="Guatemala">Guatemala</option>
           <option value="Honduras">Honduras</option>
           <option value="Nicaragua">Nicaragua</option>
           <option value="Panamá">Panamá</option>
           <option value="Perú">Perú</option>
           <option value="República Dominicana">República Dominicana</option-->
           <option value="0">Otro país</option>
         </select>
         <input type="text" placeholder="Nombre del país" class="form-control1 ng-invalid ng-invalid-required ng-touched m-t-sm" id="nuevopais" name="nuevopais" ng-model="model.nuevopais">
       </div>
       <div class="form-group">
         <label class="control-label">Ciudad</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="ciudad" name="ciudad" ng-model="model.ciudad" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Dirección</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="direccion" name="direccion" ng-model="model.direccion" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Teléfono 1</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="telefono1" name="telefono1" ng-model="model.telefono1" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Teléfono 2</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="telefono2" name="telefono2" ng-model="model.telefono2" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Teléfono 3</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="telefono3" name="telefono3" ng-model="model.telefono3" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Email</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="email" name="email" ng-model="model.email" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Horarios</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="horarios" name="horarios" ng-model="model.horarios" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Responsable</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="responsable" name="responsable" ng-model="model.responsable" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Teléfono Responsable</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="telefonoresponsable" name="telefonoresponsable" ng-model="model.telefonoresponsable" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Grupo tarifa</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="idgrupotarifa" name="idgrupotarifa" ng-model="model.idgrupotarifa" required="">
           <option value="0">Nuevo grupo tarifa</option>
           <?php
           $joe = 1;
           while ($row = mysql_fetch_array($q))
           {
           ?>
           <option value="<?= $row["idgrupotarifa"]?>"><?= $row["idgrupotarifa"]?> - <?= utf8_encode($row["nombre"])?></option>
           <?php
           $joe++;
           }
           ?>
           <!--option value="1">1</option>
           <option value="2">2</option>
           <option value="3">3</option>
           <option value="4">4</option>
           <option value="5">5</option>
           <option value="6">6</option>
           <option value="7">7</option>
           <option value="8">8</option>
           <option value="9">9</option>
           <option value="10">10</option>
           <option value="11">11</option>
           <option value="12">12</option>
           <option value="13">13</option>
           <option value="14">14</option>
           <option value="15">15</option>
           <option value="16">16</option>
           <option value="17">17</option>
           <option value="18">18</option>
           <option value="19">19</option>
           <option value="20">20</option>
           <option value="21">21</option>
           <option value="22">22</option>
           <option value="23">23</option>
           <option value="24">24</option-->
         </select>
         <input type="hidden" name="nuevogrupotarifa" value="<?= $joe?>" />
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Registrar</button>
         <button type="reset" class="btn btn-default" onclick="javaScript: window.location.href='centros.php'">Cancelar</button>
       </div>
     </fieldset>
     <input type="hidden" value="1" name="postback">
   </form>
 </div>
</div>
<?php include 'inc_footer.php'; ?>
<script src="js/custom.js"></script>
<script type="text/javascript">
  $("#categoria").change(function () {
      var categoria = this.value;
      $(".data-lineablanca").show();
      $(".data-menaje").show();

      if(categoria=='LINEA BLANCA')
        $(".data-menaje").hide();
      else
        $(".data-lineablanca").hide();
  });

  $(document).ready(function(){
    $("#nuevared").hide();
  });
  $("#red").change(function(){
    if($(this).val()==0){
      $("#nuevared").show();
    }else{
      $("#nuevared").hide();
    }
  });
  $("#pais").change(function(){
    if($(this).val()==0){
      $("#nuevopais").show();
    }else{
      $("#nuevopais").hide();
    }
  });
</script>
