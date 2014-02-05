<?php 
class OAuthController extends AppController{

	public function index(){

		$this -> layout = "Layouts/default";
		$this -> View = "Elements/blank";
		debug("oauth controller");
	}

} ?>