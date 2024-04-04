namespace TeamEvent.Server.Models;

public record EventSummaryDto(
    int Id,
    string EventName,
    string Venue,
    string CreatedBy,
    DateTime StartAt,
    DateTime EndAt,
    List<string> Attenders,
    string TenantId);
