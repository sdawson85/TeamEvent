using TeamEvent.Server.Models;
using TeamEvent.Server.Persistence.Interfaces;

namespace TeamEvent.Server.Persistence;

public class EventService(IEventRepository repository, IFakeEmailSender fakeEmailSender) : IEventService
{
    private readonly IEventRepository _repository = repository;
    private readonly IFakeEmailSender _fakeEmailSender = fakeEmailSender;
    /// <inheritdoc />
    public async Task<bool> SaveTeamEventAsync(EventDto request)
    {
        var result = await _repository.AddEventAsync(request);
        var subject = $"Event {request.Venue} has been created.";
        var body =
            $"We would like to invite you to attend to our event {request.Venue} which starts at {request.StartAt} will be online up to {request.EndAt}";
        if (result)
        {
            await _fakeEmailSender.SendEmailAsync(request.Attenders.ToArray(), request.CreatedBy, subject, body);
            return true;
        }

        return false;

    }

    public async Task<List<EventSummaryDto>> GetEventsByTenantIdAsync(string tenantId)
    {
        return await _repository.GetEventsByTenantIdAsync(tenantId);
    }
}