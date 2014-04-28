<?php

/*
	
	hashids
	http://www.hashids.org/php/
	(c) 2013 Ivan Akimov
	
	https://github.com/ivanakimov/hashids.php
	hashids may be freely distributed under the MIT license.
	
*/

class FoldersController extends AppController{

	public function beforeFilter(){
		$this -> Auth -> allow();
		$this -> layout = "mockups";
	}
	public function index(){
	}
} ?>