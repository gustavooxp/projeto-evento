"use client";

import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function CadastroUsuarioPage() {
    const router = useRouter();

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
    const [success, setSuccess] = useState(false);

    const API_URL = "http://localhost:8080/api/v1/usuario";

    const handleChange = (e) => {
        let { name, value } = e.target;

        // Máscara para CPF
        if (name === "cpf") {
            value = value
                .replace(/\D/g, "")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d)/, "$1.$2")
                .replace(/(\d{3})(\d{1,2})$/, "$1-$2");
        }

        // Máscara para telefone (Brasil)
        if (name === "telefone") {
            value = value
                .replace(/\D/g, "")
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .slice(0, 15); // limita a 15 caracteres
        }

        setForm({
            ...form,
            [name]: value,
        });
    };

    const validarDados = () => {
        if (!form.email) return "O email deve ser preenchido";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "O email deve ser válido";
        if (form.email.length > 150) return "O email deve ter no máximo 150 caracteres";

        if (!form.senha) return "A senha deve ser preenchida";

        if (!form.nome) return "O nome deve ser preenchido";
        if (form.nome.length < 3 || form.nome.length > 150)
            return "O nome deve ter no máximo 150 caracteres";

        if (!form.cpf) return "O CPF deve ser preenchido";

        if (!form.telefone) return "O telefone deve ser preenchido";
        if (form.telefone.length > 15)
            return "O telefone deve ter no máximo 15 caracteres";

        if (!form.tipo) return "O tipo do usuário deve ser preenchido";

        if (!form.dataNascimento) return "A data de nascimento deve ser preenchida";

        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setMensagem("");
        setSuccess(false);

        const erro = validarDados();
        if (erro) {
            setMensagem(erro);
            return;
        }

        try {
            await axios.post(API_URL, form);

            setMensagem("Cadastro concluído com sucesso!");
            setSuccess(true);

            setTimeout(() => {
                router.push("/usuario/login");
            }, 2000);

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
        <div className="min-h-screen flex items-center justify-center min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6">
            <div className="bg-white w-full max-w-2xl p-10 rounded-2xl shadow-xl border border-blue-200">
                <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 drop-shadow-sm">
                    Cadastro de Usuário
                </h1>

                {mensagem && (
                    <div className={`mb-4 text-center font-semibold ${success ? "text-green-600" : "text-red-600"}`}>
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Email */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            placeholder="exemplo@dominio.com"
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-blue-500 font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Email válido (máx. 150 caracteres)</p>
                    </div>

                    {/* Senha */}
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
                        <p className="text-xs text-gray-500 mt-1">Preencha sua senha</p>
                    </div>

                    {/* Nome */}
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
                        <p className="text-xs text-gray-500 mt-1">Nome entre 3 e 150 caracteres</p>
                    </div>

                    {/* CPF */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">CPF</label>
                        <input
                            type="text"
                            name="cpf"
                            value={form.cpf}
                            onChange={handleChange}
                            placeholder="000.000.000-00"
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-blue-500 font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Formato: 000.000.000-00</p>
                    </div>

                    {/* Telefone */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Telefone</label>
                        <input
                            type="text"
                            name="telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            placeholder="(00) 00000-0000"
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-blue-500 font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Formato: (00) 00000-0000</p>
                    </div>

                    {/* Tipo de Usuário */}
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
                        <p className="text-xs text-gray-500 mt-1">Escolha o tipo de usuário</p>
                    </div>

                    {/* Data de Nascimento */}
                    <div className="md:col-span-2 w-full max-w-xs mx-auto flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1 text-center">
                            Data de Nascimento
                        </label>
                        <input
                            type="date"
                            name="dataNascimento"
                            value={form.dataNascimento}
                            onChange={handleChange}
                            className="w-full border border-blue-400 rounded-lg px-3 py-2 text-black text-center font-medium focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <p className="text-xs text-gray-500 mt-1 text-center">Selecione sua data de nascimento</p>
                    </div>

                    {/* Botão */}
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
