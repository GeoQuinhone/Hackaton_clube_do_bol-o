package com.bolao.exception;

public class SelecaoNotFoundException extends RuntimeException {
    public SelecaoNotFoundException(Long id) {
        super("Seleção não encontrada com id: " + id);
    }
}
