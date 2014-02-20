<?php 
class UsersController extends AppController{

	public function beforeFilter(){

		$this -> Auth -> allow("login");
		// if($this -> Auth -> loggedIn()){
		// 	$this -> Auth -> allow();
		// }else{
		// 	$this -> redirect("login");
		// }
	}
	public function index(){

	}

	public function findById($uid){
		$user = $this -> User -> findByUsernameId($uid);
		$this -> viewClass = "Json";
		$this -> response -> type("json");
		$this -> set("user", $user);
		$this -> set("_serialize", array("user"));
	}

	public function desktop(){
		$user_id = $this -> params["user_id"];
		if(!$this -> Auth -> loggedIn() || !$user_id){
			$this -> Auth -> redirect();
			return;
		}
		$this -> layout = "default";
		$this -> view = "/Pages/home";
		$user = $this -> User -> findByUsernameId($user_id);
		$this -> set("user", $user);
		// debug($user_id);
	}

	public function login(){
		//if 'me' object is posted
		if($this -> data){
			$user_id = $this -> data["id"];

			//find user by google id
			$user = $this -> User -> find("first", array(
				"conditions" => array("google_id" => $user_id)
			));
			$data = $user;
			if($user === false){

				//create a new user if not found
				$user = $this -> User -> createByMeObj($this -> data);
				$data = $user;
			}

			$rs = $this -> Auth -> login($user);

			$this -> viewClass = "Json";
			$this -> response -> type("json");
			$this -> set("data", $data);
			$this -> set("_serialize", array("data"));
		}

		$this -> layout = "users";
	}
}
?>
