"use client";
import { useState, useEffect } from "react";

// Um tipo para ajudar com o autocompletar e evitar erros (opcional, mas boa prática)
type ProfileData = {
  nome: string;
  email: string;
  membroDesde: string;
  alturaCm: number;
  pesoKg: number;
  objetivo: string;
};

export default function Profile() {
  const [profile, setProfile] = useState<ProfileData | null>(null);
  // Estado para exibir o "Carregando"
  const [carregando, setCarregando] = useState(true);
  // Estado mensagens de erro
  const [erro, setErro] = useState<string | null>(null);

  useEffect(() => {
    async function buscarProfile() {
      try {
        const resposta = await fetch('/api/profile');
        if (!resposta.ok) {
          throw new Error('Não foi possível carregar os dados.');
        }
        const dados = await resposta.json();
        setProfile(dados); // Salva os dados no estado
      } catch (err) {
        setErro("Falha ao buscar informações do profile."); // Salva o erro no estado
        console.error(err);
      } finally {
        setCarregando(false); // Para de carregar, independentemente de sucesso ou erro
      }
    }

    buscarProfile(); // Chama a função
  }, []); // O array vazio [] garante que isso rode apenas uma vez

  // Se estiver carregando, mostra uma mensagem
  if (carregando) {
    return <div className="text-center p-10">Carregando profile...</div>;
  }

  // Se houver um erro, mostra a mensagem de erro
  if (erro) {
    return <div className="text-center p-10 text-red-500">{erro}</div>;
  }

  // Se tudo deu certo, mostra os dados do profile
  return (
    <div className="w-full max-w-2xl mx-auto bg-white dark:bg-gray-800 shadow-lg rounded-lg p-8">
      <h1 className="text-3xl font-bold mb-6 text-center text-gray-800 dark:text-gray-200">
        Meu Profile
      </h1>
      
      {/* Container para as informações */}
      <div className="space-y-4">
        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <span className="font-semibold text-gray-600 dark:text-gray-400">Nome:</span>
          <span className="text-gray-900 dark:text-gray-100">{profile?.nome}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <span className="font-semibold text-gray-600 dark:text-gray-400">Email:</span>
          <span className="text-gray-900 dark:text-gray-100">{profile?.email}</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <span className="font-semibold text-gray-600 dark:text-gray-400">Altura:</span>
          <span className="text-gray-900 dark:text-gray-100">{profile?.alturaCm} cm</span>
        </div>
        <div className="flex justify-between items-center p-3 bg-gray-50 dark:bg-gray-700 rounded-md">
          <span className="font-semibold text-gray-600 dark:text-gray-400">Peso:</span>
          <span className="text-gray-900 dark:text-gray-100">{profile?.pesoKg} kg</span>
        </div>
      </div>
    </div>
  );
}