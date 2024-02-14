public with sharing class OrlInvoiceController {
    private final Orl_invoice__c originalInvoice;
    private List<OrderItem> orderItems;

    public OrlInvoiceController(ApexPages.StandardController stdController) {
        this.originalInvoice = (Orl_invoice__c)stdController.getRecord();

        // Query the necessary fields including Orl_Order__c
        List<Orl_invoice__c> invoices = [SELECT Id, Orl_Order__c, Orl_Distributor__c, Orl_Invoice_Bill_To__Street__s, Orl_Invoice_Bill_To__City__s, Orl_Invoice_Bill_To__PostalCode__s, Orl_Invoice_Bill_To__CountryCode__s, Orl_Invoiced_Date__c, Orl_Sales_Person__c, Orl_Tel__c, Orl_Credit_Period__c, Orl_Units_Qty__c, Orl_Gross_Value_Total__c FROM Orl_invoice__c WHERE Id = :originalInvoice.Id LIMIT 1];
        
        if (!invoices.isEmpty()) {
            // Use a separate variable to store the queried invoice data
            Orl_invoice__c queriedInvoice = invoices[0];
            // Fetch related order items
            this.orderItems = getRelatedOrderItems(queriedInvoice);
        } else {
            this.orderItems = new List<OrderItem>();
        }
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    private List<OrderItem> getRelatedOrderItems(Orl_invoice__c queriedInvoice) {
        List<OrderItem> items = new List<OrderItem>();

        if (queriedInvoice.Orl_Order__c != null) {
            // Assuming you have a relationship field named 'Orl_Order__c' on Orl_invoice__c
            Order order = [SELECT Id FROM Order WHERE Id = :queriedInvoice.Orl_Order__c LIMIT 1];

            if (order != null && order.Id != null) {
                // Fetch related order items
                items = [SELECT Id, Product2.ProductCode, Product2.Name,UnitPrice,Quantity,TotalPrice FROM OrderItem WHERE OrderId = :order.Id];
            }
        }

        return items;
    }
}