public class OrelDeboardUserInactiveHandler {
    @InvocableMethod(label='Update User Status' description='Inactivates User based on Account Deboard Status')
    public static void updateUserStatus(List<Id> accountIds) {
        List<User> usersToUpdate = new List<User>();

        // Query related Contacts based on Account Ids
        List<Contact> contacts = [SELECT Id FROM Contact WHERE AccountId IN :accountIds];

        Set<Id> contactIds = new Set<Id>();
        for (Contact con : contacts) {
            contactIds.add(con.Id);
        }

        // Query related Users based on Contact Ids
        List<User> users = [SELECT Id, IsActive FROM User WHERE ContactId IN :contactIds];

        for (User usr : users) {
            usr.IsActive = false;
            usersToUpdate.add(usr);
        }

        if (!usersToUpdate.isEmpty()) {
            // Extract User Ids
            Set<Id> userIdsToUpdate = new Set<Id>();
            for (User u : usersToUpdate) {
                userIdsToUpdate.add(u.Id);
            }
            // Perform DML operation asynchronously to update User records
            updateUsersAsync(new List<Id>(userIdsToUpdate));
        }
    }

    @future
    public static void updateUsersAsync(List<Id> userIds) {
        List<User> usersToUpdate = [SELECT Id, IsActive FROM User WHERE Id IN :userIds];
        
        for (User u : usersToUpdate) {
            u.IsActive = false;
        }
        update usersToUpdate;
    }
}