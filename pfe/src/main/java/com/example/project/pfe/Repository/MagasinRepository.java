package com.example.project.pfe.Repository;

import com.example.project.pfe.Models.Magasin;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface MagasinRepository extends JpaRepository<Magasin, Long> {
    Optional<Magasin> findByCode(String code);
    boolean existsByCode(String code);
    List<Magasin> findByType(String type);

    // Magasins accessibles par un rôle donné
    @Query("SELECT m FROM Magasin m JOIN m.roles r WHERE r.idRole = :roleId")
    List<Magasin> findByRoleId(Long roleId);
}
