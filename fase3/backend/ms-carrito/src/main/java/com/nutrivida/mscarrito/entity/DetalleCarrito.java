package com.nutrivida.mscarrito.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data 
@AllArgsConstructor 
@NoArgsConstructor 

@Entity 
@Table(name = "detalle_carrito")
public class DetalleCarrito {
    
    @Id 
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private long idDetalle;

    @Column(nullable = false)
    private String idPlan;

    @Column(nullable = false)
    private int cantidad;

    @ManyToOne
    @JoinColumn(name = "id_carrito", nullable = false)
    private Carrito carrito;
}
