"use client";
import { useState } from "react";
import styles from "./headerButtons.module.css";
import Calendar from "./Components/Calendar";
import WorkoutsPage from "./Components/WorkoutsPage";

export default function Home() {
	const [active, setActive] = useState<"Treino" | "Agenda" | "Perfil">("Treino");

	const bannerHeight = 120;
	const headerHeight = 64;

	const handleActivePageComponent = () => {
		if (active === "Perfil") return <div>Perfil</div>;
		if (active === "Agenda") return <Calendar />;

		return <WorkoutsPage />;
	};

	return (
		<div className="min-h-screen bg-background text-foreground">	{/* Banner / campo de imagem acima do header */}

			<header
				className="sticky z-10 top-0 w-full bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-black/70 dark:border-gray-800"
			>
				<div
					className="w-full bg-gray-100 dark:bg-gray-900"
					style={{ height: bannerHeight }}
				>
					<div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-center">
						<img
							src="/IconFrango.png"
							className="max-h-full w-auto object-contain"
						/>
					</div>
				</div>

				<div className="max-w-4xl mx-auto px-6 py-3 h-full flex items-center">
					<nav className="w-full">
						<ul className="flex w-full">
							<li className="flex-1 flex justify-center">
								<button
									onClick={() => setActive("Treino")}
									className={`${styles.HeaderButton} ${active === "Treino" ? styles.active : ""}`}
								>
									Treino
								</button>
							</li>
							<li className="flex-1 flex justify-center">
								<button
									onClick={() => setActive("Agenda")}
									className={`${styles.HeaderButton} ${active === "Agenda" ? styles.active : ""}`}
								>
									Agenda
								</button>
							</li>
							<li className="flex-1 flex justify-center">
								<button
									onClick={() => setActive("Perfil")}
									className={`${styles.HeaderButton} ${active === "Perfil" ? styles.active : ""}`}
								>
									Perfil
								</button>
							</li>
						</ul>
					</nav>
				</div>
			</header>

			{/* Main ajustado: sem paddingTop que compensava header fixo */}
			<main
				className="max-w-4xl mx-auto px-4 flex items-start justify-center min-h-screen"
			>
				<div className="w-full flex items-center justify-center py-12">
					{handleActivePageComponent()}
				</div>
			</main>
		</div>
	);
}