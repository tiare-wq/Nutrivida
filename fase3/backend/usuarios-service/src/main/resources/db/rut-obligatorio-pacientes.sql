-- El RUT es obligatorio solo para pacientes. Los profesionales y administradores pueden no tener RUT.
-- Ejecutar después de actualizar-perfiles.sql.
ALTER TABLE IF EXISTS usuarios
    ADD CONSTRAINT usuarios_rut_paciente_obligatorio
    CHECK (rol <> 'PACIENTE' OR rut IS NOT NULL);
