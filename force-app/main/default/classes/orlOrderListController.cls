public without sharing class orlOrderListController {
    public class OrderInfo {
        @AuraEnabled public Id orderId;
        @AuraEnabled public Id accountId;
        @AuraEnabled public String accountName;
        @AuraEnabled public Id product2Id;
        @AuraEnabled public String product2Name;
        @AuraEnabled public Decimal quantity;
        @AuraEnabled public String returnStatus;
        @AuraEnabled public String returnType;
        @AuraEnabled public Integer orderNumber;

        public OrderInfo(Id orderId, Id accountId, String accountName, Id product2Id, String product2Name, Decimal quantity, String returnStatus, String returnType, Integer orderNumber) {
            this.orderId = orderId;
            this.accountId = accountId;
            this.accountName = accountName;
            this.product2Id = product2Id;
            this.product2Name = product2Name;
            this.quantity = quantity;
            this.returnStatus = returnStatus;
            this.returnType = returnType;
            this.orderNumber = orderNumber;
        }

        // Default (no-argument) constructor for serialization
        public OrderInfo() {
        }
    }

    @AuraEnabled
    public static List<OrderInfo> getOrder(Id userId) {
        System.debug('userId: ' + userId);

        // Fetch the accountId associated with the user
        String accountId = [SELECT AccountId FROM User WHERE Id = :userId].AccountId;
        System.debug('Account Id: ' + accountId);

        List<OrderInfo> orderInfoList = new List<OrderInfo>();

        try {
            // Query OrderItem records and populate the OrderInfo list
            List<OrderItem> orderItemList = [SELECT Id, Order.AccountId, Order.Account.Name, Order.OrderNumber, Product2Id, Product2.Name, Quantity, Order.Return_Status__c, Order.Return_Type__c FROM OrderItem WHERE Order.AccountId = :accountId];
			System.debug(orderItemList);
          for (OrderItem item : orderItemList) {
                OrderInfo orderInfo = new OrderInfo(
    item.Id,
    item.OrderId,
    item.Order.Account.Name,
    item.Product2Id,
    item.Product2.Name,
    item.Quantity,
    item.Order.Return_Status__c,
    item.Order.Return_Type__c,
    Integer.valueOf(item.Order.OrderNumber)
);

                orderInfoList.add(orderInfo);
            }

           // System.debug('Records: ' + orderInfoList);
        } catch (Exception e) {
            System.debug('Error fetching order data: ' + e.getMessage());
            throw new AuraHandledException('An error occurred: ' + e.getMessage());
        }

        return orderInfoList;
    }
}