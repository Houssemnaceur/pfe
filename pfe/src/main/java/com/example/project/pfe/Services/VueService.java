package com.example.project.pfe.Services;

import com.example.project.pfe.Models.Vue;
import com.example.project.pfe.Repository.VueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class VueService {

    private final VueRepository vueRepository;

    public List<Vue> findAll() {
        return vueRepository.findAll();
    }

    public Vue findById(Long id) {
        return vueRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Vue introuvable : " + id));
    }

    public Vue create(Vue vue) {
        if (vueRepository.existsByUrl(vue.getUrl())) {
            throw new RuntimeException("URL déjà utilisée : " + vue.getUrl());
        }
        return vueRepository.save(vue);
    }

    public Vue update(Long id, Vue updated) {
        Vue existing = findById(id);
        existing.setNom(updated.getNom());
        existing.setUrl(updated.getUrl());
        return vueRepository.save(existing);
    }

    public void delete(Long id) {
        vueRepository.deleteById(id);
    }

    // Récupérer les vues accessibles par un profil (utilisé pour le menu Angular)
    public List<Vue> findByProfilId(Long profilId) {
        return vueRepository.findByProfilId(profilId);
    }
}