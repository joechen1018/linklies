<?php 
class User extends AppModel{

	public function createByMeObj($me){
		$display_name = $me["displayName"];
		$arr = explode(" ", $display_name);
		if(count($arr) === 2){
			$name = strtolower($arr[0]) . "." . strtolower($arr[1]);
			$sameNames = $this -> find("all", array(
				"conditions" => array(
					"username_id LIKE" => $name . "." . "%"
				),
				"order" => array("username_id" => "desc")
			));	

			$maxId = 1;
			if(count($sameNames) > 0){
				$maxId = $sameNames[0]["User"]["username_id"];
				$maxId = explode(".", $maxId);
				$maxId = $maxId[count($maxId) - 1];
				$maxId = (int)$maxId;
				$maxId++;
			}

			$username_id = $name . "." . $maxId;
		}
		$this -> create();
		$user = $this -> save(array(
			"username_id" => $username_id,
			"display_name" => $me["displayName"],
			"image" => $me["image"]["url"],
			"google_id" => $me["id"]
		));
		return $user;
	}
}
?>