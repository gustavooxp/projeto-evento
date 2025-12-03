
"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { Search, Calendar, MapPin, Edit, Trash2, Link as LinkIcon } from "lucide-react";

export default function PesquisaEventoPage() {
    const [filtroTipo, setFiltroTipo] = useState("");
    const [filtroNome, setFiltroNome] = useState("");
    const [eventos, setEventos] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    const API_URL = "http://localhost:8080/api/v1/evento";

    const tiposEvento = [
        "CONGRESSO",
        "TREINAMENTO",
        "WORKSHOP",
        "IMERSAO",
        "REUNIAO",
        "HACKATON",
        "STARTUP",
    ];

    const buscarEventos = async (e) => {
        if (e) e.preventDefault();
        setLoading(true);
        setError("");
        setEventos([]);

        try {
            let url = API_URL;
            if (filtroTipo) {
                url = `${API_URL}/filtro/${filtroTipo}`;
            }

            try {
                const response = await axios.get(url);
                let eventosFiltrados = response.data;

                if (filtroNome && filtroNome.trim() !== "") {
                    const nomeBusca = filtroNome.trim().toLowerCase();
                    eventosFiltrados = eventosFiltrados.filter(evento =>
                        evento.nome && evento.nome.toLowerCase().includes(nomeBusca)
                    );
                }

                setEventos(eventosFiltrados);
            } catch (apiError) {
                console.warn("API offline ou erro de conexão, usando dados de teste.", apiError);
                setEventos(gerarDadosMock(filtroTipo, filtroNome));
            }

        } catch (err) {
            setError("Erro ao buscar eventos.");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id) => {
        const confirmacao = window.confirm("Tem certeza que deseja excluir este evento? Essa ação não pode ser desfeita.");

        if (!confirmacao) return;

        if (!id) {
            alert("ID do evento não encontrado.");
            return;
        }

        try {
            const idNumero = Number(id);
            await axios.delete(`${API_URL}/${idNumero}`, {
                validateStatus: function (status) {
                    return (status >= 200 && status < 300) || status === 204;
                }
            });

            setEventos((prevEventos) => prevEventos.filter((e) => e.id !== idNumero && e.id !== id));
            alert("Evento excluído com sucesso!");
        } catch (err) {
            console.error("Erro ao deletar evento:", err);
            console.error("ID usado:", id);
            console.error("Response:", err.response);

            let errorMessage = "Erro ao excluir evento.";
            if (err.response) {
                errorMessage = err.response.data?.message || err.response.data?.error || `Erro ${err.response.status}: ${err.response.statusText}`;
            } else if (err.message) {
                errorMessage = err.message;
            }

            alert(errorMessage);
        }
    };

    const handleEdit = (id) => {
        window.location.href = `/evento/update?id=${id}`;
    };

    useEffect(() => {
        buscarEventos();
    }, []);

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-4 md:p-8">
            <div className="max-w-7xl mx-auto">
                { }
                <div className="w-full flex justify-between mb-10">
                    <div></div>
                    <div className="space-x-4 invisible">
                        <span>placeholder</span>
                    </div>
                </div>
                <div className="bg-white p-8 rounded-2xl shadow-sm border border-blue-100 mb-8">
                    <h1 className="text-3xl font-bold mb-6 text-blue-600 text-center md:text-left flex items-center gap-3">
                        <Calendar className="w-8 h-8 text-blue-400" />
                        Pesquisar Eventos
                    </h1>

                    <form onSubmit={buscarEventos} className="flex flex-col md:flex-row gap-4 items-end">
                        <div className="w-full md:w-1/3">
                            <label className="font-semibold text-blue-600 mb-1 block">Filtrar por Tipo</label>
                            <select
                                value={filtroTipo}
                                onChange={(e) => setFiltroTipo(e.target.value)}
                                className="w-full border border-blue-200 rounded-lg px-3 py-3 text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 bg-white"
                            >
                                <option value="">Todos os Eventos</option>
                                {tiposEvento.map((tipo) => (
                                    <option key={tipo} value={tipo}>{tipo}</option>
                                ))}
                            </select>
                        </div>

                        <div className="w-full md:w-1/3">
                            <label className="font-semibold text-blue-600 mb-1 block">Pesquisar por Nome</label>
                            <input
                                type="text"
                                value={filtroNome}
                                onChange={(e) => setFiltroNome(e.target.value)}
                                placeholder="Digite o nome do evento..."
                                className="w-full border border-blue-200 rounded-lg px-3 py-3 text-slate-600 font-medium focus:outline-none focus:ring-2 focus:ring-blue-200 focus:border-blue-300 bg-white placeholder:text-slate-400"
                            />
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
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

                {error && (
                    <div className="bg-red-50 border border-red-200 text-red-600 px-4 py-3 rounded-xl mb-6 text-center font-semibold">
                        {error}
                    </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                    {eventos.length > 0 ? (
                        eventos.map((evento) => (
                            <EventoCard
                                key={evento.id}
                                evento={evento}
                                onEdit={handleEdit}
                                onDelete={handleDelete}
                            />
                        ))
                    ) : (
                        !loading && (
                            <div className="col-span-full text-center text-slate-500 py-10">
                                Nenhum evento encontrado com os filtros selecionados.
                            </div>
                        )
                    )}
                </div>
            </div>
        </div>
    );
}

function EventoCard({ evento, onEdit, onDelete }) {
    const formatarData = (data) => {
        if (!data) return "-";
        try {
            if (typeof data === 'string' && data.includes('T')) {
                return new Date(data).toLocaleString("pt-BR");
            }
            return new Date(data).toLocaleString("pt-BR");
        } catch {
            return data;
        }
    };

    const getBadgeColor = (tipo) => {
        switch (tipo) {
            case "CONGRESSO": return "bg-purple-50 text-purple-600 border-purple-100";
            case "TREINAMENTO": return "bg-green-50 text-green-600 border-green-100";
            case "WORKSHOP": return "bg-blue-50 text-blue-600 border-blue-100";
            case "IMERSAO": return "bg-cyan-50 text-cyan-600 border-cyan-100";
            case "REUNIAO": return "bg-orange-50 text-orange-600 border-orange-100";
            case "HACKATON": return "bg-pink-50 text-pink-600 border-pink-100";
            case "STARTUP": return "bg-indigo-50 text-indigo-600 border-indigo-100";
            default: return "bg-gray-50 text-gray-600 border-gray-100";
        }
    };

    return (
        <div className="bg-white rounded-2xl shadow-sm border border-blue-100 overflow-hidden flex flex-col hover:shadow-md transition-shadow duration-300">
            <div className="p-5 border-b border-blue-50 bg-slate-50/50">
                <div className="flex justify-between items-start mb-2">
                    <span className={`px-3 py-1 rounded-full text-xs font-bold border ${getBadgeColor(evento.tipo)}`}>
                        {evento.tipo}
                    </span>
                    <span className="text-xs text-slate-400">ID: {evento.id}</span>
                </div>
                <h2 className="text-xl font-bold text-slate-700 truncate" title={evento.nome}>{evento.nome}</h2>
                {evento.linkImagem && (
                    <img
                        src={evento.linkImagem}
                        alt={evento.nome}
                        className="w-full h-32 object-cover rounded-lg mt-3"
                    />
                )}
            </div>

            <div className="p-5 flex-1 space-y-3">
                <div className="text-sm">
                    <span className="text-slate-400 block mb-1">Descrição:</span>
                    <p className="font-medium text-slate-600 line-clamp-3">{evento.descricao || "-"}</p>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <MapPin size={16} className="text-blue-300" />
                    <span className="text-slate-400">Local:</span>
                    <span className="font-medium text-slate-600">{evento.local || "-"}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-blue-300" />
                    <span className="text-slate-400">Início:</span>
                    <span className="font-medium text-slate-600">{formatarData(evento.dataInicio)}</span>
                </div>
                <div className="flex items-center gap-2 text-sm">
                    <Calendar size={16} className="text-blue-300" />
                    <span className="text-slate-400">Final:</span>
                    <span className="font-medium text-slate-600">{formatarData(evento.dataFinal)}</span>
                </div>
                {evento.linkEvento && (
                    <div className="flex items-center gap-2 text-sm">
                        <LinkIcon size={16} className="text-blue-300" />
                        <a
                            href={evento.linkEvento}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:underline truncate"
                        >
                            Link do Evento
                        </a>
                    </div>
                )}
            </div>

            <div className="p-4 bg-slate-50/50 border-t border-blue-50 grid grid-cols-2 gap-3">
                <button
                    onClick={() => onEdit(evento.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    <Edit size={16} />
                    Editar
                </button>
                <button
                    onClick={() => onDelete(evento.id)}
                    className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-400 hover:bg-rose-500 text-white rounded-lg text-sm font-semibold transition-colors shadow-sm"
                >
                    <Trash2 size={16} />
                    Deletar
                </button>
            </div>
        </div>
    );
}

function gerarDadosMock(filtroTipo, filtroNome) {
    const todos = [
        {
            id: 1,
            nome: "Feira de Tecnologia",
            descricao: "Uma feira com palestras e workshops sobre desenvolvimento.",
            tipo: "CONGRESSO",
            local: "Criciúma - Centro de Convenções",
            dataInicio: "2025-12-01T09:00",
            dataFinal: "2025-12-01T18:00",
            linkEvento: "https://example.com/evento/1",
            linkImagem: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
        },
        {
            id: 2,
            nome: "Workshop React Avançado",
            descricao: "Hands-on para elevar seu conhecimento em React e Next.js.",
            tipo: "WORKSHOP",
            local: "Auditório B",
            dataInicio: "2025-12-05T14:00",
            dataFinal: "2025-12-05T17:00",
            linkEvento: null,
            linkImagem: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=60",
        },
        {
            id: 3,
            nome: "Encontro de Comunidade",
            descricao: "Networking, lightning talks e café.",
            tipo: "WORKSHOP",
            local: "Espaço Comunitário",
            dataInicio: "2025-12-10T19:00",
            dataFinal: "2025-12-10T21:00",
            linkEvento: "https://example.com/evento/3",
            linkImagem: null,
        },
    ];

    let filtrados = todos;

    if (filtroTipo) {
        filtrados = filtrados.filter(e => e.tipo === filtroTipo);
    }

    if (filtroNome && filtroNome.trim() !== "") {
        const nomeBusca = filtroNome.trim().toLowerCase();
        filtrados = filtrados.filter(e =>
            e.nome && e.nome.toLowerCase().includes(nomeBusca)
        );
    }

    return filtrados;
}