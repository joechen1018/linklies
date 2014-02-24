<?php 
class Folder extends AppModel{
	public $hasMany = array("Link");
	public $belongsTo = array("FolderType");
} ?>