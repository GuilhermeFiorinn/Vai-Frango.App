"use client";
import { useEffect, useMemo, useState } from "react";

interface Workout {
    name: string;
    description: string;
}


export default function WorkoutsPage() {

    const [loading, setLoading] = useState<boolean>(true);
    const [showSaved, setShowSaved] = useState<boolean>(false);
    const [workouts, setWorkouts] = useState<Workout[]>([]);

    const storeWorkout = async () => {

        const name = prompt("Nome do treino:");
        if (!name) return;

        const description = prompt("Descrição:");
        if (!description) return;

        try {
            const response = await fetch('http://localhost:8000/api/workouts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json',
                },
                body: JSON.stringify({
                    name: name,
                    description: description
                }),
            });
            const data = await response.json();
            setWorkouts([data.workout, ...workouts]);
        } catch (error) {
            console.error('Erro ao salvar o treino: ', error);
        } finally {
            setLoading(false);
            setShowSaved(true);
        }


    };

    useEffect(() => {
        async function fetchPosts() {
            try {
                const response = await fetch("http://localhost:8000/api/workouts");
                const data = await response.json();
                console.log(data.workouts);
                setWorkouts(data.workouts);
            } catch (error) {
                console.error("Erros foram cometidos: ", error);
            } finally {
                setLoading(false);
            }
        }

        fetchPosts();
    }, []);

    useEffect(() => {
        if (showSaved) setTimeout(() => setShowSaved(false), 2000);
    }, [showSaved]);

    return (
        <>
            {
                loading
                    ?
                    <div>Carregando...</div>
                    :

                    <div className="min-w-20 w-8/12">
                        <div className="w-full h-fit mb-4">
                            <button className="flex gap-2" onClick={() => storeWorkout()}>Novo treino +</button>
                        </div>

                        <div className="h-8">
                            {showSaved && <div className="text-amber-400 absolute "> Salvo! </div>}
                        </div>

                        <div className="flex flex-col gap-4 w-full  ">
                            {workouts.map((workout, index) => (
                                <div className="bg-gray-800 p-4 rounded-lg" key={index}>
                                    <h1>{workout.name}</h1>
                                    <p>{workout.description}</p>
                                </div>
                            ))}
                        </div>
                    </div>
            }
        </>

    );
}
