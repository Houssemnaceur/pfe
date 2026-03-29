package com.example.project.pfe.Controllers;

import com.example.project.pfe.Models.Vue;
import com.example.project.pfe.Services.VueService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/vues")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class VueController {

    private final VueService vueService;

    @GetMapping
    public ResponseEntity<List<Vue>> getAll() {
        return ResponseEntity.ok(vueService.findAll());
    }

    @GetMapping("/{id}")
    public ResponseEntity<Vue> getById(@PathVariable Long id) {
        return ResponseEntity.ok(vueService.findById(id));
    }

    @PostMapping("/create")
    public ResponseEntity<Vue> create(@RequestBody Vue vue) {
        return ResponseEntity.ok(vueService.create(vue));
    }

    @PutMapping("/update/{id}")
    public ResponseEntity<Vue> update(@PathVariable Long id, @RequestBody Vue vue) {
        return ResponseEntity.ok(vueService.update(id, vue));
    }

    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        vueService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET /api/vues/profil/{profilId} — menu dynamique Angular
    @GetMapping("/profil/{profilId}")
    public ResponseEntity<List<Vue>> getByProfil(@PathVariable Long profilId) {
        return ResponseEntity.ok(vueService.findByProfilId(profilId));
    }
}