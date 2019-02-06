<?php
$_global_active = "centros";
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $id_centro = $_POST["id"];

  $q = mysql_query("
  update centros set
  status=2
  where id = $id_centro
  ") or die(mysql_error());

  echo("<script>alert('Registro eliminado'); window.location.href='centros.php';</script>");
}else{
  $id_centro = $_GET["id"];
  if($id_centro==""){
    header("Location: centros");
    die();
  }
  $mensaje = "Favor de confirmar que desea eliminar el CD´s.";
}
//die();
$query = "select * from centros Where id=$id_centro";
$q = mysql_query($query) or die(mysql_error());

while ($row = mysql_fetch_array($q))
{
  $nombre = $row["Nombre"];
  $red = $row["Red"];
  $categoria = $row["Categoria"];
  $pais = $row["Pais"];
  $ciudad = $row["Ciudad"];
  $direccion = $row["Direccion"];
  $telefono1 = $row["Telefono1"];
  $telefono2 = $row["Telefono2"];
  $telefono3 = $row["Telefono3"];
  $email = $row["Email"];
  $horarios = $row["Horarios"];
  $resonsable = $row["Responsable"];
  $telefonoresponsable = $row["TelefonoResponsable"];
  $idgrupotarifa = $row["IDGrupoTarifa"];
  $idmaster = $row["idMaster"];
}
?>
<div class="xs">
   <h3>Eliminar CD´s</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="centro_eliminar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">Master</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="idmaster" name="idmaster" ng-model="model.idmaster" disabled>
            <option value="? undefined:undefined ?">Master</option>
            <option value="1" <?php if($idmaster=='1') echo('selected'); ?>>R&P ELECTRONICS</option>
            <option value="18" <?php if($idmaster=='18') echo('selected'); ?>>RAYNET</option>
            <option value="6" <?php if($idmaster=='6') echo('selected'); ?>>ALBONSA</option>
            <option value="16" <?php if($idmaster=='16') echo('selected'); ?>>RYASA</option>
            <option value="19" <?php if($idmaster=='19') echo('selected'); ?>>REDELEC</option>
            <option value="8" <?php if($idmaster=='8') echo('selected'); ?>>SERVICIO MASTER</option>
            <option value="7" <?php if($idmaster=='7') echo('selected'); ?>>ILAE</option>
            <option value="24" <?php if($idmaster=='24') echo('selected'); ?>>CENSEL</option>
            <option value="22" <?php if($idmaster=='22') echo('selected'); ?>>SERVICENTER</option>
            <option value="21" <?php if($idmaster=='21') echo('selected'); ?>>PLUS SERVICES</option>
            <option value="25" <?php if($idmaster=='25') echo('selected'); ?>>ELECTROSERVICES</option>
            <option value="28" <?php if($idmaster=='28') echo('selected'); ?>>MOBIPLUS</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Nombre</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="nombre" name="nombre" ng-model="model.nombre" value="<?= $nombre ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Red</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="red" name="red" ng-model="model.red"  disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="Master R&P" <?php if($red=='Master R&P') echo('selected'); ?>>Master R&P</option>
           <option value="Red Albon" <?php if($red=='Red Albon') echo('selected'); ?>>Red Albon</option>
           <option value="Red Censel" <?php if($red=='Red Censel') echo('selected'); ?>>Red Censel</option>
           <option value="Red Electroservices" <?php if($red=='Red Electroservices') echo('selected'); ?>>Red Electroservices</option>
           <option value="Red ILAE" <?php if($red=='Red ILAE') echo('selected'); ?>>Red ILAE</option>
           <option value="Red Mobiplus" <?php if($red=='Red Mobiplus') echo('selected'); ?>>Red Mobiplus</option>
           <option value="Red Plusservices" <?php if($red=='Red Plusservices') echo('selected'); ?>>Red Plusservices</option>
           <option value="Red Raynet" <?php if($red=='Red Raynet') echo('selected'); ?>>Red Raynet</option>
           <option value="Red Redelec" <?php if($red=='Red Redelec') echo('selected'); ?>>Red Redelec</option>
           <option value="Red Ryasa" <?php if($red=='Red Ryasa') echo('selected'); ?>>Red Ryasa</option>
           <option value="Red Servicenter" <?php if($red=='Red Servicenter') echo('selected'); ?>>Red Servicenter</option>
           <option value="Red SMEcuador" <?php if($red=='Red SMEcuador') echo('selected'); ?>>Red SMEcuador</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="categoria" name="categoria" ng-model="model.categoria"  disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="LB" <?php if($categoria=='LB') echo('selected'); ?>>LB</option>
           <option value="LB & MWO" <?php if($categoria=='LB & MWO') echo('selected'); ?>>LB & MWO</option>
           <option value="MWO" <?php if($categoria=='MWO') echo('selected'); ?>>MWO</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">País</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="pais" name="pais" ng-model="model.pais"  disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="Argentina" <?php if($pais=='Argentina') echo('selected'); ?>>Argentina</option>
           <option value="Bolivia" <?php if($pais=='Bolivia') echo('selected'); ?>>Bolivia</option>
           <option value="Chile" <?php if($pais=='Chile') echo('selected'); ?>>Chile</option>
           <option value="Colombia" <?php if($pais=='Colombia') echo('selected'); ?>>Colombia</option>
           <option value="Costa Rica" <?php if($pais=='Costa Rica') echo('selected'); ?>>Costa Rica</option>
           <option value="Ecuador" <?php if($pais=='Ecuador') echo('selected'); ?>>Ecuador</option>
           <option value="El Salvador" <?php if($pais=='El Salvador') echo('selected'); ?>>El Salvador</option>
           <option value="Guatemala" <?php if($pais=='Guatemala') echo('selected'); ?>>Guatemala</option>
           <option value="Honduras" <?php if($pais=='Honduras') echo('selected'); ?>>Honduras</option>
           <option value="Nicaragua" <?php if($pais=='Nicaragua') echo('selected'); ?>>Nicaragua</option>
           <option value="Panamá" <?php if($pais=='Panamá') echo('selected'); ?>>Panamá</option>
           <option value="Perú" <?php if($pais=='Perú') echo('selected'); ?>>Perú</option>
           <option value="República Dominicana" <?php if($pais=='República Dominicana') echo('selected'); ?>>República Dominicana</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Ciudad</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="ciudad" name="ciudad" ng-model="model.ciudad" value="<?= $ciudad ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Dirección</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="direccion" name="direccion" ng-model="model.direccion" value="<?= $direccion ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Teléfono 1</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="telefono1" name="telefono1" ng-model="model.telefono1" value="<?= $telefono1 ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Teléfono 2</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="telefono2" name="telefono2" ng-model="model.telefono2" value="<?= $telefono1 ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Teléfono 3</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="telefono3" name="telefono3" ng-model="model.telefono3" value="<?= $telefono2 ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Email</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="email" name="email" ng-model="model.email" value="<?= $email ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Horarios</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="horarios" name="horarios" ng-model="model.horarios" value="<?= $horarios ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Responsable</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="responsable" name="responsable" ng-model="model.responsable" value="<?= $resonsable ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Teléfono Responsable</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="telefonoresponsable" name="telefonoresponsable" ng-model="model.telefonoresponsable" value="<?= $telefonoresponsable ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Grupo tarifa</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="idgrupotarifa" name="idgrupotarifa" ng-model="model.idgrupotarifa"  disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="1" <?php if($idgrupotarifa=='1') echo('selected'); ?>>1</option>
           <option value="2" <?php if($idgrupotarifa=='2') echo('selected'); ?>>2</option>
           <option value="3" <?php if($idgrupotarifa=='3') echo('selected'); ?>>3</option>
           <option value="4" <?php if($idgrupotarifa=='4') echo('selected'); ?>>4</option>
           <option value="5" <?php if($idgrupotarifa=='5') echo('selected'); ?>>5</option>
           <option value="6" <?php if($idgrupotarifa=='6') echo('selected'); ?>>6</option>
           <option value="7" <?php if($idgrupotarifa=='7') echo('selected'); ?>>7</option>
           <option value="8" <?php if($idgrupotarifa=='8') echo('selected'); ?>>8</option>
           <option value="9" <?php if($idgrupotarifa=='9') echo('selected'); ?>>9</option>
           <option value="10" <?php if($idgrupotarifa=='10') echo('selected'); ?>>10</option>
           <option value="11" <?php if($idgrupotarifa=='11') echo('selected'); ?>>11</option>
           <option value="12" <?php if($idgrupotarifa=='12') echo('selected'); ?>>12</option>
           <option value="13" <?php if($idgrupotarifa=='13') echo('selected'); ?>>13</option>
           <option value="14" <?php if($idgrupotarifa=='14') echo('selected'); ?>>14</option>
           <option value="15" <?php if($idgrupotarifa=='15') echo('selected'); ?>>15</option>
           <option value="16" <?php if($idgrupotarifa=='16') echo('selected'); ?>>16</option>
           <option value="17" <?php if($idgrupotarifa=='17') echo('selected'); ?>>17</option>
           <option value="18" <?php if($idgrupotarifa=='18') echo('selected'); ?>>18</option>
           <option value="19" <?php if($idgrupotarifa=='19') echo('selected'); ?>>19</option>
           <option value="20" <?php if($idgrupotarifa=='20') echo('selected'); ?>>20</option>
           <option value="21" <?php if($idgrupotarifa=='21') echo('selected'); ?>>21</option>
           <option value="22" <?php if($idgrupotarifa=='22') echo('selected'); ?>>22</option>
           <option value="23" <?php if($idgrupotarifa=='23') echo('selected'); ?>>23</option>
           <option value="24" <?php if($idgrupotarifa=='24') echo('selected'); ?>>24</option>
         </select>
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Eliminar</button>
         <button type="reset" class="btn btn-default" onclick="javaScript: window.location.href='centros.php'">Cancelar</button>
       </div>
     </fieldset>
     <input type="hidden" value="1" name="postback">
     <input type="hidden" value="<?= $id_centro ?>" name="id">
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
</script>
