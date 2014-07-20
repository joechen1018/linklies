<?php 
class UsersController extends AppController{

	public $helpers = array('Html', 'Js');
	public function beforeFilter(){
		$this -> Auth -> allow("login");
		$action = $this -> request -> params["action"];
		if($this -> Auth -> loggedIn()){
			$this -> Auth -> allow();
		}else{
			if($action !== "login"){
				$this -> redirect("login");
			}
		}
	}
	public function index(){

	}

	public function desktop(){
		$user_id = $this -> params["user_id"];
		if(!$this -> Auth -> loggedIn() || !$user_id){
			$this -> Auth -> redirect();
			return;
		}
		$this -> layout = "default";
		$this -> view = "/Pages/home";
		$user = $this -> User -> find("first", array(
			"conditions" => array("User.username_id" => $user_id),
			"recursive" => 2
		));
		$this -> set("data", $user);
		// debug($user_id);
	}

	public function folder(){
		$this -> layout = "folderView";
		$hash = $this -> request -> params['folder_hash'];
		$this -> loadModel("Folder");
		$data = $this -> Folder -> findByHash($hash);
		$this -> set("data", $data);
		$this -> render("folder.1");
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

	public function ajaxLogin(){
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
}
?>
