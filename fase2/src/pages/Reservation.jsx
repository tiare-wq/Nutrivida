import React from "react";
import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Alert, Button, Form } from "react-bootstrap";
import { api } from "../api";
import { useApp } from "../context";
import { money } from "../cart";
import { localDate } from "../validation";
export default function Reservation() {
  const { catalog, user } = useApp();
  const [params] = useSearchParams();
  const [serviceId, setServiceId] = useState(params.get("servicio") || ""),
    [professionalId, setProfessionalId] = useState(""),
    [date, setDate] = useState(""),
    [time, setTime] = useState(""),
    [slots, setSlots] = useState([]),
    [error, setError] = useState(""),
    [slotsBusy, setSlotsBusy] = useState(false),
    [busy, setBusy] = useState(false),
    [reservation, setReservation] = useState(null),
    [revision, setRevision] = useState(0);
  const service = catalog.services.find((s) => s.id === Number(serviceId));
  const pros = catalog.professionals.filter((p) =>
    service?.specialties.includes(p.specialty),
  );
  useEffect(() => {
    setTime("");
    setSlots([]);
    if (revision===0) setError("");
    if (!serviceId || !professionalId || !date) return;
    const controller = new AbortController();
    setSlotsBusy(true);
    api(
      `/slots?service=${serviceId}&professional=${professionalId}&date=${date}`,
      { signal: controller.signal },
    )
      .then((r) => setSlots(r.slots))
      .catch((e) => {
        if (e.name !== "AbortError") setError(e.message);
      })
      .finally(() => {
        if (!controller.signal.aborted) setSlotsBusy(false);
      });
    return () => controller.abort();
  }, [serviceId, professionalId, date, revision]);
  async function submit(e) {
    e.preventDefault();
    setError("");
    if (!time) {
      setError("Selecciona un horario disponible.");
      return;
    }
    setBusy(true);
    try {
      const r = await api("/reservations", {
        method: "POST",
        body: {
          serviceId: Number(serviceId),
          professionalId: Number(professionalId),
          date,
          time,
        },
      });
      setReservation(r.reservation);
    } catch (e) {
      setError(e.message);
      setRevision((v) => v + 1);
    } finally {
      setBusy(false);
    }
  }
  if (reservation)
    return (
      <section className="page narrow confirmation">
        <h1>Tu atención está reservada</h1>
        <p>
          Guarda tu código: <strong>{reservation.id}</strong>
        </p>
        <dl>
          <dt>Servicio</dt>
          <dd>{reservation.service}</dd>
          <dt>Profesional</dt>
          <dd>{reservation.professional}</dd>
          <dt>Fecha y hora</dt>
          <dd>
            {reservation.date} a las {reservation.time} · hora de Chile
          </dd>
          <dt>Valor</dt>
          <dd>{money(reservation.price)}</dd>
        </dl>
        <p>
          La reserva está guardada en tu cuenta. No se ha enviado un correo ni
          realizado un cobro.
        </p>
        <Link className="btn btn-success" to="/cuenta">
          Ver mis reservas
        </Link>
      </section>
    );
  return (
    <section className="page reserve-layout">
      <div className="reserve-intro">
        <h1>Haz espacio para tu bienestar.</h1>
        <p>
          Elige tu atención, profesional y horario. Tus datos de contacto se
          toman de tu cuenta.
        </p>
        <img src="/img/nutricionistaPaciente.png" alt="" />
        <p className="small-note">
          Agenda del proyecto: lunes a viernes, de 09:00 a 13:00 y de 15:00 a
          18:00. Horarios en America/Santiago.
        </p>
      </div>
      <div className="form-surface">
        <h2>Reserva tu atención</h2>
        {error && (
          <Alert variant="danger" role="alert">
            {error}
          </Alert>
        )}
        <Form onSubmit={submit}>
          <Form.Group className="mb-3" controlId="service">
            <Form.Label>Servicio</Form.Label>
            <Form.Select
              required
              value={serviceId}
              onChange={(e) => {
                setServiceId(e.target.value);
                setProfessionalId("");
              }}
            >
              <option value="">Selecciona un servicio</option>
              {catalog.services.map((s) => (
                <option value={s.id} key={s.id}>
                  {s.name} · {money(s.price)}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="professional">
            <Form.Label>Profesional</Form.Label>
            <Form.Select
              required
              disabled={!service}
              value={professionalId}
              onChange={(e) => setProfessionalId(e.target.value)}
            >
              <option value="">Selecciona un profesional</option>
              {pros.map((p) => (
                <option value={p.id} key={p.id}>
                  {p.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
          <Form.Group className="mb-3" controlId="date">
            <Form.Label>Fecha</Form.Label>
            <Form.Control
              type="date"
              required
              min={localDate()}
              max={localDate(new Date(Date.now() + 179 * 86400000))}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </Form.Group>
          <fieldset className="mb-4">
            <legend>Horario disponible</legend>
            {slotsBusy ? (
              <p role="status">Consultando horarios…</p>
            ) : !date || !professionalId ? (
              <p>Selecciona un profesional y una fecha.</p>
            ) : slots.length === 0 ? (
              <p>No hay horarios disponibles para esta selección.</p>
            ) : (
              <div className="slot-grid">
                {slots.map((slot) => (
                  <label
                    key={slot}
                    className={time === slot ? "slot selected" : "slot"}
                  >
                    <input
                      type="radio"
                      name="time"
                      value={slot}
                      checked={time === slot}
                      onChange={() => setTime(slot)}
                    />
                    {slot}
                  </label>
                ))}
              </div>
            )}
          </fieldset>
          {service && (
            <p className="booking-total">
              {service.duration} min · {service.modality}{" "}
              <strong>{money(service.price)}</strong>
            </p>
          )}
          {user ? (
            <Button
              type="submit"
              variant="success"
              className="w-100"
              disabled={busy || slotsBusy || !time}
            >
              {busy ? "Reservando…" : "Confirmar reserva"}
            </Button>
          ) : (
            <Link
              className="btn btn-success w-100"
              to={`/login?next=${encodeURIComponent("/reserva?servicio=" + serviceId)}`}
            >
              Inicia sesión para reservar
            </Link>
          )}
        </Form>
      </div>
    </section>
  );
}
