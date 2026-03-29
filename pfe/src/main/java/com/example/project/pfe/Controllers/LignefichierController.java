package com.example.project.pfe.Controllers;

import com.example.project.pfe.Models.Lignefichier;
import com.example.project.pfe.Services.LignefichierService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/lignes")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class LignefichierController {

    private final LignefichierService LignefichierService;

    // GET /api/lignes/fichier/{fichierId} — toutes les lignes
    @GetMapping("/fichier/{fichierId}")
    public ResponseEntity<List<Lignefichier>> getByFichier(@PathVariable Long fichierId) {
        return ResponseEntity.ok(LignefichierService.findByFichier(fichierId));
    }

    // GET /api/lignes/fichier/{fichierId}/erreurs — seulement les erreurs
    @GetMapping("/fichier/{fichierId}/erreurs")
    public ResponseEntity<List<Lignefichier>> getErreurs(@PathVariable Long fichierId) {
        return ResponseEntity.ok(LignefichierService.findErreurs(fichierId));
    }

    // GET /api/lignes/fichier/{fichierId}/valides — seulement les lignes valides
    @GetMapping("/fichier/{fichierId}/valides")
    public ResponseEntity<List<Lignefichier>> getValides(@PathVariable Long fichierId) {
        return ResponseEntity.ok(LignefichierService.findValides(fichierId));
    }

    // GET /api/lignes/fichier/{fichierId}/count-erreurs
    @GetMapping("/fichier/{fichierId}/count-erreurs")
    public ResponseEntity<Long> countErreurs(@PathVariable Long fichierId) {
        return ResponseEntity.ok(LignefichierService.compterErreurs(fichierId));
    }
}