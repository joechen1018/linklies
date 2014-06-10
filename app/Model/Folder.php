<?php 
class Folder extends AppModel{
	public $hasMany = array("Link" => array(
		"order" => array(
			"foldertimestamp" => "desc"
		)
	));
	public $belongsTo = array(
		"FolderType",
		"User"
	);
} ?>