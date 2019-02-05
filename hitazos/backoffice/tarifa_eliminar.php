<?php
error_reporting(E_ERROR | E_PARSE);


include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $id_tarifa = $_POST["id"];

  $q = mysql_query("
  update tarifas set
  status=2
  where id = $id_tarifa
  ") or die(mysql_error());

  echo("<script>alert('Registro eliminado'); window.location.href='tarifas.php';</script>");
}else{
  $id_tarifa = $_GET["id"];
  if($id_tarifa==""){
    header("Location: tarifas.php");
    die();
  }
  $mensaje = "Favor de confirmar que desea eliminar la tarifa.";
}
//die();
$query = "select * from tarifas Where id=$id_tarifa";
$q = mysql_query($query) or die(mysql_error());

while ($row = mysql_fetch_array($q))
{
  $idgrupotarifa = $row["IDGrupoTarifa"];
  $tipotarifa = $row["TipoTarifa"];
  $tiposervicio = $row["TipoServicio"];
  $subtiposervicio = $row["SubtipoServicio"];
  $valor = $row["Valor"];
  $impuesto = $row["Impuesto"];
  $tarifamensual = $row["TarifaMensual"];
  $impuestotarifamensual = $row["ImpuestoTarifaMensual"];
  $necesitaautorizacion = $row["NecesitaAutorizacion"];
}
?>
<div class="xs">
   <h3>Eliminar tarifa</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="tarifa_editar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">Grupo tarifa</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="idgrupotarifa" name="idgrupotarifa" ng-model="model.idgrupotarifa" disabled>
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
         <label class="control-label">Tipo Tarifa</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tipotarifa" name="tipotarifa" ng-model="model.tipotarifa" disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="AIRE ACONDICIONADO" <?php if($tipotarifa=='AIRE ACONDICIONADO') echo('selected'); ?>>AIRE ACONDICIONADO</option>
           <option value="CAMPANAS/VENTILACION" <?php if($tipotarifa=='CAMPANAS/VENTILACION') echo('selected'); ?>>CAMPANAS/VENTILACION</option>
           <option value="CONGELADOR" <?php if($tipotarifa=='CONGELADOR') echo('selected'); ?>>CONGELADOR</option>
           <option value="CONGELADOR HORIZONTAL" <?php if($tipotarifa=='CONGELADOR HORIZONTAL') echo('selected'); ?>>CONGELADOR HORIZONTAL</option>
           <option value="DISPENSADOR DE AGUA" <?php if($tipotarifa=='DISPENSADOR DE AGUA') echo('selected'); ?>>DISPENSADOR DE AGUA</option>
           <option value="ESTUFA" <?php if($tipotarifa=='ESTUFA') echo('selected'); ?>>ESTUFA</option>
           <option value="LAVADORA" <?php if($tipotarifa=='LAVADORA') echo('selected'); ?>>LAVADORA</option>
           <option value="MICROONDA" <?php if($tipotarifa=='MICROONDA') echo('selected'); ?>>MICROONDA</option>
           <option value="MINIBAR/VINERA" <?php if($tipotarifa=='MINIBAR/VINERA') echo('selected'); ?>>MINIBAR/VINERA</option>
           <option value="OLLA PRESION" <?php if($tipotarifa=='OLLA PRESION') echo('selected'); ?>>OLLA PRESION</option>
           <option value="REFRIGERADOR" <?php if($tipotarifa=='REFRIGERADOR') echo('selected'); ?>>REFRIGERADOR</option>
           <option value="SECADOR" <?php if($tipotarifa=='SECADOR') echo('selected'); ?>>SECADOR</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Tipo de Servicio</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tiposervicio" name="tiposervicio" ng-model="model.tiposervicio" disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="Atención Técnica" <?php if($tiposervicio=='Atención Técnica') echo('selected'); ?>>Atención Técnica</option>
           <option value="Movilización" <?php if($tiposervicio=='Movilización') echo('selected'); ?>>Movilización</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Subtipo de Servicio</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="subtiposervicio" name="subtiposervicio" ng-model="model.subtiposervicio" value="<?= $subtiposervicio ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Valor</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="valor" name="valor" ng-model="model.valor" value="<?= $valor ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Impuesto</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="impuesto" name="impuesto" ng-model="model.impuesto" value="<?= $impuesto ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Tarifa Mensual</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="tarifamensual" name="tarifamensual" ng-model="model.tarifamensual" value="<?= $tarifamensual ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">Impuesto Tarifa Mensual</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="impuestotarifamensual" name="impuestotarifamensual" ng-model="model.impuestotarifamensual" value="<?= $impuestotarifamensual ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">¿Necesita Autorización?</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="necesitaautorizacion" name="necesitaautorizacion" ng-model="model.necesitaautorizacion" value="<?= $necesitaautorizacion ?>" readonly>
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Eliminar</button>
         <button type="reset" class="btn btn-default" onclick="javaScript: window.location.href='tarifas.php'">Cancelar</button>
       </div>
     </fieldset>
     <input type="hidden" value="1" name="postback">
     <input type="hidden" value="<?= $id_tarifa ?>" name="id">
   </form>
 </div>
</div>
<?php include 'inc_footer.php'; ?>
<script src="js/custom.js"></script>
