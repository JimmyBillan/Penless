<div id="corp" class="col-sm-9 col-md-9 col-xs-12">
	<div id="row" class="droite15">
		<div class="container-fluid">
		<table class="table table-striped table-hover ">
			<thead>
				<tr>
					<th class="hideMobile">Nom du document</th>
					<th class="hideMobile">Dernière modification</th>
				</tr>
			</thead>
			<tbody>
	<?php
	$root = realpath($_SERVER["DOCUMENT_ROOT"]);
   	require_once $root."/Model/DocumentDB.php";
   	
	$documentDBconnection = new DocumentDBconnection();
	$cursor = $documentDBconnection->Find($_SESSION['id']); // On cherche les documents de l'utilisateur
	if($cursor->count() > 0){
		foreach ($cursor as $key) {
			echo "<tr id=".$key["idDocument"].">";
				echo"<td onclick=\"document.location = '/?&D=".$key["idDocument"]."&C=Affichage';\" class=clickable>".$key["titreDocument"]."</td>";
				echo "<td class='hideMobile' onclick=\"document.location = '/?&D=".$key["idDocument"]."';\" class=clickable>".$key["DateModification"]."</td>";
				echo "<td><input type=submit value='Modifier' onclick=\"document.location = '/?&D=".$key["idDocument"]."&C=Modification';\"> </td>";
				echo "<td><span class='glyphicon glyphicon-remove' aria-hidden='true' id='iconsupprimerDoc' title='Supprimer' value=".$key["idDocument"]."></span></td>";
			echo "</tr>";
		}
	}
	?>

			</tbody>
		</table>
		</div>
   	</div>
</div>
