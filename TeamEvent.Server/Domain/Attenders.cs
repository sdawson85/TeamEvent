namespace TeamEvent.Server.Domain;

public class Attenders(string email, int teamEventId)
{
    public int Id { get; private set; }
    public string Email { get; private set; } = email;
    public int TeamEventId { get; private set; } = teamEventId;
    public virtual TeamEvent TeamEvent { get; private set; }
}