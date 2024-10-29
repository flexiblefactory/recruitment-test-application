using InterviewTest.Model;
using Microsoft.AspNetCore.Mvc;
using Microsoft.Data.Sqlite;
using RecruitmentTestApplication;
using System;
using System.Collections.Generic;
using Microsoft.AspNetCore.SignalR;
using RecruitmentTestApplication.Hubs;

namespace InterviewTest.Controllers
{

    public class EmployeesController : ControllerBase
    {
        private readonly IHubContext<ChatHub> _hubContext;

        public EmployeesController(IHubContext<ChatHub> hubContext)
        {
            _hubContext = hubContext;
        }

        [HttpPost("employees")]
        public async Task<IActionResult> Create([FromBody] Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var insertCmd = connection.CreateCommand();
                insertCmd.CommandText = @"INSERT INTO Employees (Name, Value) VALUES (@Name, @Value); SELECT last_insert_rowid();";
                insertCmd.Parameters.AddWithValue("@Name", employee.Name);
                insertCmd.Parameters.AddWithValue("@Value", employee.Value);

                long newId = (long)insertCmd.ExecuteScalar();

                employee.Id = (int)newId;

                await _hubContext.Clients.All.SendAsync("DataChanged");
                return CreatedAtAction(nameof(Get), new { id = employee.Id }, employee);
            }
        }
        [HttpGet("employees")]
        public List<Employee> Get()
        {
            var employees = new List<Employee>();

            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var queryCmd = connection.CreateCommand();
                queryCmd.CommandText = @"SELECT Id, Name, Value FROM Employees";
                using (var reader = queryCmd.ExecuteReader())
                {
                    while (reader.Read())
                    {
                        try{
                         employees.Add(     new Employee       {
                            Id = reader.GetInt32(0),
                            Name = reader.GetString(1),
                            Value = reader.GetInt32(2)
                        }); 
              
                        } catch(Exception e){
                            Console.WriteLine(e.Message);
                        }
                        
                    }
                }
            }

            return employees;
        }

        [HttpPut("employees/{id}")]
        public async Task<IActionResult> Update(int id, [FromBody] Employee employee)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var updateCmd = connection.CreateCommand();
                updateCmd.CommandText = @"UPDATE Employees SET Name = @Name, Value = @Value WHERE Id = @Id";
                updateCmd.Parameters.AddWithValue("@Name", employee.Name);
                updateCmd.Parameters.AddWithValue("@Value", employee.Value);
                updateCmd.Parameters.AddWithValue("@Id", id);

                int rowsAffected = updateCmd.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound();
                }

                await _hubContext.Clients.All.SendAsync("DataChanged");
            }

            return NoContent();
        }

        [HttpDelete("employees/{id}")]
        public async Task<IActionResult> Delete(int id)
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var deleteCmd = connection.CreateCommand();
                deleteCmd.CommandText = @"DELETE FROM Employees WHERE Id = @Id";
                deleteCmd.Parameters.AddWithValue("@Id", id);

                int rowsAffected = deleteCmd.ExecuteNonQuery();

                if (rowsAffected == 0)
                {
                    return NotFound();
                }

                await _hubContext.Clients.All.SendAsync("DataChanged");
            }

            return NoContent();
        }

        
        [HttpGet("total-value-abc")]
        public IActionResult GetTotalValueABC()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var selectCmd = connection.CreateCommand();
                selectCmd.CommandText = @"
                    SELECT SUM(Value) AS TotalValue
                    FROM Employees
                    WHERE Name LIKE 'A%' OR Name LIKE 'B%' OR Name LIKE 'C%'";

                var result = selectCmd.ExecuteScalar();

                if (result != null && result != DBNull.Value)
                {
                    return Ok(new { TotalValue = Convert.ToInt64(result) });
                }
                else
                {
                    return NotFound("No results found");
                }
            }
        }

        [HttpPost("increment-values")]
        public async Task<IActionResult> IncrementValues()
        {
            var connectionStringBuilder = new SqliteConnectionStringBuilder() { DataSource = "./SqliteDB.db" };
            using (var connection = new SqliteConnection(connectionStringBuilder.ConnectionString))
            {
                connection.Open();

                var updateCmd = connection.CreateCommand();
                updateCmd.CommandText = @"
                    UPDATE Employees
                    SET Value = Value + 
                        CASE 
                            WHEN Name LIKE 'E%' THEN 1   -- Increment by 1 for names starting with 'E'
                            WHEN Name LIKE 'G%' THEN 10  -- Increment by 10 for names starting with 'G'
                            ELSE 100                     -- Increment by 100 for all other names
                        END;";

                int rowsAffected = updateCmd.ExecuteNonQuery();

                await _hubContext.Clients.All.SendAsync("DataChanged");

                return Ok($"{rowsAffected} rows updated.");
            }
        }
    }
}
