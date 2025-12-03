"use client";


import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams } from "next/navigation";

export default function EditEventoPage() {
    const searchParams = useSearchParams();
    const id = searchParams.get("id");

    const [form, setForm] = useState({
        nome: "",
        descricao: "",
        tipo: "",
        local: "",
        dataInicio: "",
        dataFinal: "",
        linkEvento: "",
        linkImagem: "",
    });

    const [errors, setErrors] = useState({});
    const [mensagem, setMensagem] = useState("");
    const [success, setSuccess] = useState(false);
    const [loading, setLoading] = useState(true);
    const [submitted, setSubmitted] = useState(false);

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

    useEffect(() => {
        const fetchEvento = async () => {
            try {
                const response = await axios.get(`${API_URL}/${id}`);
                const eventoData = response.data;

                if (eventoData.dataInicio) {
                    const dataInicio = new Date(eventoData.dataInicio);
                    if (!isNaN(dataInicio.getTime())) {
                        const year = dataInicio.getFullYear();
                        const month = String(dataInicio.getMonth() + 1).padStart(2, '0');
                        const day = String(dataInicio.getDate()).padStart(2, '0');
                        const hours = String(dataInicio.getHours()).padStart(2, '0');
                        const minutes = String(dataInicio.getMinutes()).padStart(2, '0');
                        eventoData.dataInicio = `${year}-${month}-${day}T${hours}:${minutes}`;
                    }
                }

                if (eventoData.dataFinal) {
                    const dataFinal = new Date(eventoData.dataFinal);
                    if (!isNaN(dataFinal.getTime())) {
                        const year = dataFinal.getFullYear();
                        const month = String(dataFinal.getMonth() + 1).padStart(2, '0');
                        const day = String(dataFinal.getDate()).padStart(2, '0');
                        const hours = String(dataFinal.getHours()).padStart(2, '0');
                        const minutes = String(dataFinal.getMinutes()).padStart(2, '0');
                        eventoData.dataFinal = `${year}-${month}-${day}T${hours}:${minutes}`;
                    }
                }

                setForm(eventoData);
            } catch (error) {
                console.warn("API offline ou evento não encontrado, usando mock para teste.", error);
                setForm({
                    nome: "Evento Exemplo",
                    descricao: "Descrição do evento exemplo",
                    tipo: "WORKSHOP",
                    local: "Local Exemplo",
                    dataInicio: "2025-12-01T09:00",
                    dataFinal: "2025-12-01T18:00",
                    linkEvento: "",
                    linkImagem: "",
                });
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchEvento();
        }
    }, [id]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    function formatarData(dataLocal) {
        if (!dataLocal) return "";
        const [data, hora] = dataLocal.split("T");
        const [ano, mes, dia] = data.split("-");
        return `${dia}/${mes}/${ano} ${hora}`;
    }

    const validarDados = () => {
        if (!form.nome) return "O nome deve ser preenchido";
        if (!form.descricao) return "A descrição deve ser preenchida";
        if (!form.tipo) return "O tipo do evento deve ser preenchido";
        if (!form.local) return "O local deve ser preenchido";
        if (!form.dataInicio) return "A data de início deve ser preenchida";
        if (!form.dataFinal) return "A data final deve ser preenchida";
        return null;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true);
        setMensagem("");
        setErrors({});
        setSuccess(false);

        const erro = validarDados();
        if (erro) {
            setMensagem(erro);
            return;
        }

        try {
            const payload = {
                ...form,
                dataInicio: formatarData(form.dataInicio),
                dataFinal: formatarData(form.dataFinal),
            };

            await axios.put(`${API_URL}/${id}`, payload);

            setMensagem("Evento atualizado com sucesso!");
            setSuccess(true);

            setTimeout(() => {
                window.location.href = "/evento/search";
            }, 2000);

        } catch (error) {
            if (error.response?.status === 400) {
                setErrors(error.response.data.errors || {});
                setMensagem("É necessário preencher os campos obrigatórios.");
            } else {
                setMensagem("Erro ao atualizar evento.");
            }
        }
    };

    const showStar = (field) =>
        submitted && (!form[field] || errors[field]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-blue-50">
                <div className="text-blue-600 font-semibold animate-pulse">Carregando dados do evento...</div>
            </div>
        );
    }

    return (
        <div
            className="min-h-screen flex flex-col items-center p-10 
            bg-gradient-to-br from-blue-50 via-blue-100 to-white"
        >
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl p-8 rounded-xl w-full max-w-2xl space-y-5 border border-blue-100"
            >
                <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
                    Editar Evento
                </h1>

                {mensagem && (
                    <div
                        className={
                            success
                                ? "p-3 rounded bg-green-100 text-green-700 text-sm mb-4 border border-green-300"
                                : mensagem.includes("Corrija") || mensagem.includes("Erro")
                                ? "p-3 rounded bg-red-100 text-red-700 text-sm mb-4 border border-red-300"
                                : "p-3 rounded bg-blue-100 text-blue-700 text-sm mb-4"
                        }
                    >
                        {mensagem}
                    </div>
                )}

                <div>
                    <label className="font-semibold text-blue-700">
                        Nome {showStar("nome") && <span className="text-red-600">*</span>}
                    </label>
                    <input
                        type="text"
                        name="nome"
                        value={form.nome}
                        onChange={handleChange}
                        placeholder="Digite o nome do evento"
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                        focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}
                </div>

                <div>
                    <label className="font-semibold text-blue-700">
                        Descrição {showStar("descricao") && <span className="text-red-600">*</span>}
                    </label>
                    <textarea
                        name="descricao"
                        value={form.descricao}
                        onChange={handleChange}
                        placeholder="Digite uma descrição"
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                        focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.descricao && (
                        <p className="text-red-600 text-sm">{errors.descricao}</p>
                    )}
                </div>

                <div>
                    <label className="font-semibold text-blue-700">
                        Tipo do Evento {showStar("tipo") && <span className="text-red-600">*</span>}
                    </label>
                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                        focus:outline-none focus:border-blue-600 text-gray-900"
                    >
                        <option value="">Selecione...</option>
                        {tiposEvento.map((t) => (
                            <option key={t} value={t}>{t}</option>
                        ))}
                    </select>
                    {errors.tipo && <p className="text-red-600 text-sm">{errors.tipo}</p>}
                </div>

                <div>
                    <label className="font-semibold text-blue-700">
                        Local {showStar("local") && <span className="text-red-600">*</span>}
                    </label>
                    <input
                        type="text"
                        name="local"
                        value={form.local}
                        onChange={handleChange}
                        placeholder="Digite o local"
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                        focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.local && <p className="text-red-600 text-sm">{errors.local}</p>}
                </div>

                <div>
                    <label className="font-semibold text-blue-700">
                        Data de Início {showStar("dataInicio") && <span className="text-red-600">*</span>}
                    </label>
                    <input
                        type="datetime-local"
                        name="dataInicio"
                        value={form.dataInicio}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                        focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.dataInicio && (
                        <p className="text-red-600 text-sm">{errors.dataInicio}</p>
                    )}
                </div>

                <div>
                    <label className="font-semibold text-blue-700">
                        Data Final {showStar("dataFinal") && <span className="text-red-600">*</span>}
                    </label>
                    <input
                        type="datetime-local"
                        name="dataFinal"
                        value={form.dataFinal}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                        focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.dataFinal && (
                        <p className="text-red-600 text-sm">{errors.dataFinal}</p>
                    )}
                </div>

                <div>
                    <label className="font-semibold text-blue-700">Link do Evento</label>
                    <input
                        type="text"
                        name="linkEvento"
                        value={form.linkEvento}
                        onChange={handleChange}
                        placeholder="https://exemplo.com"
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                        focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                </div>

                <div>
                    <label className="font-semibold text-blue-700">Link da Imagem</label>
                    <input
                        type="text"
                        name="linkImagem"
                        value={form.linkImagem}
                        onChange={handleChange}
                        placeholder="URL da imagem"
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg 
                        focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                </div>

                <div className="flex gap-4 mt-4">
                    <button
                        type="button"
                        onClick={() => window.location.href = "/evento/search"}
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
    );
}

