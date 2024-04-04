using Microsoft.EntityFrameworkCore;
using Moq;
using TeamEvent.Server.Domain;
using TeamEvent.Server.Infrastructure;
using TeamEvent.Server.Models;
using TeamEvent.Server.Persistence;
using TeamEvent.Server.Persistence.Interfaces;

namespace TestProject1
{
    public class UnitTest1
    {
        private readonly Mock<IEventRepository> _mockEventRepository;
        private readonly Mock<IFakeEmailSender> _mockFakeEmailSender;
        private readonly EventService _eventService;

        public UnitTest1()
        {
            // Initialize the mocks
            _mockEventRepository = new Mock<IEventRepository>();
            _mockFakeEmailSender = new Mock<IFakeEmailSender>();

            // Initialize the EventService with mocked dependencies
            _eventService = new EventService(_mockEventRepository.Object, _mockFakeEmailSender.Object);
        }

        [Fact]
        public async Task SaveTeamEventAsync_ShouldReturnTrue_WhenEventIsSavedSuccessfully()
        {
            // Arrange
            var eventDto =  new EventDto("Sample Event","Sample Venue", "user@example.com", DateTime.Now.AddHours(1),DateTime.Now.AddHours(2), new List<string> { "attendee1@example.com", "attendee2@example.com" }, "tenant1");

            // Mock repository to return true when adding the event
            _mockEventRepository.Setup(r => r.AddEventAsync(It.IsAny<EventDto>())).ReturnsAsync(true);

            // Act
            var result = await _eventService.SaveTeamEventAsync(eventDto);

            // Assert
            Assert.True(result);  // Ensure that the result is true (event was saved successfully)

            // Verify that the SendEmailAsync method was called
            _mockFakeEmailSender.Verify(f => f.SendEmailAsync(It.IsAny<string[]>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Once);
        }
        [Fact]
        public async Task SaveTeamEventAsync_ShouldReturnFalse_WhenEventSaveFails()
        {
            // Arrange
            var eventDto = new EventDto("Sample Event", "Sample Venue", "user@example.com", DateTime.Now.AddHours(1),
                DateTime.Now.AddHours(2), new List<string> { "attendee1@example.com", "attendee2@example.com" },
                "tenant1");

            // Mock repository to return false when adding the event
            _mockEventRepository.Setup(r => r.AddEventAsync(It.IsAny<EventDto>())).ReturnsAsync(false);

            // Act
            var result = await _eventService.SaveTeamEventAsync(eventDto);

            // Assert
            Assert.False(result);  // Ensure that the result is false (event save failed)

            // Verify that SendEmailAsync was not called since event save failed
            _mockFakeEmailSender.Verify(f => f.SendEmailAsync(It.IsAny<string[]>(), It.IsAny<string>(), It.IsAny<string>(), It.IsAny<string>()), Times.Never);
        }

        [Fact]
        public async Task GetEventsByTenantIdAsync_ShouldReturnList_WhenEventsExist()
        {
            // Arrange
            var events = new List<EventSummaryDto>
            {
               new EventSummaryDto(1,"Event 1","Office London","email@london.org",DateTime.Now,DateTime.Now.AddHours(2),new List<string> { "attendee1@example.com", "attendee2@example.com" },"tenant1"  ),
               new EventSummaryDto(2,"Event 2","Office London","email@london.org",DateTime.Now,DateTime.Now.AddHours(2),new List<string> { "attendee1@example.com", "attendee2@example.com" },"tenant1"  ),
               new EventSummaryDto(3,"Event 3","Office London","email@london.org",DateTime.Now,DateTime.Now.AddHours(2),new List<string> { "attendee1@example.com", "attendee2@example.com" },"tenant1"  ),
            };

            _mockEventRepository.Setup(x => x.GetEventsByTenantIdAsync(It.IsAny<string>())).ReturnsAsync(events);

            // Act
            var result = await _eventService.GetEventsByTenantIdAsync("tenant1");

            // Assert
            Assert.NotNull(result);
            Assert.Equal(3, result.Count);
            Assert.Equal("Event 1", result[0].EventName);
            Assert.Equal("Event 2", result[1].EventName);
            Assert.Equal("Event 3", result[2].EventName);
        }
    }
}

