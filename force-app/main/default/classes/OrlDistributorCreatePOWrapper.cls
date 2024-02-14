public class OrlDistributorCreatePOWrapper {

	public class ProductCategoryProducts {
		public String ProductId;
		public String Id;
		public String Name;
		public String ProductCategoryId;
		public ProductCategory ProductCategory;
	}

	public class PricebookEntries {
		public String Product2Id;
		public String Id;
		public String Pricebook2Id;
		public Integer UnitPrice;
	}

	public class ProductCategory {
		public String Name;
		public String Id;
	}

	public String Id;
	public String Name;
	public List<ProductCategoryProducts> ProductCategoryProducts;
	public List<PricebookEntries> PricebookEntries;
	public String categoryName;
	public Integer productPrice;
	public Integer AskedQuantity;
	public String ProductCode;

	
	// public static List<OrlDistributorCreatePOWrapper> parse(String json) {
	// 	return (List<OrlDistributorCreatePOWrapper>) System.JSON.deserialize(json, List<OrlDistributorCreatePOWrapper>.class);
	// }
}