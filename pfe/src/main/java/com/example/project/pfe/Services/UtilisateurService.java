package com.example.project.pfe.Services;

import com.example.project.pfe.Models.Utilisateur;
import com.example.project.pfe.Repository.UtilisateurRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class UtilisateurService {

    private final UtilisateurRepository utilisateurRepository;

    public List<Utilisateur> findAll() {
        return utilisateurRepository.findAll();
    }

    public Utilisateur findById(Long id) {
        return utilisateurRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + id));
    }

    public Utilisateur create(Utilisateur utilisateur) {
        if (utilisateurRepository.existsByEmail(utilisateur.getEmail())) {
            throw new RuntimeException("Email déjà utilisé : " + utilisateur.getEmail());
        }
        return utilisateurRepository.save(utilisateur);
    }

    public Utilisateur update(Long id, Utilisateur updated) {
        Utilisateur existing = findById(id);
        existing.setNom(updated.getNom());
        existing.setPrenom(updated.getPrenom());
        existing.setEmail(updated.getEmail());
        existing.setProfil(updated.getProfil());
        existing.setRole(updated.getRole());
        existing.setActif(updated.isActif());
        return utilisateurRepository.save(existing);
    }

    public void delete(Long id) {
        Utilisateur u = findById(id);
        u.setActif(false); // Soft delete
        utilisateurRepository.save(u);
    }

    public Utilisateur findByEmail(String email) {
        return utilisateurRepository.findByEmail(email)
                .orElseThrow(() -> new RuntimeException("Utilisateur introuvable : " + email));
    }
}