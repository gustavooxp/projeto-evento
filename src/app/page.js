"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Link as LinkIcon, Edit, Trash2 } from "lucide-react";

export default function EventosPage() {
  const [eventos, setEventos] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [usuarioLogado, setUsuarioLogado] = useState(null);

  const API_URL = "http://localhost:8080/api/v1/evento";

  const MOCK_EVENTOS = [
    {
      id: 1,
      nome: "Feira de Tecnologia",
      descricao: "Uma feira com palestras e workshops sobre desenvolvimento.",
      tipo: "CONFERENCIA",
      local: "Criciúma - Centro de Convenções",
      dataInicio: "01/12/2025 09:00",
      dataFinal: "01/12/2025 18:00",
      linkEvento: "https://example.com/evento/1",
      linkImagem: "https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&q=80",
    },
    {
      id: 2,
      nome: "Workshop React Avançado",
      descricao: "Hands-on para elevar seu conhecimento em React e Next.js.",
      tipo: "WORKSHOP",
      local: "Auditório B",
      dataInicio: "05/12/2025 14:00",
      dataFinal: "05/12/2025 17:00",
      linkEvento: null,
      linkImagem: "https://images.unsplash.com/photo-1515879218367-8466d910aaa4?w=800&q=60",
    },
    {
      id: 3,
      nome: "Encontro de Comunidade",
      descricao: "Networking, lightning talks e café.",
      tipo: "MEETUP",
      local: "Espaço Comunitário",
      dataInicio: "10/12/2025 19:00",
      dataFinal: "10/12/2025 21:00",
      linkEvento: "https://example.com/evento/3",
      linkImagem: null,
    },
  ];

  useEffect(() => {
    let mounted = true;

    const fetchEventos = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(API_URL, {
          timeout: 3000,
          withCredentials: true,
        });

        if (!mounted) return;

        const data = Array.isArray(response.data) ? response.data : response.data?.content || [];
        setEventos(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        if (mounted) {
          setError(err.message || "Erro ao buscar eventos");
          setEventos(MOCK_EVENTOS);
        }
      } finally {
        if (mounted) setLoading(false);
      }
    };

    fetchEventos();
    return () => {
      mounted = false;
    };
  }, []);

  const formatDate = (raw) => {
    if (!raw) return "Data não informada";
    const isoLike = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw);
    if (isoLike) {
      try {
        return new Date(raw).toLocaleString();
      } catch {
        return raw;
      }
    }
    return raw;
  };

  const handleInscrever = async (evento) => {
    const usuarioId = localStorage.getItem("id");

    if (!usuarioId) {
      alert("Você precisa estar logado para se inscrever.");
      window.location.href = "/login";
      return;
    }

    try {
      // payload que o backend espera
      const payload = {
        eventoId: evento.id,
        usuarioId: Number(localStorage.getItem("id"))
      };

      const response = await axios({
        method: "post",
        url: "http://localhost:8080/api/v1/inscricao",
        data: payload,
        headers: { "Content-Type": "application/json" },
        withCredentials: true
      });

      console.log("Inscrição realizada:", response.data);
      alert(`Inscrição realizada no evento: ${evento.nome}`);
    } catch (err) {
      console.error("Erro na inscrição:", err);

      if (err.response) {
        // backend retornou erro (500 ou 4xx)
        console.error("Resposta do backend:", err.response.data);
        alert(`Erro ao se inscrever: ${err.response.data?.message || JSON.stringify(err.response.data)}`);
      } else if (err.request) {
        // requisição enviada mas sem resposta
        console.error("Requisição enviada sem resposta:", err.request);
        alert("Erro: servidor não respondeu. Tente novamente mais tarde.");
      } else {
        console.error("Erro inesperado:", err.message);
        alert(`Erro inesperado: ${err.message}`);
      }
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

      setEventos((prevEventos) => {
        if (Array.isArray(prevEventos)) {
          return prevEventos.filter((e) => e.id !== idNumero && e.id !== id);
        }
        return [];
      });
      alert("Evento excluído com sucesso!");
      window.location.reload();
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

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-blue-100 p-6">
        <div className="max-w-4xl w-full animate-pulse">
          <div className="h-64 bg-white rounded-2xl shadow-lg mb-6" />
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="h-40 bg-white rounded-xl shadow" />
            <div className="h-40 bg-white rounded-xl shadow hidden md:block" />
            <div className="h-40 bg-white rounded-xl shadow hidden md:block" />
          </div>
        </div>
      </div>
    );
  }

  const lista = Array.isArray(eventos) ? eventos : [];

  if (lista.length === 0) {
    return (
      <div className="min-h-screen w-full bg-blue-100 p-6 flex flex-col items-center">
        <h1 className="text-3xl font-bold mb-6 text-blue-900">Eventos</h1>
        <p className="text-center text-gray-700">Nenhum evento encontrado.</p>
      </div>
    );
  }

  const destaque = lista[0] || {};
  const miniaturas = lista.slice(1);

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-blue-50 via-blue-100 to-blue-50 p-6 flex flex-col items-center">
      <h1 className="text-3xl font-extrabold mb-6 text-blue-900 drop-shadow-sm"></h1>
      <h1 className="text-3xl font-extrabold mb-6 text-blue-900 drop-shadow-sm"></h1>
      <h1 className="text-3xl font-extrabold mb-6 text-blue-900 drop-shadow-sm"></h1>

      <article className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-6 mb-10 relative overflow-hidden">
        <div className="absolute -top-20 -left-20 w-72 h-72 bg-gradient-to-br from-blue-300 to-transparent opacity-30 rounded-full pointer-events-none blur-3xl" />
        <img
          src={destaque.linkImagem || "https://via.placeholder.com/1200x600?text=Sem+imagem"}
          alt={destaque.nome || "Evento sem nome"}
          className="w-full h-64 object-cover rounded-xl shadow-lg"
        />
        <h2 className="text-2xl font-bold text-gray-900 mt-4">{destaque.nome}</h2>
        <p className="text-gray-700 mt-2">{destaque.descricao}</p>

        <div className="flex flex-col gap-2 mt-4 text-gray-800">
          <span className="flex items-center gap-2">
            <MapPin size={18} /> {destaque.local || "Local não informado"}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={18} /> Início: {formatDate(destaque.dataInicio)}
          </span>
          <span className="flex items-center gap-2">
            <Calendar size={18} /> Final: {formatDate(destaque.dataFinal)}
          </span>
          {destaque.linkEvento && (
            <a
              href={destaque.linkEvento}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 text-blue-700 hover:underline mt-2"
            >
              <LinkIcon size={18} /> Link do Evento
            </a>
          )}
        </div>

        <div className="flex gap-3 mt-4">
          <button
            onClick={() => handleInscrever(destaque)}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
          >
            Inscrever-se
          </button>
          <button
            onClick={() => handleEdit(destaque.id)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-indigo-400 hover:bg-indigo-500 text-white rounded-lg transition-colors shadow-sm"
          >
            <Edit size={16} />
            Editar
          </button>
          <button
            onClick={() => handleDelete(destaque.id)}
            className="flex items-center justify-center gap-2 px-4 py-2 bg-rose-400 hover:bg-rose-500 text-white rounded-lg transition-colors shadow-sm"
          >
            <Trash2 size={16} />
            Deletar
          </button>
        </div>
      </article>

      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {miniaturas.map((evento) => (
          <article
            key={evento.id}
            className="bg-white shadow-xl rounded-xl p-4 hover:scale-105 transition-transform relative overflow-hidden"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-200 via-transparent to-blue-300 opacity-20 pointer-events-none" />
            <img
              src={evento.linkImagem || "https://via.placeholder.com/400x240?text=Sem+imagem"}
              alt={evento.nome}
              className="w-full h-32 object-cover rounded-md shadow"
            />
            <h3 className="font-bold text-gray-900 mt-3">{evento.nome}</h3>
            <p className="text-sm text-gray-700 line-clamp-2">{evento.descricao}</p>
            <div className="flex items-center gap-2 mt-2 text-gray-800 text-sm">
              <Calendar size={16} /> {formatDate(evento.dataInicio)}
            </div>

            <div className="flex gap-2 mt-2">
              <button
                onClick={() => handleInscrever(evento)}
                className="flex-1 px-3 py-1 bg-blue-500 text-white rounded-md hover:bg-blue-600 text-sm transition"
              >
                Inscrever-se
              </button>
              <button
                onClick={() => handleEdit(evento.id)}
                className="flex items-center justify-center gap-1 px-2 py-1 bg-indigo-400 hover:bg-indigo-500 text-white rounded-md text-sm transition-colors shadow-sm"
                title="Editar"
              >
                <Edit size={14} />
              </button>
              <button
                onClick={() => handleDelete(evento.id)}
                className="flex items-center justify-center gap-1 px-2 py-1 bg-rose-400 hover:bg-rose-500 text-white rounded-md text-sm transition-colors shadow-sm"
                title="Deletar"
              >
                <Trash2 size={14} />
              </button>
            </div>
          </article>
        ))}
      </section>

      {error && (
        <div className="mt-6 text-sm text-yellow-700">
          Atenção: houve um problema ao consultar a API — usando dados em cache/mock para exibição.
        </div>
      )}
    </div>
  );
}
