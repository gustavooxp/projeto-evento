"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Calendar, User, Mail, Phone, BadgeInfo, Edit, Trash2 } from "lucide-react";

export default function PesquisaUsuarioPage() {
    const [filtroTipo, setFiltroTipo] = useState("");
    const [usuarios, setUsuarios] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_URL = "http://localhost:8080/api/v1/usuario";

    // Função para buscar usuários
    const buscarUsuarios = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError("");
        setUsuarios([]);

        try {
            let url = API_URL;
            // Se tiver filtro selecionado, usa a rota de filtro, senão busca todos
            if (filtroTipo) {
                url = `${API_URL}/filtro/${filtroTipo}`;
            }

            // Tenta buscar da API
            // OBS: Para teste no preview, se falhar, usarei dados falsos (mock)
            try {
                const response = await axios.get(url);
                setUsuarios(response.data);
            } catch (apiError) {
                console.warn("API offline ou erro de conexão, usando dados de teste.", apiError);
                // MOCK DE DADOS PARA VISUALIZAÇÃO (Remova isso em produção)
                setUsuarios(gerarDadosMock(filtroTipo));
            }

        } catch (err) {
            setError("Erro ao buscar usuários.");
        } finally {
            setLoading(false);
        }
    };

    // Função para deletar usuário
    const handleDelete = async (id) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este usuário? Essa ação não pode ser desfeita.");

        if (!confirmacao) return;

        try {
            // Tenta deletar na API
            await axios.delete(`${API_URL}/${id}`);

            // Remove da lista local visualmente
            setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u.id !== id));
            alert("Usuário excluído com sucesso!");
        } catch (err) {
            console.error(err);
            // Fallback para mock: se der erro na API (provavelmente offline no preview), remove visualmente para teste
            setUsuarios((prevUsuarios) => prevUsuarios.filter((u) => u.id !== id));
            alert("Erro ao excluir na API (Simulação: Usuário removido da lista visual).");
        }
    };

    // Função para editar usuário
    const handleEdit = (id) => {
        // Redireciona para a página de edição (ajuste a rota conforme seu projeto)
        window.location.href = `/usuario/edit/${id}`;
    };

    // Busca inicial ao carregar a página (opcional)
    useEffect(() => {
        buscarUsuarios();
    }, []);

    return (

        // Fundo com gradiente azul bem suave
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">

{ }
            <div className="w-full flex justify-between mb-10">
                <div></div>
                <div className="space-x-4 invisible">
                    <span>placeholder</span>
                </div>
            </div>

            <div className="max-w-7xl mx-auto">
                {/* Cabeçalho e Filtros */}

                <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 mb-8">

                    <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center md:text-left flex items-center gap-3">
                        <User className="w-8 h-8 text-blue-400" />
                        Pesquisar Usuários
                    </h1>

                    <form onSubmit={buscarUsuarios} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="font-semibold text-blue-600 mb-1 block">Filtrar por Tipo</label>
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                // Bordas e focos mais suaves
                                className="w-full border border-blue-200 rounded-lg px-3 py-3 text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 bg-white"
                            >
                                <option value="">Todos os Usuários</option>
                                <option value="CLIENTE">Cliente</option>
                                <option value="ORGANIZADOR">Organizador</option>
                                <option value="ADMINISTRADOR">Administrador</option>
                            </select>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            // Botão azul mais suave
                            className="w-full md:w-auto px-8 py-3 bg-blue-500 hover:bg-blue-600 text-white font-semibold rounded-xl shadow-sm transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:hover:bg-blue-500"
                        >
                            {loading ? "Buscando..." : (
                                <>
                                    <Search size={20} />
                                    Pesquisar
                                </>
                            )}
                        </button>
                    </form>
                </div>

                {/* Mensagem de Erro */}
                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-center font-semibold">
                        {error}
                    </div>
                )}

                {/* Lista de Resultados */}
                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {usuarios.length > 0 ? (
                        usuarios.map((user) => (
                            <UserCard
                                key={user.id}
                                user={user}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        !loading && (
                            <div className="col-span-full text-center text-slate-500 py-10">
                                Nenhum usuário encontrado com os filtros selecionados.
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

// Componente do Card de Usuário
function UserCard({ user, onEdit, onDelete }) {
    // Formata data
    const formatarData = (data) => {
        if (!data) return "-";
        return new Date(data).toLocaleDateString("pt-BR");
    };

    // Cor do badge baseado no tipo - Tons pastéis mais azulados/suaves
    const getBadgeColor = (tipo) => {
        switch (tipo) {
            // Roxo/Índigo suave para Admin
            case "ADMINISTRADOR": return "bg-indigo-50 text-indigo-600 border-indigo-100";
            // Ciano/Teal suave para Organizador (para diferenciar, mas ainda frio)
            case "ORGANIZADOR": return "bg-cyan-50 text-cyan-600 border-cyan-100";
            // Azul padrão suave para Cliente
            default: return "bg-blue-50 text-blue-600 border-blue-100";
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
            {/* Cabeçalho do Card - Fundo azul muito claro */}
            <div className="p-5 border-b border-blue-50 bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(user.tipo)}`}>
                        {user.tipo}
                    </span>
                    <span className="text-xs text-slate-400">ID: {user.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-700 truncate" title={user.nome}>{user.nome}</h2>
                <div className="flex items-center gap-2 text-sm text-slate-500 mt-1">
                    <Mail size={14} className="text-blue-300" />
                    <span className="truncate">{user.email}</span>
                </div>
            </div>

            {/* Detalhes do Usuário - Textos em tons de ardósia (slate) */}
            <div className="p-5 flex-1 space-y-3">
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2"><BadgeInfo size={16} className="text-blue-300" /> CPF:</span>
                    <span className="font-medium text-slate-600">{user.cpf}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2"><Phone size={16} className="text-blue-300" /> Telefone:</span>
                    <span className="font-medium text-slate-600">{user.telefone}</span>
                </div>
                <div className="flex justify-between text-sm">
                    <span className="text-slate-400 flex items-center gap-2"><Calendar size={16} className="text-blue-300" /> Nascimento:</span>
                    <span className="font-medium text-slate-600">{formatarData(user.dataNascimento)}</span>
                </div>

                {/* Seção de Inscrições / Eventos */}
                <div className="mt-4 pt-4 border-t border-blue-50">
                    <h3 className="text-sm font-bold text-blue-700 mb-3 flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-blue-400" />
                        Eventos Inscritos ({user.inscricoes?.length || 0})
                    </h3>

                    <div className="space-y-2 max-h-40 overflow-y-auto pr-1 scrollbar-thin scrollbar-thumb-blue-100 scrollbar-track-transparent">
                        {user.inscricoes && user.inscricoes.length > 0 ? (
                            user.inscricoes.map((inscricao, idx) => (
                                // Card de inscrição mais suave
                                <div key={idx} className="bg-blue-50/50 p-2 rounded-lg border border-blue-100 text-xs">
                                    <p className="font-semibold text-blue-800">
                                        {inscricao.evento?.titulo || "Evento sem título"}
                                    </p>
                                    <p className="text-slate-500 mt-1 flex justify-between">
                                        <span>Data Inscrição:</span>
                                        <span>{formatarData(inscricao.createdAt || new Date())}</span>
                                    </p>
                                </div>
                            ))
                        ) : (
                            <p className="text-xs text-slate-400 italic text-center py-2">
                                Nenhuma inscrição ativa.
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Rodapé com Ações - Botões com cores mais suaves */}
            <div className="p-4 bg-slate-50/50 border-t border-blue-50 grid grid-cols-2 gap-3">
                <button
                    onClick={() => onEdit(user.id)}
                    // Botão Editar: Índigo suave em vez de amarelo forte
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    <Edit size={16} />
                    Editar
                </button>
                <button
                    onClick={() => onDelete(user.id)}
                    // Botão Deletar: Rosa/Coral suave em vez de vermelho forte
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-400 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    <Trash2 size={16} />
                    Deletar
                </button>
            </div>
        </div>
    );
}

// ------------------------------------------------------------------
// FUNÇÃO AUXILIAR APENAS PARA O PREVIEW (MOCK DE DADOS)
// ------------------------------------------------------------------
function gerarDadosMock(filtro) {
    const todos = [
        {
            id: 1,
            nome: "Ana Silva",
            email: "ana.silva@email.com",
            cpf: "123.456.789-00",
            telefone: "(11) 98888-7777",
            tipo: "CLIENTE",
            dataNascimento: "1990-05-15",
            inscricoes: [
                { evento: { titulo: "Workshop de React" }, createdAt: "2023-10-01" },
                { evento: { titulo: "Semana da Tecnologia" }, createdAt: "2023-11-12" }
            ]
        },
        {
            id: 2,
            nome: "Carlos Souza",
            email: "carlos.souza@empresa.com",
            cpf: "222.333.444-55",
            telefone: "(21) 99999-8888",
            tipo: "ORGANIZADOR",
            dataNascimento: "1985-08-20",
            inscricoes: []
        },
        {
            id: 3,
            nome: "Roberto Admin",
            email: "admin@sistema.com",
            cpf: "000.000.000-00",
            telefone: "(41) 3333-3333",
            tipo: "ADMINISTRADOR",
            dataNascimento: "1980-01-01",
            inscricoes: [
                { evento: { titulo: "Reunião de Gestão" }, createdAt: "2023-12-05" }
            ]
        },
        {
            id: 4,
            nome: "Mariana Oliveira",
            email: "mari@email.com",
            cpf: "999.888.777-66",
            telefone: "(31) 97777-6666",
            tipo: "CLIENTE",
            dataNascimento: "1995-03-10",
            inscricoes: [
                { evento: { titulo: "Curso de Java Spring" }, createdAt: "2023-09-15" },
                { evento: { titulo: "Hackathon 2024" }, createdAt: "2023-10-20" },
                { evento: { titulo: "Meetup de IA" }, createdAt: "2023-11-01" }
            ]
        }
    ];

    if (!filtro) return todos;
    return todos.filter(u => u.tipo === filtro);
}