var getWebServices = function(){
	var result = "";
	var imports = new JavaImporter(java.net, java.lang, java.io,java.util);
	var Logger = Java.type("org.apache.log4j.Logger");
	var URL = Java.type("java.net.URL");
	var BufferedReader = Java.type("java.io.BufferedReader");
	var InputStreamReader = Java.type("java.io.InputStreamReader");
	var log = Logger.getLogger("Logger.class");	
    var bas64 = Java.type("java.util.Base64");
	var string = Java.type("java.lang.String");

		
		if (imports) {
		    var urlObj = null;
		    try {
				 urlObj = new URL("http://127.0.0.1:8080/RestFullProvider/rest/download/getDocument");  
		        } catch (e) {
		            // If the URL cannot be built, assume it is a file path.
					urlObj = new URL(new File(url).toURI().toURL());
		        }
				log.info("username from pojo " +   owData.userName);
				log.info("DocumentId from pojo " + owData.documentId);
				var httpConnection = urlObj.openConnection();
				
				// sending basic authetication data.
				var user = new string("admin");
		        var pass = new string("admin");
		        var authString = new string(user + ":" + pass);
				log.info("username ================= " +   user);
				log.info("password ================= " +   user);
				log.info("authString ================= " +   authString);
				
		        var authStringEnc = new string(bas64.getEncoder().encode(authString.getBytes()));	
				log.info("Authentication Ecoded String  ================= " +   authStringEnc);
				
				httpConnection.setRequestProperty("Authorization", "Basic " + authStringEnc);
				httpConnection.setRequestProperty("Content-Type", "application/json");
				httpConnection.connect();
				var reader=null;
				try{
					reader = new BufferedReader(new InputStreamReader(httpConnection.getInputStream()));
					var line = reader.readLine();
					while (line !== null) {
						result += line + "\n";
						line = reader.readLine();
					}
					reader.close();
					log.info(result.toString());
					var jsonObj = JSON.parse(result.toString());
					log.info(jsonObj.getDocumentResponse.byteArray);
					owData.docContents = bas64.getDecoder().decode(jsonObj.getDocumentResponse.byteArray.toString().getBytes());
					owData.owIdValid=1;
			} catch(ex) {
				   if(httpConnection.getResponseCode()===401){   
				    owData.owIdValid=0;
        	        log.info("Response COde"+httpConnection.getResponseCode());
                    log.info("Get Response Message:"+httpConnection.getResponseMessage());
				    owData.errorMessage="USER CANNOT ACCESS THE RESOURCE";
				   }
            }
				
		        
    	}
		
		
};
var execute = function() {
   	getWebServices();
};