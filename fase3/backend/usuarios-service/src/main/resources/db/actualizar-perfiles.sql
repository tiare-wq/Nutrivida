-- Permite cuentas profesionales sin inventar RUT, nacimiento o teléfono.
-- Los perfiles de paciente siguen exigiendo estos datos en los DTO y servicios.
ALTER TABLE IF EXISTS usuarios ALTER COLUMN rut DROP NOT NULL;
ALTER TABLE IF EXISTS usuarios ALTER COLUMN fecha_nac DROP NOT NULL;
ALTER TABLE IF EXISTS usuarios ALTER COLUMN telefono DROP NOT NULL;
