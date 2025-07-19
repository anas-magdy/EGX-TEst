using Microsoft.AspNetCore.Mvc;
using Brokers.DTO;
using Brokers.Service;
using Microsoft.AspNetCore.Authorization;
using Brokers.Constants;
namespace Brokers.Controllers
{
    

    public class BrokerController : Controller
    {
        private IBrokerService brokerService;
        public BrokerController(IBrokerService brokerService)
        {
            this.brokerService = brokerService;
        }
        [Authorize(Roles = Roles.Admin)]
        [HttpPost("add")]
        public IActionResult AddBroker([FromBody] BrokerDTO newBroker)
        {
            if (!ModelState.IsValid)
                return BadRequest(new { success = false, message = "data Invalid" });

            var broker = brokerService.AddBroker(newBroker);

            if (broker == null)
                return BadRequest(new { success = false, message = "Broker code already exists" });

            return Ok(new { success = true, data = broker });
        }

        [HttpGet("all")]
        public IActionResult GetAll(int page = 1)
        {
            int pageSize = 10;
            var brokers = brokerService.GetAll(page, pageSize);
            return Ok(brokers);
        }
        [HttpGet("/Broker/{code}")]
        public IActionResult GetByCode(string code)
        {
            var broker = brokerService.GetByCode(code);
            if (broker == null)
                return NotFound(new { success = false, message = "Broker not found" });

            return Ok(broker);
        }
        [Authorize(Roles = Roles.Admin)]
        [HttpPut("update/{code}")]
        public IActionResult Update(string code, [FromBody] BrokerDTO updated)
        {
            bool updatedResult = brokerService.UpdateBroker(code, updated);
            if (!updatedResult)
                return NotFound(new { success = false, message = "Broker not found or already deleted" });

            return Ok(new { success = true, message = "Broker updated successfully" });
        }
        [Authorize(Roles = Roles.Admin)]
        [HttpDelete("Broker/delete/{code}")]
        public IActionResult Delete(string code)
        {
            bool deleted = brokerService.DeleteBroker(code);
            if (!deleted)
                return NotFound(new { success = false, message = "Broker not found or already deleted" });

            return Ok(new { success = true, message = "Broker deleted (soft delete)" });
        }
    }
}
