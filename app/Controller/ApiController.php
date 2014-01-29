<?php  
App::import('Vendor', 'simple_html_dom');

class ApiController extends AppController{
	
	public $uses = array("Wall");

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
	public function curl_get($url, array $get = array(), array $options = array())
	{   
	    $defaults = array(
	        CURLOPT_URL => $url. (strpos($url, '?') === FALSE ? '?' : ''). http_build_query($get),
	        CURLOPT_HEADER => 0,
	        CURLOPT_RETURNTRANSFER => TRUE,
	        CURLOPT_TIMEOUT => 4,
	        CURLOPT_SSL_VERIFYPEER =>  false,
	        CURLOPT_FOLLOWLOCATION => true
	    );
	   
	    $ch = curl_init();
	    curl_setopt_array($ch, ($options + $defaults));
	    if( ! $result = curl_exec($ch))
	    {
	        trigger_error(curl_error($ch));
	    }
	    curl_close($ch);
	    return $result;
	} 
	
	public function getID(){
		
		$this -> Wall -> create();
		$id = $this -> wall -> id;
		$str = $id . date("md");
		$hash = md5($str);
		$this -> Wall -> save(array(
			"id" => $id,
			"hash" => $hash
		));
		$res = array(
			"hash" => $hash
		);
		
		$this -> viewClass = "Json";
		$this -> response -> type("json");
		$this -> set("res", $res);
		$this -> set("_serialize", array("res"));
	}
}

class Linky{
	
	public $url;
	public $html;
	public function __construct($url){
		$this -> url = $url;
		$html  = file_get_html($this -> url);
		echo $html -> find("title", 0) -> text();
	}
	public function title(){
		
	}
	public function ico(){
		return "ico";
	}
}
?>