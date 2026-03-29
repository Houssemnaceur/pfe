package com.example.project.pfe.Models;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "profil")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Profil {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long idProfil;

    @Column(nullable = false, unique = true)
    private String nom;

    private String description;

    @ManyToMany(fetch = FetchType.LAZY)
    @JoinTable(
            name = "profil_vue",
            joinColumns = @JoinColumn(name = "profil_id"),
            inverseJoinColumns = @JoinColumn(name = "vue_id")
    )
    private List<Vue> vues;

    @OneToMany(mappedBy = "profil")
    private List<Utilisateur> utilisateurs;
}
