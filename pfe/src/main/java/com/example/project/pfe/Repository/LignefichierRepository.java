package com.example.project.pfe.Repository;

import com.example.project.pfe.Models.Lignefichier;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LignefichierRepository extends JpaRepository<Lignefichier, Long> {
    List<Lignefichier> findByFichierImportId(Long fichierId);
    List<Lignefichier> findByFichierImportIdAndStatutValidation(Long fichierId, String statut);
    long countByFichierImportIdAndStatutValidation(Long fichierId, String statut);
}