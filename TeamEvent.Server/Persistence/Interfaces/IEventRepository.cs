using TeamEvent.Server.Models;

namespace TeamEvent.Server.Persistence.Interfaces;

public interface IEventRepository
{
    Task<bool> AddEventAsync(EventDto request);
    Task<List<EventSummaryDto>> GetEventsByTenantIdAsync(string tenantId);
}