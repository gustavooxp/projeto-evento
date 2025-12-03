"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function LoginPage() {
    const [form, setForm] = useState({
        email: "",
        senha: "",
    });
    
    const [mensagem, setMensagem] = useState("");
    const API_URL = "http://localhost:8080/api/v1/auth/login";

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

            const { token, id, nome } = response.data;

            // 🔥 SALVAR TUDO NO LOCALSTORAGE
            localStorage.setItem("token", token);
            localStorage.setItem("id", id);
            localStorage.setItem("nome", nome);

            window.location.href = "/"; // redireciona para a home

        } catch (error) {
            if (error.response?.status === 401) {
                setMensagem("Email ou senha inválidos.");
            } else {
                setMensagem("Erro ao realizar login.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">

            <div className="bg-white w-full max-w-md p-10 rounded-2xl shadow-2xl border border-blue-200">

                <h1 className="text-4xl font-bold text-center text-blue-700 mb-6">
                    Login
                </h1>

                <div className="w-20 h-1 bg-blue-500 mx-auto rounded mb-8"></div>

                {mensagem && (
                    <div className="mb-4 text-center text-red-600 font-semibold bg-red-100 p-3 rounded-lg border border-red-300">
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="flex flex-col gap-6">

                    <div>
                        <label className="font-semibold text-blue-700">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Digite seu email"
                            className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                                       placeholder-blue-400 font-medium focus:outline-none 
                                       focus:border-blue-600 text-gray-900 shadow-sm"
                        />
                    </div>

                    <div>
                        <label className="font-semibold text-blue-700">Senha</label>
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            placeholder="Digite sua senha"
                            className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg
                                       placeholder-blue-400 font-medium focus:outline-none 
                                       focus:border-blue-600 text-gray-900 shadow-sm"
                        />

                        <p className="mt-2 text-sm text-blue-600 font-medium text-center">
                            Não tem cadastro?{" "}
                            <Link
                                href="/usuario/create"
                                className="underline hover:text-blue-800"
                            >
                                Clique para se inscrever
                            </Link>
                        </p>
                    </div>

                    <button
                        type="submit"
                        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold 
                                   py-3 rounded-lg shadow-lg hover:shadow-xl transition-all"
                    >
                        Entrar
                    </button>
                </form>
            </div>
        </div>
    );
}
