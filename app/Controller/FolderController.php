<?php

/*
	
	hashids
	http://www.hashids.org/php/
	(c) 2013 Ivan Akimov
	
	https://github.com/ivanakimov/hashids.php
	hashids may be freely distributed under the MIT license.
	
*/

class FolderController extends AppController{

	public function beforeFilter(){
		$this -> Auth -> allow();
	}
	public function index(){
	}

} ?>