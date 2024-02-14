global class EmailToLeadActivity implements Messaging.InboundEmailHandler {
    global Messaging.InboundEmailResult handleInboundEmail(Messaging.inboundEmail email, Messaging.InboundEnvelope env){
        // Create an InboundEmailResult object for returning the result of the  
        // Apex Email Service 
        system.debug('inbound email class invoked successfully');
        system.debug('Messaging.inboundEmail email---->'+email);
        system.debug('Messaging.InboundEnvelope env'+env);
        system.debug('Messaging.inboundEmail ThreadId---->'+email.inreplyto);
        Messaging.InboundEmailResult result = new Messaging.InboundEmailResult();
        String myPlainText= '';
        string companyEmailName = extractCompanyEmail(email.fromAddress);
        
        // Add the email plain text into the local variable  
        myPlainText = email.plainTextBody;
        // Check for existing leads with this email address   
        Lead[] leads = [SELECT Id, Name,firstname,lastname,title,description, Email
                        FROM Lead WHERE Email = :email.fromAddress AND title =:email.subject];
        
        if (leads.isEmpty()) {
            //split the name 
            String[] nameParts = email.fromName.split(' ', 2);
            String firstName = (nameParts.size() > 0) ? nameParts[0] : '';
            String lastName = (nameParts.size() > 1) ? nameParts[1] : '';
            
            Lead newLead = new Lead();
            newLead.Email = email.fromAddress; 
            newLead.FirstName= firstName;
            newLead.LastName = lastName;
            newLead.Company = companyEmailName;
            newLead.LeadSource = 'Lead';
            newLead.Description__c = email.plainTextBody;
            newLead.Title = email.subject;
            newLead.RecordTypeId='0121m000002447nAAA';
            // newLead.Status = '';
            system.debug('newLead.LastName---->'+newLead.LastName);
            system.debug(' newLead.Description'+ newLead.Description);
            
            // Insert a new lead
            insert newLead;    
            
            System.debug('New Lead record: ' + newLead );   
        } else {
            System.debug('Incoming email duplicates existing Lead record(s): ' + leads );    
        }
        // Set the result to true. No need to send an email back to the user      
        // with an error message   
        
        result.success = true;
        // Return the result for the Apex Email Service 
        return result;
        
    }
    private static string extractCompanyEmail(String email){
        if(email!=null && email.contains('@')){
            String company = email.substring(email.indexOf('@') + 1);
            if(company.endsWith('.com')){
                company= company.substring(0,company.length()-4);
            }
            return company;
        }
        return null;
    }
    
}