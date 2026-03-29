package com.example.project.pfe.Controllers;

import com.example.project.pfe.Models.Magasin;
import com.example.project.pfe.Services.MagasinService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/magasins")
@RequiredArgsConstructor
@CrossOrigin(origins = "http://localhost:4200")
public class MagasinController {

    private final MagasinService magasinService;

    // GET ALL
    @GetMapping
    public ResponseEntity<List<Magasin>> getAll() {
        return ResponseEntity.ok(magasinService.findAll());
    }

    // GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<Magasin> getById(@PathVariable Long id) {
        return ResponseEntity.ok(magasinService.findById(id));
    }

    // ✅ CREATE
    @PostMapping("/create")
    public ResponseEntity<Magasin> create(@RequestBody Magasin magasin) {
        return ResponseEntity.ok(magasinService.create(magasin));
    }

    // ✅ UPDATE
    @PutMapping("/update/{id}")
    public ResponseEntity<Magasin> update(@PathVariable Long id, @RequestBody Magasin magasin) {
        return ResponseEntity.ok(magasinService.update(id, magasin));
    }

    // ✅ DELETE
    @DeleteMapping("/delete/{id}")
    public ResponseEntity<Void> delete(@PathVariable Long id) {
        magasinService.delete(id);
        return ResponseEntity.noContent().build();
    }

    // GET BY ROLE
    @GetMapping("/role/{roleId}")
    public ResponseEntity<List<Magasin>> getByRole(@PathVariable Long roleId) {
        return ResponseEntity.ok(magasinService.findByRoleId(roleId));
    }
}