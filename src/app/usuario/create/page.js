"use client";

import { useState } from "react";
import axios from "axios";

export default function CadastroUsuarioPage() {
    const [form, setForm] = useState({
        email: "",
        senha: "",
        nome: "",
        cpf: "",
        telefone: "",
        tipo: "",
        dataNascimento: "",
    });

    const [mensagem, setMensagem] = useState("");

    const API_URL = "http://localhost:8080/api/v1/usuario";

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

            setMensagem("Usuário cadastrado com sucesso!");
            setForm({
                email: "",
                senha: "",
                nome: "",
                cpf: "",
                telefone: "",
                tipo: "",
                dataNascimento: "",
            });

        } catch (error) {
            if (error.response?.data?.errors) {
                const erros = error.response.data.errors;
                const campo = Object.keys(erros)[0];
                const msg = erros[campo];
                setMensagem(msg);
            } else {
                setMensagem("Erro ao cadastrar usuário.");
            }
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="bg-white w-full max-w-2xl p-10 rounded-2xl shadow-xl border border-blue-200">

                <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 drop-shadow-sm">
                    Cadastro de Usuário
                </h1>

                {mensagem && (
                    <div className="mb-4 text-center text-red-600 font-semibold">
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* EMAIL */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="Digite seu email"
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-blue-500 font-medium focus:outline-none focus:ring focus:ring-blue-300"
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
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-blue-500 font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* NOME */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Nome</label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            placeholder="Digite seu nome completo"
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-blue-500 font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* CPF */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">CPF</label>
                        <input
                            type="text"
                            name="cpf"
                            value={form.cpf}
                            onChange={handleChange}
                            placeholder="Digite seu CPF"
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-blue-500 font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* TELEFONE */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Telefone</label>
                        <input
                            type="text"
                            name="telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            placeholder="Digite seu telefone"
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-blue-500 font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* TIPO DE USUÁRIO */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Tipo de Usuário</label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        >
                            <option value="">Selecione...</option>
                            <option value="CLIENTE">Cliente</option>
                            <option value="ORGANIZADOR">Organizador</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                        </select>
                    </div>

                    {/* DATA DE NASCIMENTO */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Data de Nascimento</label>
                        <input
                            type="date"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={handleChange}
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* BOTÃO */}
                    <div className="md:col-span-2">
                        <button
                            type="submit"
                            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                        >
                            Cadastrar Usuário
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}
