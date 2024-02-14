public class OrlInventoryTransaction {

    public static void retrieveOrderItems(Id updatedOrderId, Id additionalId) {
        List<cgcloud__Order_Item__c> orderItems = [SELECT Id, Name, cgcloud__Quantity__c, cgcloud__Product__c, cgcloud__Product__r.Name, cgcloud__Order__r.cgcloud__Order_Account__c, cgcloud__Order__r.cgcloud__Order_Account__r.Name
                                                   FROM cgcloud__Order_Item__c
                                                   WHERE cgcloud__Order__c = :updatedOrderId];

        // Iterate through the order items
        for (cgcloud__Order_Item__c orderItem : orderItems) {
            processOrderItem(orderItem, additionalId);
        }
    }

    private static void processOrderItem(cgcloud__Order_Item__c orderItem, Id additionalId) {
        String productId = orderItem.cgcloud__Product__c;

        // Query the single Inventory record based on the product Id and additional Id
        cgcloud__Inventory__c inventory = [SELECT Id, cgcloud__Account__c, cgcloud__Account__r.Name, cgcloud__Product__c, cgcloud__Product__r.Name
                                           FROM cgcloud__Inventory__c
                                           WHERE cgcloud__Product__c = :productId
                                           AND cgcloud__Account__c = :additionalId
                                           LIMIT 1];

        // Check if an inventory record is found
        if (inventory != null) {
            // Example: Log the inventory details
            System.debug('Inventory Record - Id: ' + inventory.Id + ', Account Name: ' + inventory.cgcloud__Account__r.Name + ', Product Name: ' + inventory.cgcloud__Product__r.Name);

            // Create a new Inventory Transaction record
            createInventoryTransaction(inventory, orderItem, additionalId);
        } else {
            // Handle scenario where no inventory record is found
            System.debug('No Inventory Record found for Product Id: ' + productId + ' and Account Id: ' + additionalId);
        }
    }

    private static void createInventoryTransaction(cgcloud__Inventory__c inventory, cgcloud__Order_Item__c orderItem, Id additionalId) {
        cgcloud__Inventory_Transaction_Template__c cgt = [select Id from cgcloud__Inventory_Transaction_Template__c limit 1];
        
        // Create a new Inventory Transaction record
        cgcloud__Inventory_Transaction__c inventoryTransaction = new cgcloud__Inventory_Transaction__c();
        inventoryTransaction.cgcloud__Inventory__c = inventory.Id;
        inventoryTransaction.Return_Quantity__c = orderItem.cgcloud__Quantity__c;
        inventoryTransaction.cgcloud__Order_Document__c = orderItem.cgcloud__Order__c;
        inventoryTransaction.cgcloud__Inventory_Transaction_Template__c = cgt.Id;


       

        // Additional fields or logic can be added here

        // Insert the new Inventory Transaction record
        insert inventoryTransaction;

        // Example: Log the details of the created Inventory Transaction record
        System.debug('Created Inventory Transaction Record - Id: ' + inventoryTransaction.Id);
    }
}