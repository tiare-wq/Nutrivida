package cl.nutrivida.usuarios.repository;

import cl.nutrivida.usuarios.entity.RefreshToken;
import jakarta.persistence.LockModeType;
import java.util.Optional;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

public interface RefreshTokens extends JpaRepository<RefreshToken, String> {
    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("select t from RefreshToken t where t.hash=:hash")
    Optional<RefreshToken> locked(@Param("hash") String hash);

    void deleteByUsuarioId(Long id);
}
