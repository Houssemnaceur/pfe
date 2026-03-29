package com.example.project.pfe.Controllers;


import com.example.project.pfe.Models.Profil;
import com.example.project.pfe.Services.ProfilService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/profils")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class ProfilController {

    private final ProfilService profilService;

    @GetMapping
    public ResponseEntity<List<Profil>> getAll() {
        return ResponseEntity.ok(profilService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Profil> getById(@PathVariable Long id) {
        return ResponseEntity.ok(profilService.findById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Profil> create(@RequestBody Profil profil) {
        return ResponseEntity.ok(profilService.create(profil));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Profil> update(@PathVariable Long id, @RequestBody Profil profil) {
        return ResponseEntity.ok(profilService.update(id, profil));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        profilService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // PUT /api/profils/{id}/vues  body: [1, 2, 3]
    @PutMapping("/{id}/vues")
    public ResponseEntity<Profil> associerVues(@PathVariable Long id,
                                               @RequestBody List<Long> vueIds) {
        return ResponseEntity.ok(profilService.associerVues(id, vueIds));
    }
}