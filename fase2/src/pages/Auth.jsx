import React from "react";
import { useState } from "react";
import { useForm } from "react-hook-form";
import { Link, useNavigate, useSearchParams } from "react-router-dom";
import { Button, Form, Alert } from "react-bootstrap";
import { api } from "../api";
import { useApp } from "../context";
import { runValid, emailValid } from "../validation";
export default function Auth({ registerMode = false }) {
  const { setUser, user } = useApp();
  const navigate = useNavigate();
  const [params] = useSearchParams();
  const [error, setError] = useState("");
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm();
  const next = params.get("next");
  const target =
    next?.startsWith("/") && !next.startsWith("//") ? next : "/cuenta";
  async function submit(data) {
    setError("");
    try {
      const result = await api(registerMode ? "/register" : "/login", {
        method: "POST",
        body: data,
      });
      setUser(result.user);
      navigate(target, { replace: true });
    } catch (e) {
      setError(e.message);
    }
  }
  if (user)
    return (
      <section className="page narrow">
        <h1>Ya iniciaste sesión</h1>
        <Link to="/cuenta">Ir a mi cuenta</Link>
      </section>
    );
  return (
    <section className="page auth-layout">
      <div className="auth-intro">
        <h1>
          {registerMode
            ? "Tu bienestar empieza contigo."
            : "Qué bueno verte de nuevo."}
        </h1>
        <p>
          {registerMode
            ? "Crea tu cuenta para reservar una atención y consultar tus pedidos."
            : "Ingresa a tu cuenta para continuar con tu proceso y revisar tus atenciones."}
        </p>
        <img src="/img/perfilUsuario.png" alt="" />
      </div>
      <div className="form-surface">
        <h2>{registerMode ? "Crear cuenta" : "Iniciar sesión"}</h2>
        {error && (
          <Alert variant="danger" role="alert">
            {error}
          </Alert>
        )}
        <Form noValidate onSubmit={handleSubmit(submit)}>
          {registerMode && (
            <>
              <Form.Group className="mb-3" controlId="name">
                <Form.Label>Nombre completo</Form.Label>
                <Form.Control
                  autoComplete="name"
                  {...register("name", {
                    required: "Escribe tu nombre.",
                    minLength: {
                      value: 2,
                      message: "Escribe al menos dos caracteres.",
                    },
                    maxLength: 100,
                  })}
                  isInvalid={!!errors.name}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.name?.message}
                </Form.Control.Feedback>
              </Form.Group>
              <Form.Group className="mb-3" controlId="run">
                <Form.Label>RUN</Form.Label>
                <Form.Control
                  placeholder="Sin puntos y con guion"
                  {...register("run", {
                    validate: (v) =>
                      runValid(v) ||
                      "Introduce un RUN válido, sin puntos y con guion.",
                  })}
                  isInvalid={!!errors.run}
                />
                <Form.Control.Feedback type="invalid">
                  {errors.run?.message}
                </Form.Control.Feedback>
              </Form.Group>
            </>
          )}
          <Form.Group className="mb-3" controlId="email">
            <Form.Label>Correo electrónico</Form.Label>
            <Form.Control
              type="email"
              autoComplete="email"
              {...register("email", {
                validate: (v) => emailValid(v) || "Introduce un correo válido.",
                maxLength: 160,
              })}
              isInvalid={!!errors.email}
            />
            <Form.Control.Feedback type="invalid">
              {errors.email?.message}
            </Form.Control.Feedback>
          </Form.Group>
          <Form.Group className="mb-4" controlId="password">
            <Form.Label>Contraseña</Form.Label>
            <Form.Control
              type="password"
              autoComplete={registerMode ? "new-password" : "current-password"}
              {...register("password", {
                required: "Escribe tu contraseña.",
                minLength: { value: 8, message: "Usa al menos 8 caracteres." },
                maxLength: { value: 128, message: "Usa hasta 128 caracteres." },
              })}
              isInvalid={!!errors.password}
            />
            <Form.Control.Feedback type="invalid">
              {errors.password?.message}
            </Form.Control.Feedback>
            {registerMode && <Form.Text>Al menos 8 caracteres.</Form.Text>}
          </Form.Group>
          <Button
            type="submit"
            variant="success"
            disabled={isSubmitting}
            className="w-100"
          >
            {isSubmitting
              ? "Guardando…"
              : registerMode
                ? "Crear cuenta"
                : "Ingresar"}
          </Button>
        </Form>
        <p className="mt-4">
          {registerMode ? "¿Ya tienes cuenta?" : "¿Es tu primera visita?"}{" "}
          <Link
            to={`${registerMode ? "/login" : "/registro"}?next=${encodeURIComponent(target)}`}
          >
            {registerMode ? "Iniciar sesión" : "Crear cuenta"}
          </Link>
        </p>
      </div>
    </section>
  );
}
