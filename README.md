# Team Event

## A full-stack web application built as part of a technical assessment. The app enables users to create events with attendee details, simulates sending email invitations, and supports tenant-specific data isolation via custom headers.

## :globe_with_meridians: Live URLs

- **Frontend (React + TypeScript)**: https://teamevents21.netlify.app/
- **Backend (ASP.NET Core API)**: https://te-webapp-cca.azurewebsites.net

---

## :cog: Tech Stack

### Frontend

- React
- TypeScript
- Bootstrap (optional)

### Backend

- ASP.NET Core (.NET 9+)
- Entity Framework Core (SQlServer or Azure SQL)
- xUnit (unit testing)

### Deployment

- Frontend: Netlify
- Backend: Azure App Service

---

## :spanner: Features

- Create events with:
  - Name
  - Start and end time
  - Venue
  - Multiple attendees (name + email)
- View list of created events with attendee info
- Simulated email invites via logging
- Multi-tenancy simulation using `X-Tenant-ID` header
- Basic unit testing on core logic

---

## :bricks: Architecture

This project follows a layered, service-oriented architecture:
Controllers → Services → Repositories → Database
Business logic is encapsulated in service classes to ensure separation of concerns and testability.
**Example:**

```csharp
public class EventService(IEventRepository repository, IFakeEmailSender fakeEmailSender) : IEventService
{
    private readonly IEventRepository _repository = repository;
    private readonly IFakeEmailSender _fakeEmailSender = fakeEmailSender;
    /// <inheritdoc />
    public async Task<bool> SaveTeamEventAsync(EventDto request)
    {
        var result = await _repository.AddEventAsync(request);
        var subject = $“Event {request.Venue} has been created.“;
        var body =
            $“We would like to invite you to attend to our event {request.Venue} which starts at {request.StartAt} will be online up to {request.EndAt}“;
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
```

:test_tube:
Testing
Core backend logic is tested using xUnit.
Test cases include saving events and mocking email dispatch.
Run tests using:

```
cd TestProject1/
dotnet test
```

:building_construction:
Directory Structure

```
teamevent/
├── TeamEvent.Server/
│   ├── Controllers/
│   ├── Domain/
│   ├── Infrastructure/
│   ├─── Config/
│   ├── Migrations/
│   ├── Models/
│   ├── Persistence/
│   ├──── Interfaces/
│   └── Program.cs
├── teamevent.client/
│   ├── src/
│   ├──── api/
│   ├──── assets/
│   ├──── components/
│   ├──── models/
│   ├──── utils/
│   ├── public/
│   └── package.json
├── TestProject1
|
├── README.md
```

:satellite_antenna:
API Details
Headers
All requests must include the following header to simulate multi-tenancy:
X-Tenant-ID: demo-tenant
Example Request

```
POST {{TeamEvent.Server_HostAddress}}/TeamEvent/AddEvent
X-Tenant-ID: tenant1
Content-Type: application/json
{
    “EventName”: “Concert2",
    “Venue”: “Stadium”,
    “CreatedBy”: “Admin”,
    “StartAt”: “2025-04-10T19:00:00",
    “EndAt”: “2025-04-10T22:00:00",
    “Attenders”: [“jhone@london.uk”, “jane@london.uk”, “doe@london.uk”],
    “TenantId”:“”
 }
```

:email: Email Simulation
Email invites are mocked and logged to the console or optionally saved to a database for debugging purposes. No real emails are sent.
:memo: Assumptions

- Authentication is not required.
- Form validation is minimal for simplicity.
- Static tenant ID is used during development.
- Styling is functional, not fancy.
  :rocket: Local Development
  Backend

```
cd TeamEvent.Sereve/
dotnet restore
dotnet ef database update
dotnet run
```

cd teamevent.client/

```
npm install
npm run dev
```

Make sure to update the API URL in config or .env file.
