package slot_service.slot.repositories;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Modifying;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;
import org.springframework.transaction.annotation.Transactional;

import slot_service.slot.entities.Slot;

@Repository
public interface SlotRepository extends JpaRepository<Slot, Long> {

    List<Slot> findAllByCourtIdAndSlotDate(Long courtId, LocalDate slotDate);

    boolean existsByCourtIdAndSlotDateAndStartTime(
            Long courtId,
            LocalDate slotDate,
            LocalTime startTime);

    List<Slot> findAllByCourtId(Long courtId);

    List<Slot> findAllBySlotDate(LocalDate slotDate);

    @Modifying
    @Transactional
    @Query("""
            UPDATE Slot s
            SET s.status='BLOCKED'
            WHERE s.id=:slotId
            """)
    int blockSlot(@Param("slotId") Long slotId);

    @Modifying
    @Transactional
    @Query("""
            UPDATE Slot s
            SET s.status='AVAILABLE'
            WHERE s.id=:slotId
            """)
    int unblockSlot(@Param("slotId") Long slotId);

    @Modifying
    @Transactional
    @Query("""
            UPDATE Slot s
            SET s.status='BOOKED'
            WHERE s.id=:slotId
            AND s.status='AVAILABLE'
            """)
    int bookSlot(@Param("slotId") Long slotId);

    @Modifying
    @Transactional
    @Query("""
            UPDATE Slot s
            SET s.status='AVAILABLE'
            WHERE s.id=:slotId
            AND s.status='BOOKED'
            """)
    int releaseSlot(@Param("slotId") Long slotId);

    @Modifying
    @Transactional
    @Query("""
            UPDATE Slot s
            SET s.status='EXPIRED'
            WHERE
            (
                s.slotDate < :today
                OR
                (
                    s.slotDate = :today
                    AND s.endTime < :currentTime
                )
            )
            AND s.status='AVAILABLE'
            """)
    int expirePastSlots(@Param("today") LocalDate today,
                        @Param("currentTime") LocalTime currentTime);

    @Modifying
    @Transactional
    @Query("""
            DELETE FROM Slot s
            WHERE s.courtId = :courtId
            AND s.slotDate >= :today
            AND s.status = 'AVAILABLE'
            """)
    void deleteFutureAvailableSlots(@Param("courtId") Long courtId, @Param("today") LocalDate today);

    @Query("""
            SELECT MAX(s.slotDate)
            FROM Slot s
            WHERE s.courtId = :courtId
            """)
    LocalDate findMaxSlotDateByCourt(@Param("courtId") Long courtId);

    @Query("SELECT DISTINCT s.courtId FROM Slot s")
    List<Long> findDistinctCourtIds();
}
