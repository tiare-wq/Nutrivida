package com.nutrivida.mscarrito.exception;

public class CarritoNoEncontradoException extends RuntimeException{
    public CarritoNoEncontradoException(String mensaje){
        super(mensaje);
    }
}