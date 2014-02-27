<?php 
class Link extends AppModel{
	public $belongsTo = array("Folder");

	public function beforeFind($query){
		$fields = array_keys($this->getColumnTypes());
		$key = array_search('html_source', $fields);
		unset($fields[$key]);
		$query["fields"] = $fields;
		return $query;
	}
} ?>