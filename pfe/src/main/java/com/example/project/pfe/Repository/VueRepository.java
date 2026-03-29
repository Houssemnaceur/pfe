package com.example.project.pfe.Repository;



import com.example.project.pfe.Models.Vue;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VueRepository extends JpaRepository<Vue, Long> {
    Optional<Vue> findByUrl(String url);
    boolean existsByUrl(String url);

    // Toutes les vues associées à un profil donné
    @Query("SELECT v FROM Vue v JOIN v.profils p WHERE p.idProfil = :profilId")
    List<Vue> findByProfilId(Long profilId);
}