using TeamEvent.Server.Models;
using TeamEvent.Server.Persistence.Interfaces;

namespace TeamEvent.Server.Persistence;

public class EventService(IEventRepository repository, IFakeEmailSender fakeEmailSender) : IEventService
{
    /// <inheritdoc />
    public async Task<bool> SaveTeamEventAsync(EventDto request)
    {
        var result = await repository.AddEventAsync(request);
        var subject = $"Event {request.Venue} has been created.";
        var body =
            $"We would like to invite you to attend to our event {request.Venue} which starts at {request.StartAt} will be online up to {request.EndAt}";
        if (!result) return false;
        await fakeEmailSender.SendEmailAsync(request.Attenders.ToArray(), request.CreatedBy, subject, body);
        return true;

    }

    public async Task<List<EventSummaryDto>> GetEventsByTenantIdAsync(string tenantId)
    {
        return await repository.GetEventsByTenantIdAsync(tenantId);
    }
}