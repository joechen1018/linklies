<?php 
class MockupsController extends AppController{

	public function beforeFilter(){
		$this -> Auth -> allow();
		$this -> layout = "mockups";
	}

	public function gapi(){
		$this -> render("/Layouts/blank");
	}

	public function link(){

	}

	public function folder(){

	}

	public function folderLinks() {
		
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

	public function logo(){
		
	}

} ?>