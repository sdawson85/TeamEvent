namespace TeamEvent.Server.Domain;

public class TeamEvent(string name,string venue,DateTime startAt, DateTime endAt,string createdBy,string tenantId)
{
    public int Id { get; private set; }
    public string Name { get; private set; } = name;
    public string Venue { get; private set; } = venue;
    public DateTime StartAt { get; private set; } = startAt;
    public DateTime EndAt { get; private set; } = endAt;
    public string CreatedBy { get; private set; } = createdBy;
    public string TenantId { get; private set; } = tenantId;

    public readonly List<Attenders> attenders = new List<Attenders>();
    public IEnumerable<Attenders> Attenders => attenders.AsReadOnly();

    public void AddAttender(List<Attenders> attenders)
    {
        attenders.AddRange(attenders);
    }

    public void RemoveAttender(int id)
    {
        var attender = attenders.Find(x => x.Id == id);
        if (attender is not null)
        {
            attenders.Remove(attender);
        }
        
    }
}