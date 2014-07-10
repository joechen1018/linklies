<?php 
class Folder extends AppModel{
	public $hasMany = array("Link" => array(
		"order" => array(
			"foldertimestamp" => "desc"
		),
		"fields" => array("id", "uuid", "user_id", "folder_id", "username_id", "grid", 
							  "ico", "url", "title", "description", "comment","clicks", "desc", "images", "view", "meta", "type", 
							  "hash", "timestamp", "allowIframe", "short_url", "thumbIndex")
	));
	public $belongsTo = array(
		"FolderType",
		"User"
	);
} ?>