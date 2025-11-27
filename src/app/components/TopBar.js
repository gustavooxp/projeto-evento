"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, PlusCircle, LogIn } from "lucide-react";

export default function TopBar() {
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setFade(window.scrollY > 0); // ativa fade-out ao rolar
    };

    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      {/* FUNDO QUE SOME DE VERDADE */}
      <div
        className={`
          absolute inset-0 transition-all duration-700 ease-out
          backdrop-blur-md bg-white/95 shadow-lg
          ${fade ? "opacity-0" : "opacity-100"}
        `}
      />

      {/* Conteúdo que SEMPRE permanece visível */}
      <div className="relative max-w-7xl mx-auto px-6 py-3 flex items-center justify-between pointer-events-auto">

        {/* Logo */}
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-blue-900 hover:opacity-80 transition"
        >
          <Home size={22} />
          Events Manager
        </Link>

        {/* Cadastrar */}
        <Link
          href="/evento/create"
          className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
        >
          <PlusCircle size={20} />
          Cadastrar Evento
        </Link>

        {/* Login */}
        <Link
          href="/usuario/login"
          className="flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-900 transition"
        >
          <LogIn size={20} />
          Entrar
        </Link>

      </div>
    </header>
  );
}
