package com.example.project.pfe.Models;


import jakarta.persistence.*;
import lombok.*;
import java.time.LocalDate;
import java.util.List;

@Entity
@Table(name = "fichier_import")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class FichierImport {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String nomFichier;

    @Column(nullable = false)
    private LocalDate dateImport;

    // "EN_ATTENTE", "EN_COURS", "SUCCES", "ERREUR"
    @Column(nullable = false)
    private String statut;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "utilisateur_id", nullable = false)
    private Utilisateur utilisateur;

    @OneToMany(mappedBy = "fichierImport", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<Lignefichier> lignes;
}