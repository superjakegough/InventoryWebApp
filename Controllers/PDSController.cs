using System;
using System.Collections.Generic;
using System.Data.SqlClient;
using System.Linq;
using InventoryWebApp.Models;
using Dapper;
using Microsoft.AspNetCore.Mvc;
using System.IO;
using Newtonsoft.Json;

namespace InventoryWebApp.Controllers
{
    [Route("api/[controller]")]
    public class PDSController : Controller
    {
        [HttpGet]
        [Route("GetInventory")]
        public List<Reagent> GetInventory()
        {
            DateTime date = DateTime.Today;
            string query = "SELECT * FROM PDSInventoryTable;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    List<Reagent> temp = conn.Query<Reagent>(query).ToList();
                    foreach (Reagent r in temp)
                    {
                        r.DateWarning = CheckDate(date, r.Expiry);
                        r.StockWarning = CheckStock(r.Quantity, r.Minimum);
                    }
                    return temp;
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Reagent>();
                }
            }
        }

        [HttpGet]
        [Route("GetArchive")]
        public List<Reagent> GetArchive()
        {
            string query = "SELECT * FROM PDSArchiveTable;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.Query<Reagent>(query).ToList();
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return new List<Reagent>();
                }
            }
        }

        [HttpGet]
        [Route("GetByIdInventory")]
        public Reagent GetByIdInventory([FromQuery]int id)
        {
            string query = "SELECT * FROM PDSInventoryTable WHERE Id=@Id;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.QueryFirstOrDefault<Reagent>(query, new { id });
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return null;
                }
            }
        }

        [HttpGet]
        [Route("GetByIdArchive")]
        public Reagent GetByIdArchive([FromQuery]int id)
        {
            string query = "SELECT * FROM PDSArchiveTable WHERE Id=@Id;";
            using (SqlConnection conn = new SqlConnection(Connection.ConnString))
            {
                try
                {
                    conn.Open();
                    return conn.QueryFirstOrDefault<Reagent>(query, new { id });
                }
                catch (Exception ex)
                {
                    System.Diagnostics.Debug.WriteLine(ex);
                    return null;
                }
            }
        }

        [HttpPost]
        [Route("CreateInventory")]
        public int CreateInventory()
        {
            Reagent reagent = new Reagent();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                reagent = JsonConvert.DeserializeObject<Reagent>(sr.ReadToEnd());
            }
            if (reagent != null)
            {
                string query = "IF NOT EXISTS (SELECT * FROM PDSInventoryTable WHERE Name=@Name AND Supplier=@Supplier AND Batch=@Batch) " +
                "INSERT INTO PDSInventoryTable (Name, Supplier, Batch, Validated, Expiry, Quantity, Minimum)" +
                "VALUES (@Name, @Supplier, @Batch, @Validated, @Expiry, @Quantity, @Minimum);";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, reagent);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        return -1;
                    }
                }
            }
            else
            {
                return -1;
            }
        }

        public int CreateArchive(Reagent reagent)
        {
            if (reagent != null)
            {
                string query = "INSERT INTO PDSArchiveTable (Id, Name, Supplier, Batch, Validated, Expiry, Minimum, Quantity) " +
                "VALUES (@Id, @Name, @Supplier, @Batch, @Validated, @Expiry, @Minimum, @Quantity);";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, reagent);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        return -1;
                    }
                }
            }
            else
            {
                return -1;
            }
        }

        [HttpPut]
        [Route("UpdateInventory")]
        public int UpdateInventory()
        {
            Reagent before;
            Reagent after;
            int rows = 0;
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                List<Reagent> reagents = JsonConvert.DeserializeObject<List<Reagent>>(sr.ReadToEnd());
                before = reagents[0];
                after = reagents[1];
            }
            if (after != null)
            {
                string query = "UPDATE PDSInventoryTable" +
                " SET Validated=@Validated, Expiry=@Expiry, Quantity=@Quantity WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        rows = conn.Execute(query, after);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                    }
                }
            }
            if (before.Quantity > after.Quantity)
            {
                after.Quantity = (before.Quantity - after.Quantity);
                UpdateArchive(after);
            }
            return rows;
        }

        public int UpdateArchive(Reagent reagent)
        {
            int rows = 0;
            if (reagent != null)
            {
                string query = "UPDATE PDSArchiveTable" +
                " SET Quantity+=@Quantity WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        rows = conn.Execute(query, reagent);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                    }
                }
            }
            if (rows == 0)
            {
                CreateArchive(reagent);
            }
            return rows;
        }

        [HttpDelete()]
        [Route("DeleteInventory")]
        public int DeleteInventory()
        {
            int rows = 0;
            Reagent reagent = new Reagent();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                reagent = JsonConvert.DeserializeObject<Reagent>(sr.ReadToEnd());
            }
            if (reagent != null)
            {
                string query = "DELETE FROM PDSInventoryTable WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        rows = conn.Execute(query, reagent);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                    }
                }
            }
            if (rows == 0)
            {
                UpdateArchive(reagent);
            }
            return rows;
        }

        [HttpDelete()]
        [Route("DeleteArchive")]
        public int DeleteArchive()
        {
            Reagent reagent = new Reagent();
            using (StreamReader sr = new StreamReader(Request.Body))
            {
                reagent = JsonConvert.DeserializeObject<Reagent>(sr.ReadToEnd());
            }
            if (reagent != null)
            {
                string query = "DELETE FROM PDSArchiveTable WHERE Id=@Id;";
                using (SqlConnection conn = new SqlConnection(Connection.ConnString))
                {
                    try
                    {
                        conn.Open();
                        return conn.Execute(query, reagent);
                    }
                    catch (Exception ex)
                    {
                        System.Diagnostics.Debug.WriteLine(ex);
                        return -1;
                    }
                }
            }
            return -1;
        }

        public int CheckDate(DateTime date, string expirystring)
        {
            DateTime expiry = DateTime.Parse(expirystring);
            if (expiry < date)
            {
                return 2;
            }
            else if (expiry < date.AddMonths(1))
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }

        public int CheckStock(int quantity, int minimum)
        {
            if (quantity < minimum)
            {
                return 2;
            }
            else if (quantity < (minimum * 2))
            {
                return 1;
            }
            else
            {
                return 0;
            }
        }
    }
}
