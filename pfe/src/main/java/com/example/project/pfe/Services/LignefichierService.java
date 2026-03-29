package com.example.project.pfe.Services;

import com.example.project.pfe.Models.Lignefichier;
import com.example.project.pfe.Repository.LignefichierRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class LignefichierService {

    private final LignefichierRepository LignefichierRepository;

    // Toutes les lignes d'un fichier
    public List<Lignefichier> findByFichier(Long fichierId) {
        return LignefichierRepository.findByFichierImportId(fichierId);
    }

    // Seulement les lignes en erreur (affichage Angular)
    public List<Lignefichier> findErreurs(Long fichierId) {
        return LignefichierRepository
                .findByFichierImportIdAndStatutValidation(fichierId, "ERREUR");
    }

    // Seulement les lignes valides
    public List<Lignefichier> findValides(Long fichierId) {
        return LignefichierRepository
                .findByFichierImportIdAndStatutValidation(fichierId, "VALIDE");
    }

    // Nombre d'erreurs dans un fichier
    public long compterErreurs(Long fichierId) {
        return LignefichierRepository
                .countByFichierImportIdAndStatutValidation(fichierId, "ERREUR");
    }
}