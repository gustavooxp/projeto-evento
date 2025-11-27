"use client";

import { useState } from "react";
import axios from "axios";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        senha: "",
    });

    const [mensagem, setMensagem] = useState("");

    const API_URL = "http://localhost:8080/api/v1/auth";

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");

        try {
            const response = await axios.post(API_URL, form);
            console.log(response.data);

            setMensagem("Login realizado com sucesso!");
            setForm({ email: "", senha: "" });
        } catch (error) {
            if (error.response?.data?.errors) {
                const erros = error.response.data.errors;
                const campo = Object.keys(erros)[0];
                const msg = erros[campo];
                setMensagem(msg);
            } else {
                setMensagem("Erro ao realizar login.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
            <div className="bg-white w-full max-w-md p-8 rounded-xl shadow-lg border border-gray-200">

                <h1 className="text-3xl font-semibold mb-8 text-center text-blue-600">
                    Login
                </h1>

                {mensagem && (
                    <div className="mb-4 text-center text-red-500 font-medium">
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">
                    {/* EMAIL */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Digite seu email"
                            className="w-full mt-1 p-3 border rounded-lg text-black bg-white placeholder-gray-600"
                        />
                    </div>

                    {/* SENHA */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Senha</label>
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            className="border border-blue-400 rounded-lg px-3 py-2 
              placeholder-blue-500 font-medium
              focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    <button
                        type="submit"
                        className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded-lg shadow-md transition"
                    >
                        Entrar
                    </button>
                </form>

            </div>
        </div>
    );
}
