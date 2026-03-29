package com.example.project.pfe.Controllers;

import com.example.project.pfe.Models.FichierImport;
import com.example.project.pfe.Services.FichierImportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/fichiers")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class FichierImportController {

    private final FichierImportService fichierImportService;

    @GetMapping
    public ResponseEntity<List<FichierImport>> getAll() {
        return ResponseEntity.ok(fichierImportService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<FichierImport> getById(@PathVariable Long id) {
        return ResponseEntity.ok(fichierImportService.findById(id));
    }

    @GetMapping("/utilisateur/{utilisateurId}")
    public ResponseEntity<List<FichierImport>> getByUtilisateur(@PathVariable Long utilisateurId) {
        return ResponseEntity.ok(fichierImportService.findByUtilisateur(utilisateurId));
    }

    // POST /api/fichiers/importer?utilisateurId=1
    @PostMapping("/importer")
    public ResponseEntity<FichierImport> importer(
            @RequestParam("file") MultipartFile file,
            @RequestParam("utilisateurId") Long utilisateurId) throws IOException {
        return ResponseEntity.ok(fichierImportService.importerFichier(file, utilisateurId));
    }
}