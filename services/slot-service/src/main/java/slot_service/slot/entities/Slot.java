package slot_service.slot.entities;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalTime;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.Index;
import jakarta.persistence.Table;
import jakarta.persistence.UniqueConstraint;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import slot_service.common.entities.BaseEntity;

@Entity
@Table(
    name = "slots",
    uniqueConstraints = {
        @UniqueConstraint(
            name = "uk_court_date_start_time",
            columnNames = {"court_id", "slot_date", "start_time"}
        )
    },
    indexes = {
        @Index(
            name = "idx_court_slot_date",
            columnList = "court_id, slot_date"
        )
    }
)
@AttributeOverride(
    name = "id",
    column = @Column(name = "slot_id")
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Slot extends BaseEntity {

    @Column(name = "court_id", nullable = false)
    private Long courtId;

    @Column(name = "slot_date", nullable = false)
    private LocalDate slotDate;

    @Column(name = "start_time", nullable = false)
    private LocalTime startTime;

    @Column(name = "end_time", nullable = false)
    private LocalTime endTime;

    @Column(name = "price", precision = 10, scale = 2)
    private BigDecimal price;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private SlotStatus status;
}
