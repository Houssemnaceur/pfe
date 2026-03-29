package com.example.project.pfe.Repository;

import com.example.project.pfe.Models.FichierImport;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FichierImportRepository extends JpaRepository<FichierImport, Long> {
    List<FichierImport> findByUtilisateurId(Long utilisateurId);
    List<FichierImport> findByStatut(String statut);
}
