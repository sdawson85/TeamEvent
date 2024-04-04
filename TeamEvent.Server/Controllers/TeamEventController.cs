using Microsoft.AspNetCore.Mvc;
using TeamEvent.Server.Models;
using TeamEvent.Server.Persistence.Interfaces;

namespace TeamEvent.Server.Controllers;

[ApiController]
[Route("[controller]")]
public class TeamEventController(IEventService eventService) : ControllerBase
{
    private readonly IEventService _eventService = eventService;

    [HttpGet("Index")]
    public async Task<IActionResult> Index()
    {
        if (!Request.Headers.TryGetValue("X-Tenant-ID", out var tenantId) || string.IsNullOrWhiteSpace(tenantId))
        {
            return BadRequest("Missing X-Tenant-ID header");
        }
        var events = await _eventService.GetEventsByTenantIdAsync(tenantId);
        return Ok(events);
    }
    [HttpPost("AddEvent")]
    public async Task<IActionResult> AddEvent([FromBody] EventDto request)
    {
        if (!Request.Headers.TryGetValue("X-Tenant-ID", out var tenantId) || string.IsNullOrWhiteSpace(tenantId))
        {
            return BadRequest("Missing X-Tenant-ID header");
        }

        request = request with { TenantId = tenantId };
        var success = await _eventService.SaveTeamEventAsync(request);
        return success ? Ok() : StatusCode(500);
    }
}