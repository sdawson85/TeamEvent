using TeamEvent.Server.Persistence.Interfaces;

namespace TeamEvent.Server.Persistence;

public class FakeEmailSender(ILogger<FakeEmailSender> logger) : IFakeEmailSender
{
    /// <inheritdoc />
    public Task SendEmailAsync(string[] to, string from, string subject, string body)
    {
        logger.LogDebug("Fake sending email");
        logger.LogInformation($"An event with subject {subject} has been created. Body of email: {body}. Should be sent to: {to} and is sent from owner {from}");
        logger.LogDebug("Fake sending email sent.");
        return Task.CompletedTask;
    }
}