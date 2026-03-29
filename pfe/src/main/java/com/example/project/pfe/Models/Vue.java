package com.example.project.pfe.Models;
import jakarta.persistence.*;
import lombok.*;
import java.util.List;

@Entity
@Table(name = "vue")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Vue {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String nom;

    // Route Angular ex: "/admin/utilisateurs", "/metier/gratuite"
    @Column(nullable = false, unique = true)
    private String url;

    @ManyToMany(mappedBy = "vues")
    private List<Profil> profils;
}
