<?php 
class MockupsController extends AppController{

	public function beforeFilter(){
		$this -> Auth -> allow();
		$this -> layout = "mockups";
	}

	public function link(){

	}

	public function folder(){

	}

	public function searchView(){
		
	}


} ?>