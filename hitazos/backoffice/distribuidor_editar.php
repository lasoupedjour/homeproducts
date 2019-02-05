<?php
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $id_distribuidor = $_POST["id"];
  $iddistribuidor = $_POST["iddistribuidor"];
  $pais = $_POST["pais"];
  $categoria = $_POST["categoria"];
  $tipo = $_POST["tipo"];
  $razonsocial = $_POST["razonsocial"];

  $q = mysql_query("
  update distribuidores set
  IDDistribuidor='$iddistribuidor', Pais='$pais', Categoria='$categoria',
  Tipo='$tipotarifa', RazonSocial='$razonsocial'
  where id = $id_distribuidor
  ") or die(mysql_error());

  $mensaje = "Registro actualizado";
}else{
  $id_distribuidor = $_GET["id"];
  if($id_distribuidor==""){
    header("Location: distribuidores.php");
    die();
  }
}
//die();
$query = "select * from distribuidores Where id=$id_distribuidor";
$q = mysql_query($query) or die(mysql_error());

while ($row = mysql_fetch_array($q))
{
  $iddistribuidor = $row["IDDistribuidor"];
  $pais = $row["Pais"];
  $categoria = $row["Categoria"];
  $tipo = $row["Tipo"];
  $razonsocial = $row["RazonSocial"];
}
?>
<div class="xs">
   <h3>Editar distribuidor</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="producto_editar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">IDDistribuidor</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="iddistribuidor" name="iddistribuidor" ng-model="model.iddistribuidor" value="<?= $iddistribuidor ?>" required="">
       </div>
       <div class="form-group">
         <label class="control-label">País</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="pais" name="pais" ng-model="model.pais" required="">
           <option value="? undefined:undefined ?"></option>
           <option value="Argentina" <?php if($pais=='Argentina') echo('selected'); ?>>Argentina</option>
           <option value="Bolivia" <?php if($pais=='Bolivia') echo('selected'); ?>>Bolivia</option>
           <option value="Chile" <?php if($pais=='Chile') echo('selected'); ?>>Chile</option>
           <option value="Colombia" <?php if($pais=='Colombia') echo('selected'); ?>>Colombia</option>
           <option value="Costa Rica" <?php if($pais=='Costa Rica') echo('selected'); ?>>Costa Rica</option>
           <option value="Ecuador" <?php if($pais=='Ecuador') echo('selected'); ?>>Ecuador</option>
           <option value="EE.UU." <?php if($pais=='EE.UU.') echo('selected'); ?>>EE.UU.</option>
           <option value="El Salvador" <?php if($pais=='El Salvador') echo('selected'); ?>>El Salvador</option>
           <option value="Guatemala" <?php if($pais=='Guatemala') echo('selected'); ?>>Guatemala</option>
           <option value="Honduras" <?php if($pais=='Honduras') echo('selected'); ?>>Honduras</option>
           <option value="Nicaragua" <?php if($pais=='Nicaragua') echo('selected'); ?>>Nicaragua</option>
           <option value="Panamá" <?php if($pais=='Panamá') echo('selected'); ?>>Panamá</option>
           <option value="Perú" <?php if($pais=='Perú') echo('selected'); ?>>Perú</option>
           <option value="Puerto Rico" <?php if($pais=='Puerto Rico') echo('selected'); ?>>Puerto Rico</option>
           <option value="República Dominicana" <?php if($pais=='República Dominicana') echo('selected'); ?>>República Dominicana</option>
           <option value="Uruguay" <?php if($pais=='Uruguay') echo('selected'); ?>>Uruguay</option>
           <option value="Venezuela" <?php if($pais=='Venezuela') echo('selected'); ?>>Venezuela</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="categoria" name="categoria" ng-model="model.categoria" required=""><option value="? undefined:undefined ?"></option>
           <option value="LINEA BLANCA" <?php if($categoria=='LINEA BLANCA') echo('selected'); ?>>LINEA BLANCA</option>
           <option value="MENAJE" <?php if($categoria=='MENAJE') echo('selected'); ?>>MENAJE</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Tipo</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tipo" name="tipo" ng-model="model.tipo" required="">
           <option value="? undefined:undefined ?"></option>
           <option value="Distribuidor" <?php if($tipo=='Distribuidor') echo('selected'); ?>>Distribuidor</option>
           <option value="Cadena" <?php if($tipo=='Cadena') echo('selected'); ?>>Cadena</option>
           <option value="Regional" <?php if($tipo=='Regional') echo('selected'); ?>>Regional</option>
           <option value="Institucional" <?php if($tipo=='Institucional') echo('selected'); ?>>Institucional</option>
           <option value="Walmart" <?php if($tipo=='Walmart') echo('selected'); ?>>Walmart</option>
           <option value="Nicaragua" <?php if($tipo=='Nicaragua') echo('selected'); ?>>Nicaragua</option>
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Nombre</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="razonsocial" name="razonsocial" ng-model="model.razonsocial" value="<?= $razonsocial ?>" required="">
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Actualizar</button>
         <button type="reset" class="btn btn-default" onclick="javaScript: window.location.href='distribuidores.php'">Cancelar</button>
       </div>
     </fieldset>
     <input type="hidden" value="1" name="postback">
     <input type="hidden" value="<?= $id_distribuidor ?>" name="id">
   </form>
 </div>
</div>
<?php include 'inc_footer.php'; ?>
<script src="js/custom.js"></script>
