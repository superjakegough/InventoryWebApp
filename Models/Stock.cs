namespace InventoryWebApp.Models
{
    public class Stock
    {
        public string Name { get; set; }
        public int Minimum { get; set; }
        public int Quantity { get; set; }
        public int StockWarning { get; set; }
    }
}
