using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Metadata.Builders;

namespace TeamEvent.Server.Infrastructure.Config;

public class TeamEventConfig : IEntityTypeConfiguration<Domain.TeamEvent>
{
    /// <inheritdoc />
    public void Configure(EntityTypeBuilder<Domain.TeamEvent> builder)
    {
        builder.HasKey(x => x.Id);
        builder.Property(p => p.CreatedBy)
            .IsRequired()
            .HasMaxLength(DbConstSchema.DEFAULT_EMAIL_LENGTH);
        builder.Property(p => p.Venue)
            .IsRequired()
            .HasMaxLength(DbConstSchema.DEFAULT_VENUE_NAME_LENGTH);
        builder.Property(p => p.StartAt)
            .IsRequired();
        builder.Property(p => p.EndAt)
            .IsRequired();
        builder.HasMany(x => x.Attenders)
            .WithOne(x => x.TeamEvent)
            .HasForeignKey(x => x.TeamEventId)
            .OnDelete(DeleteBehavior.Cascade)
            .IsRequired();
    }
}