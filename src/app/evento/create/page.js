"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function CreateEvento() {
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
    const [submitted, setSubmitted] = useState(false); // 🔥 controla quando mostrar "*"

    const tiposEvento = [
        "CONGRESSO",
        "TREINAMENTO",
        "WORKSHOP",
        "IMERSÃO",
        "REUNIÃO",
        "HACKATON",
        "STARTUP",
    ];

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm({ ...form, [name]: value });
    };

    function formatarData(dataLocal) {
        if (!dataLocal) return "";
        const dt = new Date(dataLocal);

        const dia = String(dt.getDate()).padStart(2, "0");
        const mes = String(dt.getMonth() + 1).padStart(2, "0");
        const ano = dt.getFullYear();
        const hora = String(dt.getHours()).padStart(2, "0");
        const min = String(dt.getMinutes()).padStart(2, "0");

        return `${dia}/${mes}/${ano} ${hora}:${min}`;
    }

    const handleSubmit = async (e) => {
        e.preventDefault();
        setSubmitted(true); // 🔥 ativa exibição dos "*"
        setMensagem("");
        setErrors({});

        try {
            const payload = {
                ...form,
                dataInicio: formatarData(form.dataInicio),
                dataFinal: formatarData(form.dataFinal),
            };

            await axios.post("http://localhost:8080/api/v1/evento", payload);

            setMensagem("Evento criado com sucesso!");
            setForm({
                nome: "",
                descricao: "",
                tipo: "",
                local: "",
                dataInicio: "",
                dataFinal: "",
                linkEvento: "",
                linkImagem: "",
            });
            setSubmitted(false); // limpa os "*" após sucesso
        } catch (error) {
            if (error.response?.status === 400) {
                setErrors(error.response.data.errors || {});
                setMensagem("É necessário preencher os campos obrigatórios.");
            } else {
                setMensagem("Erro inesperado ao criar evento.");
            }
        }
    };

    // 🔥 função utilitária para saber quando mostrar "*"
    const showStar = (field) =>
        submitted && (!form[field] || errors[field]);

    return (
        <div className="min-h-screen flex flex-col items-center p-10 bg-gray-100">

            {/* TOPBAR (somente espaço, sem links) */}
            <div className="w-full flex justify-between mb-10">
                <div></div>
                <div className="space-x-4 invisible">
                    <span>placeholder</span>
                </div>
            </div>


            {/* CARD FORM */}
            <form
                onSubmit={handleSubmit}
                className="bg-white shadow-xl p-8 rounded-xl w-full max-w-2xl space-y-5 border border-blue-100"
            >
                <h1 className="text-3xl font-bold text-blue-700 text-center mb-6">
                    Criar Evento
                </h1>

                {mensagem && (
                    <div
                        className={
                            mensagem.includes("Corrija")
                                ? "p-3 rounded bg-red-100 text-red-700 text-sm mb-4 border border-red-300"
                                : "p-3 rounded bg-blue-100 text-blue-700 text-sm mb-4"
                        }
                    >
                        {mensagem}
                    </div>
                )}

                {/* NOME */}
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
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.nome && <p className="text-red-600 text-sm">{errors.nome}</p>}
                </div>

                {/* DESCRIÇÃO */}
                <div>
                    <label className="font-semibold text-blue-700">
                        Descrição {showStar("descricao") && <span className="text-red-600">*</span>}
                    </label>
                    <textarea
                        name="descricao"
                        value={form.descricao}
                        onChange={handleChange}
                        placeholder="Digite uma descrição"
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.descricao && (
                        <p className="text-red-600 text-sm">{errors.descricao}</p>
                    )}
                </div>

                {/* TIPO */}
                <div>
                    <label className="font-semibold text-blue-700">
                        Tipo do Evento {showStar("tipo") && <span className="text-red-600">*</span>}
                    </label>
                    <select
                        name="tipo"
                        value={form.tipo}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    >
                        <option value="">Selecione...</option>
                        {tiposEvento.map((t) => (
                            <option key={t} value={t}>
                                {t}
                            </option>
                        ))}
                    </select>
                    {errors.tipo && <p className="text-red-600 text-sm">{errors.tipo}</p>}
                </div>

                {/* LOCAL */}
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
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.local && <p className="text-red-600 text-sm">{errors.local}</p>}
                </div>

                {/* DATA INÍCIO */}
                <div>
                    <label className="font-semibold text-blue-700">
                        Data de Início {showStar("dataInicio") && <span className="text-red-600">*</span>}
                    </label>
                    <input
                        type="datetime-local"
                        name="dataInicio"
                        value={form.dataInicio}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.dataInicio && (
                        <p className="text-red-600 text-sm">{errors.dataInicio}</p>
                    )}
                </div>

                {/* DATA FINAL */}
                <div>
                    <label className="font-semibold text-blue-700">
                        Data Final {showStar("dataFinal") && <span className="text-red-600">*</span>}
                    </label>
                    <input
                        type="datetime-local"
                        name="dataFinal"
                        value={form.dataFinal}
                        onChange={handleChange}
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                    {errors.dataFinal && (
                        <p className="text-red-600 text-sm">{errors.dataFinal}</p>
                    )}
                </div>

                {/* LINK DO EVENTO */}
                <div>
                    <label className="font-semibold text-blue-700">Link do Evento</label>
                    <input
                        type="text"
                        name="linkEvento"
                        value={form.linkEvento}
                        onChange={handleChange}
                        placeholder="https://exemplo.com"
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                </div>

                {/* LINK DA IMAGEM */}
                <div>
                    <label className="font-semibold text-blue-700">Link da Imagem</label>
                    <input
                        type="text"
                        name="linkImagem"
                        value={form.linkImagem}
                        onChange={handleChange}
                        placeholder="URL da imagem"
                        className="w-full mt-1 p-3 border-2 border-blue-300 rounded-lg focus:outline-none focus:border-blue-600 text-gray-900"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-700 text-white font-semibold p-3 rounded-lg shadow hover:bg-blue-800 transition"
                >
                    Criar Evento
                </button>
            </form>
        </div>
    );
}
