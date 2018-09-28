namespace InventoryWebApp.Models
{
    public class Reagent
    {
        public int Id { get; set; }
        public string Name { get; set; }
        public string Supplier { get; set; }
        public string Batch { get; set; }
        public string Validated { get; set; }
        public string Expiry { get; set; }
        public int Quantity { get; set; }
        public int DateWarning { get; set; }
    }
}
