package com.example.project.pfe.Services;

import com.example.project.pfe.Models.Magasin;
import com.example.project.pfe.Models.Role;
import com.example.project.pfe.Repository.MagasinRepository;
import com.example.project.pfe.Repository.RoleRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class RoleService {

    private final RoleRepository roleRepository;
    private final MagasinRepository magasinRepository;

    public List<Role> findAll() {
        return roleRepository.findAll();
    }

    public Role findById(Long id) {
        return roleRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Role introuvable : " + id));
    }

    public Role create(Role role) {
        if (roleRepository.existsByNom(role.getNom())) {
            throw new RuntimeException("Role déjà existant : " + role.getNom());
        }
        return roleRepository.save(role);
    }

    public Role update(Long id, Role updated) {
        Role existing = findById(id);
        existing.setNom(updated.getNom());
        return roleRepository.save(existing);
    }

    public void delete(Long id) {
        roleRepository.deleteById(id);
    }

    // Associer une liste de magasins à un rôle
    public Role associerMagasins(Long roleId, List<Long> magasinIds) {
        Role role = findById(roleId);
        List<Magasin> magasins = magasinRepository.findAllById(magasinIds);
        role.setMagasins(magasins);
        return roleRepository.save(role);
    }
}