using TeamEvent.Server.Models;

namespace TeamEvent.Server.Persistence.Interfaces;

public interface IEventService
{
    Task<bool> SaveTeamEventAsync(EventDto request);
    Task<List<EventSummaryDto>> GetEventsByTenantIdAsync(string tenantId);
}