"use client";
import { useState } from "react";
import styles from "./headerButtons.module.css";
import Calendar from "./Calendar";
import Profile from "./Profile";
import AbaTreino from "./pageTreino";

export default function Home() {
	const [active, setActive] = useState<"Treino" | "Agenda" | "Perfil">("Treino");

	// alturas em px 
	const bannerHeight = 120;
	const headerHeight = 64;

	return (
		<div className="min-h-screen bg-background text-foreground">	{/*Campo da imagem acima do header */}
			<div
				className="w-full bg-[#F89839]"
				style={{ height: bannerHeight }}
			>
				<div className="max-w-4xl mx-auto px-6 h-full flex items-center justify-center">
					<img
						src="/IconFrango.png"
						className="max-h-full w-auto object-contain"
					/>
				</div>
			</div>

			<header
				className="w-full bg-white/80 backdrop-blur-md border-b border-gray-200 dark:bg-black/70 dark:border-gray-800"
				style={{ height: `${headerHeight}px` }}
			>
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

			<main
				className="max-w-4xl mx-auto px-4 flex items-start justify-center min-h-screen"
			>
				<div className="w-full flex items-center justify-center py-12">
                    {active === "Agenda" && <Calendar />}
                    {active === "Perfil" && <Profile />}
					{active === "Treino" && <AbaTreino />}
                </div>
			</main>
		</div>
	);
}