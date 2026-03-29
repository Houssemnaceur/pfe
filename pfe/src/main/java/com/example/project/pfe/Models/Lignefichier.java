package com.example.project.pfe.Models;
import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "ligne_fichier")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Lignefichier {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private int numeroLigne;

    @Column(columnDefinition = "TEXT")
    private String donnees;

    // "VALIDE", "ERREUR"
    @Column(nullable = false)
    private String statutValidation;

    @Column(columnDefinition = "TEXT")
    private String messageErreur;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "fichier_import_id", nullable = false)
    private FichierImport fichierImport;
}
