package com.example.project.pfe.Controllers;


import com.example.project.pfe.Models.Utilisateur;
import com.example.project.pfe.Services.UtilisateurService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/utilisateurs")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class UtilisateurController {

    private final UtilisateurService utilisateurService;

    @GetMapping
    public ResponseEntity<List<Utilisateur>> getAll() {
        return ResponseEntity.ok(utilisateurService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Utilisateur> getById(@PathVariable Long id) {
        return ResponseEntity.ok(utilisateurService.findById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Utilisateur> create(@RequestBody Utilisateur utilisateur) {
        return ResponseEntity.ok(utilisateurService.create(utilisateur));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Utilisateur> update(@PathVariable Long id,
                                              @RequestBody Utilisateur utilisateur) {
        return ResponseEntity.ok(utilisateurService.update(id, utilisateur));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        utilisateurService.delete(id);
        return ResponseEntity.noContent().build();
    }
}