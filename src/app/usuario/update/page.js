"use client";

import { useState, useEffect } from "react";
import axios from "axios";
// import { useRouter, useParams } from "next/navigation"; // 1. Descomente em produção

export default function EditUsuarioPage() {
    // 2. Em produção, use o hook do Next.js para pegar o ID da URL:
    // const router = useRouter();
    // const params = useParams();
    // const id = params.id; 
    
    // Para teste no preview, fixamos um ID (simulando que você clicou no usuário 1)
    const id = 1;

    const [form, setForm] = useState({
        email: "",
        senha: "", // Começa vazia. Se o usuário não digitar nada, enviamos vazia/null.
        nome: "",
        cpf: "",
        telefone: "",
        tipo: "",
        dataNascimento: "",
    });

    const [mensagem, setMensagem] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);

    const API_URL = "http://localhost:8080/api/v1/usuario";

    // --- 1. BUSCAR DADOS (GET) PARA PREENCHER A TELA ---
    useEffect(() => {
        const fetchUsuario = async () => {
            try {
                // Busca os dados do usuário pelo ID
                const response = await axios.get(`${API_URL}/${id}`);
                const userData = response.data;

                // Formata a data para o input HTML (yyyy-MM-dd) caso venha em formato ISO ou TimeStamp
                if (userData.dataNascimento) {
                    // Se vier como "2000-10-05T00:00:00", pegamos só a primeira parte
                    userData.dataNascimento = userData.dataNascimento.toString().split('T')[0];
                }
                
                // A senha vem nula ou mascarada do backend (READ_ONLY), então limpamos para o form
                userData.senha = ""; 

                setForm(userData);
            } catch (error) {
                console.warn("API offline ou usuário não encontrado, usando mock para teste.");
                // Mock para você ver a tela preenchida caso a API esteja off
                setForm({
                    email: "usuario.teste@senai.br",
                    senha: "",
                    nome: "Usuário Exemplo da Silva",
                    cpf: "123.456.789-00",
                    telefone: "(47) 99999-8888",
                    tipo: "CLIENTE",
                    dataNascimento: "1995-10-20"
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchUsuario();
        }
    }, [id]);

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

        // Máscara para telefone
        if (name === "telefone") {
            value = value
                .replace(/\D/g, "")
                .replace(/^(\d{2})(\d)/, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2")
                .slice(0, 15);
        }

        setForm({
            ...form,
            [name]: value,
        });
    };

    const validarDados = () => {
        if (!form.email) return "O email deve ser preenchido";
        if (!/\S+@\S+\.\S+/.test(form.email)) return "O email deve ser válido";
        if (form.email.length > 150) return "O email excede 150 caracteres";

        if (!form.nome) return "O nome deve ser preenchido";
        if (form.nome.length < 3) return "O nome deve ter no mínimo 3 caracteres";
        
        if (!form.cpf) return "O CPF deve ser preenchido";
        if (!form.telefone) return "O telefone deve ser preenchido";
        if (!form.tipo) return "O tipo do usuário deve ser preenchido";
        if (!form.dataNascimento) return "A data de nascimento deve ser preenchida";

        // Observação: Não validamos senha aqui porque na edição ela é opcional (conforme seu DTO)
        
        return null;
    };

    // --- 2. ATUALIZAR DADOS (PUT) ---
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
            // Prepara o objeto para envio
            // Se a senha estiver vazia, o backend deve tratar (manter a antiga ou ignorar)
            // Se o seu backend exigir que não envie o campo senha caso vazio, você pode filtrar aqui.
            const payload = { ...form };
            if (!payload.senha) {
                // Opcional: delete payload.senha; // Se o backend preferir não receber o campo
            }

            await axios.put(`${API_URL}/${id}`, payload);

            setMensagem("Usuário atualizado com sucesso!");
            setSuccess(true);

            setTimeout(() => {
                // router.push("/usuario/search"); // Redireciona na versão final
                window.location.href = "/usuario/search";
            }, 2000);

        } catch (error) {
            if (error.response?.data?.errors) {
                const erros = error.response.data.errors;
                const campo = Object.keys(erros)[0];
                const msg = erros[campo];
                setMensagem(`${campo}: ${msg}`);
            } else {
                setMensagem("Erro ao atualizar usuário.");
            }
        }
    };

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-blue-600 font-semibold animate-pulse">Carregando dados do usuário...</div>
            </div>
        );
    }

    return (
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-blue-100 p-4">
            <div className="bg-white w-full max-w-2xl p-10 rounded-2xl shadow-xl border border-blue-200">
                <h1 className="text-3xl font-bold mb-8 text-center text-blue-700 drop-shadow-sm">
                    Editar Cadastro
                </h1>

                {mensagem && (
                    <div className={`mb-6 text-center font-semibold p-3 rounded-lg border ${success ? "text-green-700 bg-green-50 border-green-200" : "text-red-700 bg-red-50 border-red-200"}`}>
                        {mensagem}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-6">

                    {/* Email (Geralmente readonly ou editável dependendo da regra, aqui deixei editável) */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* Senha (Opcional na edição) */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Senha</label>
                        <input
                            type="password"
                            name="senha"
                            value={form.senha}
                            onChange={handleChange}
                            placeholder="Deixe vazio para manter a atual"
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black placeholder-gray-400 focus:outline-none focus:ring focus:ring-blue-300"
                        />
                        <p className="text-xs text-gray-500 mt-1">Preencha apenas se quiser alterar</p>
                    </div>

                    {/* Nome */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Nome</label>
                        <input
                            type="text"
                            name="nome"
                            value={form.nome}
                            onChange={handleChange}
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring focus:ring-blue-300"
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
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* Telefone */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Telefone</label>
                        <input
                            type="text"
                            name="telefone"
                            value={form.telefone}
                            onChange={handleChange}
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black focus:outline-none focus:ring focus:ring-blue-300"
                        />
                    </div>

                    {/* Tipo de Usuário */}
                    <div className="flex flex-col">
                        <label className="font-semibold text-blue-700 mb-1">Tipo de Usuário</label>
                        <select
                            name="tipo"
                            value={form.tipo}
                            onChange={handleChange}
                            className="border border-blue-400 rounded-lg px-3 py-2 text-black font-medium focus:outline-none focus:ring focus:ring-blue-300 bg-white"
                        >
                            <option value="">Selecione...</option>
                            <option value="CLIENTE">Cliente</option>
                            <option value="ORGANIZADOR">Organizador</option>
                            <option value="ADMINISTRADOR">Administrador</option>
                        </select>
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
                    </div>

                    {/* Botões */}
                    <div className="md:col-span-2 flex gap-4 mt-4">
                        <button
                            type="button"
                            onClick={() => window.location.href = "/usuario/search"}
                            className="flex-1 bg-gray-500 hover:bg-gray-600 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                        >
                            Cancelar
                        </button>
                        
                        <button
                            type="submit"
                            className="flex-1 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-xl shadow-md transition-all"
                        >
                            Salvar Alterações
                        </button>
                    </div>

                </form>
            </div>
        </div>
    );
}