package com.example.project.pfe.Models;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "role")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Role {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idRole;

    @Column(nullable = false, unique = true)
    private String nom;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "role_magasin",
            joinColumns = @JoinColumn(name = "role_id"),
            inverseJoinColumns = @JoinColumn(name = "magasin_id")
    )
    private List<Magasin> magasins;

    @OneToMany(mappedBy = "role")
    private List<Utilisateur> utilisateurs;
}


