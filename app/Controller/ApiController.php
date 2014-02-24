<?php  
//App::import('Vendor', 'simple_html_dom');
class ApiController extends AppController{
	
	public function beforeFilter(){
		$this -> Auth -> allow();
		if($this -> Auth -> loggedIn()){
			
		}

		$this -> viewClass = "Json";
		$this -> response -> type("json");
	}

	public function afterFilter(){
		
	}

	public function user($username_id){
		$this -> loadModel("User");
		$user = $this -> User -> find("first", array(
			"conditions" => array("username_id" => $username_id),
			'recursive' => 2
		));
		$this -> set("data", $user);
		$this -> set("_serialize", array("data"));
	}

	public function fetchAll($model, $user_id){
		$conditions = array_key_exists("conditions", $this -> data) ? $this -> data["conditions"] : array();
		$model = ucwords($model);
		$conditions["$model.user_id"] = $user_id;
		$this -> loadModel($model);
		$data = $this -> $model -> find("all", array(
			"conditions" => $conditions
		));
		$this -> set("data", $data);
		$this -> set("_serialize", array("data"));
	}

	public function fetchById($model, $id){
		$model = ucwords($model);
		$this -> loadModel($model);
		$data = $this -> $model -> findById($id);
		$this -> set("data", $data);
		$this -> set("_serialize", array("data"));
	}

	public function fetchUrl(){
		$url = $this -> data["url"];
		$output = $this -> curl_get($url);
		$html  = str_get_html($output);
		$this -> set("data", $html);
		$this -> set("_serialize", array("data"));
	}

	public function save($model){
		$data = $this -> data;
		$model = ucwords($model);
		$this -> loadModel($model);
		$rs = $this -> $model -> save($data);
		$this -> set("data", $rs);
		$this -> set("_serialize", array("data"));
	}

	public function removeById($model, $id){
		$model = ucwords($model);
		$this -> loadModel($model);
		$rs = $this -> $model -> delete($id);
		$this -> set("data", $rs);
		$this -> set("_serialize", array("data"));
	}

	private function curl_get($url, array $get = array(), array $options = array()){   
	    $defaults = array(
	        //CURLOPT_URL => $url. (strpos($url, '?') === FALSE ? '?' : ''). http_build_query($get),
	        CURLOPT_URL => $url,
	        CURLOPT_HEADER => array(
				"content-type: application/x-www-form-urlencoded; 
				charset=UTF-8"
			),
	        CURLOPT_RETURNTRANSFER => false,
	        CURLOPT_TIMEOUT => 10,
	        CURLOPT_SSL_VERIFYPEER =>  false,
	        CURLOPT_FOLLOWLOCATION => true,
	        CURLOPT_USERAGENT => "Mozilla/5.0 (Windows NT 6.1; WOW64) AppleWebKit/537.22 (KHTML, like Gecko) Chrome/25.0.1364.172 Safari/537.22"
	    );
	   
	    $ch = curl_init();
	    curl_setopt_array($ch, ($options + $defaults));
	    if( ! $result = curl_exec($ch)){
	        trigger_error(curl_error($ch));
	    }
	    curl_close($ch);
	    return $result;
	} 
	
}

?>