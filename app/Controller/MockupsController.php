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

	public function contextMenu(){
		
	}

	public function browser(){
		
	}

	public function stackoverflowView(){

	}

	public function searchView(){
		
	}

	public function picker(){
		
	}

} ?>