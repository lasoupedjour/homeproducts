<?php
$_global_active = "distribuidores";
include 'inc_header.php';
include "../servicios/dbc.php";

//echo("postback->" . $_POST["postback"]);
if($_POST["postback"]){
  $id_distribuidor = $_POST["id"];

  $q = mysql_query("
  update distribuidores set
  status=2
  where id = $id_distribuidor
  ") or die(mysql_error());

  echo("<script>alert('Registro eliminado'); window.location.href='distribuidores.php';</script>");
}else{
  $id_distribuidor = $_GET["id"];
  if($id_distribuidor==""){
    header("Location: distribuidores.php");
    die();
  }
  $mensaje = "Favor de confirmar que desea eliminar el producto.";
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

//Obtenemos todos los paises
$query = "SELECT pais
          FROM distribuidores
          GROUP BY pais
          ORDER BY 1";
$paises = mysql_query($query) or die(mysql_error());
?>
<div class="xs">
   <h3>Eliminar distribuidor</h3>
   <p><?= $mensaje ?></p>
   <div class="well1 white">
   <form class="form-floating ng-pristine ng-invalid ng-invalid-required ng-valid-email ng-valid-url ng-valid-pattern" action="producto_eliminar.php" method="POST">
     <fieldset>
       <div class="form-group">
         <label class="control-label">IDDistribuidor</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="iddistribuidor" name="iddistribuidor" ng-model="model.iddistribuidor" value="<?= $iddistribuidor ?>" readonly>
       </div>
       <div class="form-group">
         <label class="control-label">País</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="pais" name="pais" ng-model="model.pais" disabled>
           <?php
           while ($row = mysql_fetch_array($paises))
           {
           ?>
           <option value="<?= $row["pais"]?>" <?php if($pais==$row["pais"]) echo('selected'); ?>><?= $row["pais"]?></option>
           <?php
           }
           ?>
           <!--option value="? undefined:undefined ?"></option>
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
           <option value="Venezuela" <?php if($pais=='Venezuela') echo('selected'); ?>>Venezuela</option-->
         </select>
       </div>
       <div class="form-group">
         <label class="control-label">Categoría</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="categoria" name="categoria" ng-model="model.categoria" disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="LINEA BLANCA" <?php if($categoria=='LINEA BLANCA') echo('selected'); ?>>LINEA BLANCA</option>
           <option value="MENAJE" <?php if($categoria=='MENAJE') echo('selected'); ?>>MENAJE</option>
         </select>
       </div>
       <!--div class="form-group">
         <label class="control-label">Tipo</label>
         <select class="form-control1 ng-invalid ng-invalid-required" id="tipo" name="tipo" ng-model="model.tipo" disabled>
           <option value="? undefined:undefined ?"></option>
           <option value="Distribuidor" <?php if($tipo=='Distribuidor') echo('selected'); ?>>Distribuidor</option>
           <option value="Cadena" <?php if($tipo=='Cadena') echo('selected'); ?>>Cadena</option>
           <option value="Regional" <?php if($tipo=='Regional') echo('selected'); ?>>Regional</option>
           <option value="Institucional" <?php if($tipo=='Institucional') echo('selected'); ?>>Institucional</option>
           <option value="Walmart" <?php if($tipo=='Walmart') echo('selected'); ?>>Walmart</option>
           <option value="Nicaragua" <?php if($tipo=='Nicaragua') echo('selected'); ?>>Nicaragua</option>
         </select>
       </div-->
       <div class="form-group">
         <label class="control-label">Nombre</label>
         <input type="text" class="form-control1 ng-invalid ng-invalid-required ng-touched" id="razonsocial" name="razonsocial" ng-model="model.razonsocial" value="<?= $razonsocial ?>" readonly>
       </div>
       <div class="form-group">
         <button type="submit" class="btn btn-primary">Eliminar</button>
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
