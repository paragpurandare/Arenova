package rental_service.rental.entities;

import java.math.BigDecimal;

import jakarta.persistence.AttributeOverride;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import rental_service.common.entities.BaseEntity;

@Entity
@Table(name = "rental_order_items")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@AttributeOverride(
    name = "id",
    column = @Column(name = "rental_order_item_id")
)
public class RentalOrderItem extends BaseEntity {

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "rental_order_id", nullable = false)
    private RentalOrder rentalOrder;

    @Column(name = "equipment_id", nullable = false)
    private Long equipmentId;

    @Column(name = "equipment_name")
    private String equipmentName;

    @Column(name = "sport_type")
    private String sportType;

    @Column(nullable = false)
    private Integer quantity;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal pricePerUnit;

    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal subtotal;
}
