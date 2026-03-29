package com.example.project.pfe.Repository;

import com.example.project.pfe.Models.Profil;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface ProfilRepository extends JpaRepository<Profil, Long> {
    Optional<Profil> findByNom(String nom);
    boolean existsByNom(String nom);
}
