<?php
$_global_active = "tarifas";
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $idgrupotarifa = $_POST["idgrupotarifa"];
  $tipotarifa = $_POST["tipotarifa"];
  $tiposervicio = $_POST["tiposervicio"];
  $subtiposervicio = $_POST["subtiposervicio"];
  $valor = $_POST["valor"];
  $impuesto = $_POST["impuesto"];
  $tarifamensual = $_POST["tarifamensual"];
  $impuestotarifamensual = $_POST["impuestotarifamensual"];
  $necesitaautorizacion = $_POST["necesitaautorizacion"];

  $q = mysql_query("
  Insert into tarifas (IDGrupoTarifa, TipoTarifa, TipoServicio, SubtipoServicio, Valor, Impuesto, TarifaMensual, ImpuestoTarifaMensual, NecesitaAutorizacion, Status)
  Values
  ('$idgrupotarifa', '$tipotarifa', '$tiposervicio', '$subtiposervicio', '$valor', '$impuesto', '$tarifamensual', '$impuestotarifamensual', '$necesitaautorizacion', 1)
  ") or die(mysql_error());

  echo("<script>alert('Registro exitoso'); window.location.href='tarifas.php';</script>");
}

$query = "SELECT idgrupotarifa, nombre
          FROM  `centros`
          GROUP BY idgrupotarifa
          ORDER BY idgrupotarifa";
$q = mysql_query($query) or die(mysql_error());
?>
<div class="xs">
   <h3>Nueva tarifa</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="tarifa_editar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">Grupo tarifa</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="idgrupotarifa" name="idgrupotarifa" ng-model="model.idgrupotarifa" required="">
           <option value="? undefined:undefined ?"></option>
           <?php
           while ($row = mysql_fetch_array($q))
           {
           ?>
           <option value="<?= $row["idgrupotarifa"]?>"><?= $row["idgrupotarifa"]?> - <?= utf8_encode($row["nombre"])?></option>
           <?php
           }
           ?>

           <!--option value="1">1 - R&P ELECTRONICS</option>
           <option value="2">2 - ALMACENES LADY LEE S.A. DE C.V.</option>
           <option value="3">3 - IVYMEP</option>
           <option value="4">4 - ALBONSA</option>
           <option value="5">5 - ILAE</option>
           <option value="6">6 - R&V (Microondas)</option>
           <option value="7">7 - SERVICIO MASTER</option>
           <option value="8">8 - SERVICIO TÉCNICO SC</option>
           <option value="9">9 - PRODISUR-BACES TECHNOLOGIES SAS</option>
           <option value="10">10 - ELECTROGLOBAL</option>
           <option value="11">11 - SERVIOCASA</option>
           <option value="12">12 - R&V (Línea Blanca)</option>
           <option value="13">13 - RYASA</option>
           <option value="14">14 - SUPERMARCAS</option>
           <option value="15">15 - RAYNET</option>
           <option value="16">16 - REDELEC</option>
           <option value="17">17 - R&M</option>
           <option value="18">18 - PLUS SERVICES</option>
           <option value="19">19 - SERVICENTER</option>
           <option value="20">20 - MASTER BOLIVIA</option>
           <option value="21">21 - CENSEL</option>
           <option value="22">22 - ELECTROSERVICES</option>
           <option value="23">23 - RADIOCENTRO</option>
           <option value="24">24 - MOBIPLUS</option-->
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Tipo Tarifa</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tipotarifa" name="tipotarifa" ng-model="model.tipotarifa" required="">
           <option value="? undefined:undefined ?"></option>
           <option value="AIRE ACONDICIONADO">AIRE ACONDICIONADO</option>
           <option value="CONGELADOR">CONGELADOR</option>
           <option value="CAMPANAS/VENTILACION">CAMPANAS/VENTILACION</option>
           <option value="CONGELADOR HORIZONTAL">CONGELADOR HORIZONTAL</option>
           <option value="DISPENSADOR DE AGUA">DISPENSADOR DE AGUA</option>
           <option value="ESTUFA">ESTUFA</option>
           <option value="LAVADORA">LAVADORA</option>
           <option value="MICROONDA">MICROONDA</option>
           <option value="MINIBAR/VINERA">MINIBAR/VINERA</option>
           <option value="OLLA PRESION">OLLA PRESION</option>
           <option value="REFRIGERADOR">REFRIGERADOR</option>
           <option value="SECADOR">SECADOR</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Tipo de Servicio</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tiposervicio" name="tiposervicio" ng-model="model.tiposervicio" required=""><option value="? undefined:undefined ?"></option>
           <option value="Atención Técnica">Atención Técnica</option>
           <option value="Movilización">Movilización</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Subtipo de Servicio</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="subtiposervicio" name="subtiposervicio" ng-model="model.subtiposervicio" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Valor</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="valor" name="valor" ng-model="model.valor" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Impuesto</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="impuesto" name="impuesto" ng-model="model.impuesto"required="">
       </div>
       <div class="form-group">
         <label class="control-label">Tarifa Mensual</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="tarifamensual" name="tarifamensual" ng-model="model.tarifamensual" required="">
       </div>
       <div class="form-group">
         <label class="control-label">Impuesto Tarifa Mensual</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="impuestotarifamensual" name="impuestotarifamensual" ng-model="model.impuestotarifamensual" required="">
       </div>
       <div class="form-group">
         <label class="control-label">¿Necesita Autorización?</label>
         <input type="radio" id="necesitaautorizacion1" name="necesitaautorizacion" value="0" checked>
         <label for="necesitaautorizacion1">No</label>

         <input type="radio" id="necesitaautorizacion2" name="necesitaautorizacion" value="1">
         <label for="necesitaautorizacion2">Sí</label>
         <!--input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="necesitaautorizacion" name="necesitaautorizacion" ng-model="model.necesitaautorizacion" required=""-->
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Registrar</button>
         <button type="reset" class="btn btn-default" onclick="javaScript: window.location.href='tarifas.php'">Cancelar</button>
       </div>
     </fieldset>
     <input type="hidden" value="1" name="postback">
     <input type="hidden" value="<?= $id_producto ?>" name="id">
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
