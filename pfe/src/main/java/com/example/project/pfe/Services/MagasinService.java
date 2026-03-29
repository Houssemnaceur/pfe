package com.example.project.pfe.Services;

import com.example.project.pfe.Models.Magasin;
import com.example.project.pfe.Repository.MagasinRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class MagasinService {

    private final MagasinRepository magasinRepository;

    public List<Magasin> findAll() {
        return magasinRepository.findAll();
    }

    public Magasin findById(Long id) {
        return magasinRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Magasin introuvable : " + id));
    }

    public Magasin create(Magasin magasin) {
        if (magasinRepository.existsByCode(magasin.getCode())) {
            throw new RuntimeException("Code magasin déjà existant : " + magasin.getCode());
        }
        return magasinRepository.save(magasin);
    }

    public Magasin update(Long id, Magasin updated) {
        Magasin existing = findById(id);
        existing.setCode(updated.getCode());
        existing.setNom(updated.getNom());
        existing.setType(updated.getType());
        return magasinRepository.save(existing);
    }

    public void delete(Long id) {
        magasinRepository.deleteById(id);
    }

    public List<Magasin> findByType(String type) {
        return magasinRepository.findByType(type);
    }

    public List<Magasin> findByRoleId(Long roleId) {
        return magasinRepository.findByRoleId(roleId);
    }
}