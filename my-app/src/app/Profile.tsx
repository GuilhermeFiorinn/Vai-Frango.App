"use client";
import { useState, useEffect } from "react";

// 1. ATUALIZANDO O TIPO PARA INCLUIR OS NOVOS DADOS
type Medidas = {
  peitoCm: number;
  cinturaCm: number;
  antebracoDCm: number;
  antebracoECm: number;
};

type ProfileData = {
  nome: string;
  email: string;
  fotoUrl: string; // Novo campo para a foto
  alturaCm: number;
  pesoKg: number;
  medidas: Medidas; // Novo objeto para as medidas
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  const [carregando, setCarregando] = useState(true);
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarProfile() {
      try {
        const resposta = await fetch('/api/profile');
        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os dados.');
        }
        const dados = await resposta.json();
        setProfile(dados);
      } catch (err) {
        setErro("Falha ao buscar informações do profile.");
        console.error(err);
      } finally {
        setCarregando(false);
      }
    }
    buscarProfile();
  }, []);

  if (carregando) {
    return <div className="text-center p-10">Carregando perfil...</div>;
  }

  if (erro) {
    return <div className="text-center p-10 text-red-500">{erro}</div>;
  }

  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">

      <div className="flex flex-col items-center">
        <img
          src={profile?.fotoUrl}
          alt="Foto do Perfil"
          className="w-32 h-32 rounded-full object-cover border-4 border-orange-400 shadow-md"
        />
        <h1 className="text-3xl font-bold mt-4 text-gray-800 dark:text-gray-200">
          {profile?.nome}
        </h1>
        <p className="text-md text-gray-500 dark:text-gray-400">{profile?.email}</p>
      </div>

      <div className="mt-10 space-y-8">

        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
            Informações Pessoais
          </h2>
          <div className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600 dark:text-gray-400">Altura:</span>
              <span className="text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {profile?.alturaCm} cm
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600 dark:text-gray-400">Peso:</span>
              <span className="text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {profile?.pesoKg} kg
              </span>
            </div>
          </div>
        </div>

        {/* --- Seção: Medidas Específicas --- */}
        <div>
          <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-300 border-b pb-2">
            Medidas Específicas (cm)
          </h2>
          <div className="mt-4 space-y-3 p-4 bg-gray-50 dark:bg-gray-900/50 rounded-lg border border-gray-200 dark:border-gray-700">
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600 dark:text-gray-400">Peito:</span>
              <span className="text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {profile?.medidas?.peitoCm} cm  {/* Fica do lado do número */}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600 dark:text-gray-400">Cintura:</span>
              <span className="text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {profile?.medidas?.cinturaCm} cm
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600 dark:text-gray-400">Antebraço Direito:</span>
              <span className="text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {profile?.medidas?.antebracoDCm} cm
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="font-medium text-gray-600 dark:text-gray-400">Antebraço Esquerdo:</span>
              <span className="text-gray-900 dark:text-gray-100 bg-gray-200 dark:bg-gray-700 px-3 py-1 rounded-full text-sm">
                {profile?.medidas?.antebracoECm} cm
              </span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}