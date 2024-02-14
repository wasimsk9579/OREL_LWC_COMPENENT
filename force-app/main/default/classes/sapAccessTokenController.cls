/*
 * ClassName: sapAccessTokenController
 * Author: Pooja V
 * Date: 14-11-2023
 * Description:The Apex class provides a method to generate a SAP access token using the client credentials grant type of OAuth 2.0.
 	 It handles the HTTP request and response, parsing the JSON response to extract the access token. 
 	 The class includes error handling to throw an exception in case of authentication errors, 
   	 and it is marked as @AuraEnabled to be used by Lightning components.
*/

public class sapAccessTokenController {
 @AuraEnabled(cacheable=true)
 	public static String generateSapToken() {
        String Username='sb-21410e15-6a7c-4922-ace9-8adf3d55eac6!b191339|it-rt-cli-orel-59fos91p!b117912';
        String Password='c5989ec7-3366-4f6b-ad7f-fe2508a798e5$YHznkPg0bojj6Rz5grqCnQfzgWUWFtBX5Gi7PoLmZSc=';
        String endpointUrl = 'https://cli-orel-59fos91p.authentication.eu10.hana.ondemand.com/oauth/token?grant_type=client_credentials';
        String authHeader = 'Basic ' + EncodingUtil.base64Encode(Blob.valueOf(username + ':' + password));

        HttpRequest request = new HttpRequest();
        request.setEndpoint(endpointUrl);
        request.setMethod('POST');
        request.setHeader('Authorization', authHeader);
        
        HttpResponse response = new Http().send(request);
        
        if (response.getStatusCode() == 200) {
            Map<String, Object> responseData = (Map<String, Object>) JSON.deserializeUntyped(response.getBody());
            String accessToken = (String) responseData.get('access_token');
            return accessToken;
        } else {
            System.debug('Error response: ' + response.getStatusCode() + ' ' + response.getBody());
            throw new AuraHandledException('Authentication error: ' + response.getStatusCode() + ' ' + response.getBody());
        }
    }
}