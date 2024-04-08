using Microsoft.AspNetCore.Http.HttpResults;
using Microsoft.EntityFrameworkCore;
using TeamEvent.Server.Domain;
using TeamEvent.Server.Infrastructure;
using TeamEvent.Server.Models;
using TeamEvent.Server.Persistence.Interfaces;

namespace TeamEvent.Server.Persistence;

public class EventRepository(ApplicationDbContext context) : IEventRepository
{
    /// <inheritdoc />
    public async Task<bool> AddEventAsync(EventDto request)
    {
        var teamEventSet = context.Set<Domain.TeamEvent>();

        var newEvent = new Domain.TeamEvent(
            request.EventName,
            request.Venue,
            request.StartAt,
            request.EndAt,
            request.CreatedBy,
            request.TenantId
        );
        
        await teamEventSet.AddAsync(newEvent);
        await context.SaveChangesAsync(); 

        await AddAttenders(request, newEvent);

        return true;
    }

    /// <inheritdoc />
    public async Task<List<EventSummaryDto>> GetEventsByTenantIdAsync(string tenantId)
    {
        var events = await context
            .TeamEvents
            .Where(w => w.TenantId == tenantId)
            .Include(x=>x.Attenders)
            .Select(s=> new EventSummaryDto(s.Id,
                s.Name,s.Venue,s.CreatedBy,s.StartAt,s.EndAt,
                new List<string> { string.Join(", ", s.Attenders.Select(x => x.Email)) },
                s.TenantId))
            .ToListAsync();
        return events;
    }

    private async Task AddAttenders(EventDto request, Domain.TeamEvent newEvent)
    {
        var attendersSet = context.Set<Attenders>();
        var attenders = request.Attenders
            .Select(a => new Attenders(a, newEvent.Id))
            .ToList();

        await attendersSet.AddRangeAsync(attenders);
        await context.SaveChangesAsync();
    }
}