using TeamEvent.Server.Persistence.Interfaces;

namespace TeamEvent.Server.Persistence;

public class FakeEmailSender(ILogger<FakeEmailSender> logger) : IFakeEmailSender
{
    private readonly ILogger<FakeEmailSender> _logger = logger;
    /// <inheritdoc />
    public async Task SendEmailAsync(string[] to, string from, string subject, string body)
    {
        _logger.LogDebug("Fake sending email");
        _logger.LogInformation($"An event with subject {subject} has been created. Body of email: {body}. Should be sent to: {to} and is sent from owner {from}");
        _logger.LogDebug("Fake sending email sent.");
    }
}