"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { Home, PlusCircle, LogIn, User } from "lucide-react";

export default function TopBar() {
  const [fade, setFade] = useState(false);
  const [logado, setLogado] = useState(false);

  useEffect(() => {
    const onScroll = () => setFade(window.scrollY > 0);
    window.addEventListener("scroll", onScroll, { passive: true });

    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const token = localStorage.getItem("token");
    setLogado(!!token);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    window.location.reload();
  };

  return (
    <header className="fixed top-0 left-0 w-full z-50 pointer-events-none">
      { }
      <div
        className={`absolute inset-0 transition-opacity duration-700 ease-out
          backdrop-blur-md bg-white/95 shadow-lg
          ${fade ? "opacity-0" : "opacity-100"}`}
      />

      <div className="relative max-w-7xl mx-auto px-6 py-3 flex items-center pointer-events-auto">

        { }
        <Link
          href="/"
          className="flex items-center gap-2 font-bold text-lg text-blue-900 hover:opacity-80 transition"
        >
          <Home size={22} />
          Events Manager
        </Link>

        { }
        <div className="flex-1" />

        { }
        <div className="flex items-center gap-4 min-w-[400px] justify-end">
          { }
          <Link
            href="/evento/create"
            className="flex items-center gap-2 bg-blue-600 text-white px-4 py-2 rounded-xl shadow hover:bg-blue-700 transition"
          >
            <PlusCircle size={20} />
            Cadastrar Evento
          </Link>

          { }
          <Link
            href="/usuario/login"
            className={`flex items-center gap-2 bg-gray-800 text-white px-4 py-2 rounded-xl shadow hover:bg-gray-900 transition ${logado ? "hidden" : ""}`}
          >
            <LogIn size={20} />
            Entrar
          </Link>

          { }
          <button
            onClick={handleLogout}
            className={`flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-xl shadow hover:bg-red-700 transition ${!logado ? "hidden" : ""}`}
          >
            <User size={20} />
            Sair
          </button>
        </div>
      </div>
    </header>
  );
}
