import React, { useState } from "react";
import { Alert, Button, Form } from "react-bootstrap";
import { useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import { useApp } from "../context";
import { api } from "../api";
import { runValid } from "../validation";

export default function Profile() {
  const { user, setUser, setNotice } = useApp();
  const navigate = useNavigate();
  const [error, setError] = useState("");
  const [message, setMessage] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const profile = useForm({ defaultValues: { name: user.name, email: user.email, run: user.run, currentPassword: "" } });
  const password = useForm({ defaultValues: { currentPassword: "", password: "", confirmation: "" } });
  async function save(values) {
    setError(""); setMessage("");
    try {
      const result = await api("/me", { method: "PATCH", body: values });
      setUser(result.user);
      profile.reset({ ...result.user, currentPassword: "" });
      setMessage("Tus datos se guardaron correctamente.");
    } catch (e) { setError(e.message); }
  }
  async function changePassword(values) {
    setPasswordError("");
    try {
      await api("/me/password", { method: "POST", body: { currentPassword: values.currentPassword, password: values.password } });
      password.reset();
      setUser(null);
      setNotice("Contraseña actualizada. Inicia sesión con tu nueva contraseña.");
      navigate("/login?next=/cuenta", { replace: true });
    } catch (e) { setPasswordError(e.message); }
  }
  const emailChanged = profile.watch("email").trim().toLowerCase() !== user.email;
  function field(form, name, label, rules, options = {}) {
    const issue = form.formState.errors[name];
    const id = `${form === profile ? "profile" : "password"}-${name}`;
    return <Form.Group className="mb-3" controlId={id}>
      <Form.Label>{label}</Form.Label>
      <Form.Control {...options} {...form.register(name, rules)} isInvalid={!!issue} aria-describedby={issue ? `${id}-error` : undefined} />
      <Form.Control.Feedback type="invalid" id={`${id}-error`}>{issue?.message}</Form.Control.Feedback>
    </Form.Group>;
  }
  return <section className="profile-section" aria-labelledby="profile-title">
    <div className="section-heading"><h2 id="profile-title">Mi perfil</h2><span className="small-note">{user.role === "admin" ? "Administrador" : "Cliente"}</span></div>
    <div className="profile-columns">
      <Form noValidate onSubmit={profile.handleSubmit(save)}>
        <h3>Datos personales</h3>
        {error && <Alert variant="danger">{error}</Alert>}
        {message && <Alert variant="success" role="status">{message}</Alert>}
        {field(profile, "name", "Nombre completo", { required: "Ingresa tu nombre", validate: v => v.trim().length >= 2 || "Ingresa al menos dos caracteres", maxLength: { value: 100, message: "Máximo 100 caracteres" } }, { autoComplete: "name" })}
        {field(profile, "email", "Correo electrónico", { required: "Ingresa tu correo", pattern: { value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/, message: "Introduce un correo válido" } }, { type: "email", autoComplete: "email" })}
        {field(profile, "run", "RUN", { required: "Ingresa tu RUN", validate: v => runValid(v) || "Introduce un RUN válido, sin puntos y con guion" })}
        {emailChanged && <><p className="small-note">Confirma tu contraseña actual para cambiar el correo de acceso.</p>{field(profile, "currentPassword", "Contraseña actual para cambiar correo", { required: "Ingresa tu contraseña actual" }, { type: "password", autoComplete: "current-password", maxLength: 128 })}</>}
        <Button type="submit" variant="success" disabled={profile.formState.isSubmitting}>{profile.formState.isSubmitting ? "Guardando…" : "Guardar datos"}</Button>
      </Form>
      <Form noValidate onSubmit={password.handleSubmit(changePassword)}>
        <h3>Cambiar contraseña</h3>
        <p className="small-note">Al cambiarla se cerrarán tus sesiones. Tus pedidos, reservas y carrito se conservan.</p>
        {passwordError && <Alert variant="danger">{passwordError}</Alert>}
        {field(password, "currentPassword", "Contraseña actual", { required: "Ingresa tu contraseña actual" }, { type: "password", autoComplete: "current-password", maxLength: 128 })}
        {field(password, "password", "Nueva contraseña", { required: "Ingresa una nueva contraseña", minLength: { value: 8, message: "Usa al menos ocho caracteres" }, maxLength: { value: 128, message: "Máximo 128 caracteres" } }, { type: "password", autoComplete: "new-password" })}
        {field(password, "confirmation", "Repetir nueva contraseña", { required: "Repite la nueva contraseña", validate: v => v === password.getValues("password") || "Las contraseñas no coinciden" }, { type: "password", autoComplete: "new-password", maxLength: 128 })}
        <Button type="submit" variant="outline-success" disabled={password.formState.isSubmitting}>{password.formState.isSubmitting ? "Actualizando…" : "Actualizar contraseña"}</Button>
      </Form>
    </div>
  </section>;
}
