package com.example.project.pfe.Services;

import com.example.project.pfe.Models.FichierImport;
import com.example.project.pfe.Models.Lignefichier;
import com.example.project.pfe.Models.Utilisateur;
import com.example.project.pfe.Repository.FichierImportRepository;
import com.example.project.pfe.Repository.LignefichierRepository;
import com.example.project.pfe.Repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.apache.poi.ss.usermodel.*;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class FichierImportService {

    private final FichierImportRepository fichierImportRepository;
    private final LignefichierRepository ligneFichierRepository;
    private final UtilisateurRepository utilisateurRepository;

    public List<FichierImport> findAll() {
        return fichierImportRepository.findAll();
    }

    public FichierImport findById(Long id) {
        return fichierImportRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Fichier introuvable : " + id));
    }

    public List<FichierImport> findByUtilisateur(Long utilisateurId) {
        return fichierImportRepository.findByUtilisateurId(utilisateurId);
    }

    // Import du fichier Excel + exécution des contrôles métier
    public FichierImport importerFichier(MultipartFile file, Long utilisateurId) throws IOException {

        Utilisateur utilisateur = utilisateurRepository.findById(utilisateurId)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + utilisateurId));

        // Créer l'entrée FichierImport
        FichierImport fichier = FichierImport.builder()
                .nomFichier(file.getOriginalFilename())
                .dateImport(LocalDate.now())
                .statut("EN_COURS")
                .utilisateur(utilisateur)
                .build();
        fichier = fichierImportRepository.save(fichier);

        // Lire et contrôler chaque ligne Excel
        List<Lignefichier> lignes = lireEtControler(file, fichier);
        ligneFichierRepository.saveAll(lignes);

        // Mettre à jour le statut global
        boolean hasErrors = lignes.stream()
                .anyMatch(l -> "ERREUR".equals(l.getStatutValidation()));
        fichier.setStatut(hasErrors ? "ERREUR" : "SUCCES");
        fichier.setLignes(lignes);

        return fichierImportRepository.save(fichier);
    }

    private List<Lignefichier> lireEtControler(MultipartFile file, FichierImport fichier)
            throws IOException {

        List<Lignefichier> lignes = new ArrayList<>();

        try (Workbook workbook = new XSSFWorkbook(file.getInputStream())) {
            Sheet sheet = workbook.getSheetAt(0);
            int numLigne = 0;

            for (Row row : sheet) {
                numLigne++;
                if (numLigne == 1) continue; // Ignorer l'en-tête

                String donnees = extraireContenuLigne(row);
                String erreur = controlerLigne(row, numLigne);

                lignes.add(Lignefichier.builder()
                        .numeroLigne(numLigne)
                        .donnees(donnees)
                        .statutValidation(erreur == null ? "VALIDE" : "ERREUR")
                        .messageErreur(erreur)
                        .fichierImport(fichier)
                        .build());
            }
        }
        return lignes;
    }

    // Extraire les cellules d'une ligne en chaîne lisible
    private String extraireContenuLigne(Row row) {
        StringBuilder sb = new StringBuilder();
        for (Cell cell : row) {
            sb.append(celluleEnTexte(cell)).append(" | ");
        }
        return sb.toString();
    }

    // Règles de contrôle métier — à compléter selon les règles Cobol
    private String controlerLigne(Row row, int numLigne) {
        List<String> erreurs = new ArrayList<>();

        // Exemple règle 1 : colonne 0 (code magasin) ne doit pas être vide
        Cell codeMagasin = row.getCell(0);
        if (codeMagasin == null || celluleEnTexte(codeMagasin).isBlank()) {
            erreurs.add("Ligne " + numLigne + " : code magasin obligatoire");
        }

        // Exemple règle 2 : colonne 1 (montant) doit être numérique
        Cell montant = row.getCell(1);
        if (montant != null && montant.getCellType() != CellType.NUMERIC) {
            erreurs.add("Ligne " + numLigne + " : montant doit être numérique");
        }

        return erreurs.isEmpty() ? null : String.join(", ", erreurs);
    }

    private String celluleEnTexte(Cell cell) {
        if (cell == null) return "";
        if (cell.getCellType() == CellType.STRING) {
            return cell.getStringCellValue();
        } else if (cell.getCellType() == CellType.NUMERIC) {
            return String.valueOf(cell.getNumericCellValue());
        } else if (cell.getCellType() == CellType.BOOLEAN) {
            return String.valueOf(cell.getBooleanCellValue());
        } else {
            return "";
        }
    }
}
