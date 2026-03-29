package com.example.project.pfe.Services;


import com.example.project.pfe.Models.Profil;
import com.example.project.pfe.Models.Vue;
import com.example.project.pfe.Repository.ProfilRepository;
import com.example.project.pfe.Repository.VueRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ProfilService {

    private final ProfilRepository profilRepository;
    private final VueRepository vueRepository;

    public List<Profil> findAll() {
        return profilRepository.findAll();
    }

    public Profil findById(Long id) {
        return profilRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Profil introuvable : " + id));
    }

    public Profil create(Profil profil) {
        if (profilRepository.existsByNom(profil.getNom())) {
            throw new RuntimeException("Profil déjà existant : " + profil.getNom());
        }
        return profilRepository.save(profil);
    }

    public Profil update(Long id, Profil updated) {
        Profil existing = findById(id);
        existing.setNom(updated.getNom());
        existing.setDescription(updated.getDescription());
        return profilRepository.save(existing);
    }

    public void delete(Long id) {
        profilRepository.deleteById(id);
    }

    // Associer une liste de vues à un profil
    public Profil associerVues(Long profilId, List<Long> vueIds) {
        Profil profil = findById(profilId);
        List<Vue> vues = vueRepository.findAllById(vueIds);
        profil.setVues(vues);
        return profilRepository.save(profil);
    }
}