package com.example.project.pfe.Models;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "magasin")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Magasin {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String code;

    @Column(nullable = false)
    private String nom;

    // ex: "MAGASIN", "ENTREPOT"
    @Column(nullable = false)
    private String type;

    @ManyToMany(mappedBy = "magasins")
    private List<Role> roles;
}