"use client";

import React, { useEffect, useState } from "react";
import axios from "axios";
import { Calendar, MapPin, Link as LinkIcon } from "lucide-react";

/**
 * Página de listagem de eventos (Next.js + React client component)
 * Melhorias realizadas:
 * - Adicionado "use client" (para App Router do Next.js)
 * - Estados de loading / error
 * - Fallback com dados mock quando a chamada ao localhost falhar (útil em sandbox/tests)
 * - Proteções contra acesso a campos undefined
 * - Pequenas melhorias de acessibilidade e UX (skeleton enquanto carrega)
 */
export default function EventosPage() {
  const [eventos, setEventos] = useState(null); // null = ainda não carregou
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Mock de segurança para ambientes onde http://localhost:8080 não é acessível
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
        // chave: a chamada pode falhar em sandboxes que não permitem localhost.
        // por isso deixamos o fallback abaixo.
        const response = await axios.get("http://localhost:8080/api/v1/evento", {
          timeout: 3000,
        });

        if (!mounted) return;

        // Algumas APIs retornam { data: [...] } ou apenas [...]
        const data = Array.isArray(response.data) ? response.data : response.data?.content || [];

        setEventos(data);
      } catch (err) {
        console.error("Erro ao buscar eventos:", err);
        // No ambiente de desenvolvimento/sandbox, usar dados mock garante que a UI continue testável.
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
    // a API do usuário envia datas no formato dd/MM/yyyy HH:mm — já legível.
    // caso venha uma ISO, tentamos convertê-la para formato local.
    if (!raw) return "Data não informada";

    // tenta detectar formato ISO simples
    const isoLike = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}/.test(raw);
    if (isoLike) {
      try {
        const d = new Date(raw);
        return d.toLocaleString();
      } catch (e) {
        return raw;
      }
    }

    return raw; // já no formato dd/MM/yyyy HH:mm
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

  // após carregar, eventos deve ser um array — mas temos proteção caso venha nulo
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
      
      

      {/* Evento em destaque */}
      <article
        aria-label="Evento em destaque"
        className="w-full max-w-4xl bg-white shadow-2xl rounded-2xl p-6 mb-10 relative overflow-hidden"
      >
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
      </article>

      {/* Miniaturas */}
      <section className="grid grid-cols-1 md:grid-cols-3 gap-6 w-full max-w-5xl">
        {miniaturas.map((evento) => (
          <article
            key={evento.id}
            className="bg-white shadow-xl rounded-xl p-4 hover:scale-105 transition-transform relative overflow-hidden"
            aria-label={`Miniatura do evento ${evento.nome}`}
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
          </article>
        ))}
      </section>

      {error && (
        <div className="mt-6 text-sm text-yellow-700">Atenção: houve um problema ao consultar a API — usando dados em cache/mock para exibição.</div>
      )}
    </div>
  );
}
