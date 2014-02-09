<?php  
App::import('Vendor', 'simple_html_dom');

class ApiController extends AppController{
	
	public function beforeFilter(){
		if($this -> Auth -> loggedIn()){
			$this -> Auth -> allow();
		}
	}
	public function getUrlHtml(){
		$url = $this -> data["url"];
		//$url = "https://maps.google.com.tw/";
		$output = $this -> curl_get($url);
		$html  = str_get_html($output);
		$this -> viewClass = "Json";
		$this -> response -> type("json");

		$this -> set("data", $html);
		$this -> set("_serialize", array("data"));
	}
	public function saveLink(){
		$data = $this -> data;
		$this -> loadModel("Link");

		$data["grid"] = $data["grid"][0] . "," . $data["grid"][1];
		debug($data);
		$this -> Link -> save($data);

		$this -> viewClass = "Json";
		$this -> response -> type("json");

		$this -> set("data", $data);
		$this -> set("_serialize", array("data"));
	}

	public function getLinks($user_id){
		$ava = true;
		$links = array();
		$rs = array();
		$rs["authorized"] = true;
		$rs["reason"] = array(
			"user_id" => $user_id,
			"logged" => $this -> Auth -> loggedIn()
		);
		// if(empty($user_id) || ($this -> Auth -> loggedIn() !== true)){
		// 	$ava = false;
		// }
		if(!$ava){
			$rs["authorized"] = false;
		}else{
			$this -> loadModel("Link");
			$data = $this -> Link -> find("all", array("conditions" => array("username_id" => $user_id)));
			for($i = 0; $i<count($data); $i++){
				$link = $data[$i]["Link"];
				$link["grid"] = explode(",", $link["grid"]);
				array_push($links, $link);
			}
		}
		$this -> viewClass = "Json";
		$this -> response -> type("json");

		$this -> set("rs", $rs);
		$this -> set("links", $links);
		$this -> set("_serialize", array("links", "rs"));
	}

	public function createLink($url){
		$output = $this -> curl_get($url);
		$html  = str_get_html($output);
		$title = $html -> find("title", 0) -> text();
		//$meta = $html -> find("script", 0);

		debug($html);
		return;
		$res = array(
			"url" => $url,
			"output" => $output,
			"title" => $title,
			"url" => $url
		);
		
		$this -> viewClass = "Json";
		$this -> response -> type("json");
		$this -> set("res", $res);
		$this -> set("_serialize", array("res"));
	}

	public function removeLink($id){
		$this -> loadModel("Link");
		$this -> Link -> delete($id);

		$this -> viewClass = "Json";
		$this -> response -> type("json");

		$this -> set("data", array("success"));
		$this -> set("_serialize", array("data"));
	}

	public function fetch(){
		
		$url = $this -> data["url"];
		$parsed = parse_url($url);
		$host = $parsed["host"];
		$ico = $parsed["scheme"] . "://" . $host . "/favicon.ico";
		$title = "";
		
		//$curl = curl_init($url);
		//curl_setopt($curl, CURLOPT_RETURNTRANSFER, TRUE);
		// curl_setopt_array($curl, array(
			// CURLOPT_SSL_VERIFYPEER =>  false
		// ));
		$output = $this -> curl_get($url);
		$html  = str_get_html($output);
		$title = $html -> find("title", 0) -> text();
		
		$iurl = $ico;
		$ch = curl_init($ico);
		curl_setopt($ch, CURLOPT_NOBODY, true);
		curl_exec($ch);
		$retcode = curl_getinfo($ch, CURLINFO_HTTP_CODE);
		curl_close($ch);
		
		if($retcode > 400){
			$ico = $html -> find("link[rel=icon], link[rel=ico]", 0);
			if($ico){
				$ico = $ico -> href;
			}else{
				$ico = false;
			}
		}
		
		$res = array(
			"url" => $url,
			"output" => $output,
			"title" => $title,
			"icon" => $ico, 
			"url" => $url,
			"host" => $host
		);
		
		$this -> viewClass = "Json";
		$this -> response -> type("json");
		$this -> set("res", $res);
		$this -> set("_serialize", array("res"));
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