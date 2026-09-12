import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Navbar from '../components/Navbar'

export default function HomePage() {
    const { user } = useAuth()

    return (
        <div className="min-h-screen">
            <Navbar />

            <section className="mx-auto max-w-3xl px-6 py-24">
                <h1 className="font-display text-4xl leading-tight text-paper sm:text-5xl">
                    Train met een plan.
                    <br />
                    <span className="text-power">Zie je progressie.</span>
                </h1>

                <p className="mt-6 max-w-xl text-base text-mute">
                    Calisthenics draait niet alleen om harder trainen, maar ook om
                    consistentie en progressie. Kies een trainingsschema dat past bij
                    jouw niveau, volg je dagelijkse planning en leg vast wat je
                    daadwerkelijk hebt uitgevoerd.
                </p>

                <p className="mt-4 max-w-xl text-base text-mute">
                    Zo krijg je inzicht in je trainingen en kun je over tijd zien
                    hoe je sterker wordt en nieuwe skills ontwikkelt.
                </p>

                <div className="mt-8 flex gap-3">
                    {user ? (
                        <Link
                            to="/agenda"
                            className="bg-power px-5 py-2.5 text-sm font-medium text-ink hover:opacity-90"
                        >
                            Naar mijn agenda
                        </Link>
                    ) : (
                        <>
                            <Link
                                to="/register"
                                className="bg-power px-5 py-2.5 text-sm font-medium text-ink hover:opacity-90"
                            >
                                Gratis beginnen
                            </Link>

                            <Link
                                to="/login"
                                className="border border-line px-5 py-2.5 text-sm text-paper hover:border-mute"
                            >
                                Inloggen
                            </Link>
                        </>
                    )}
                </div>
            </section>

            <section className="border-t border-line bg-panel">
                <div className="mx-auto grid max-w-3xl grid-cols-1 gap-8 px-6 py-16 sm:grid-cols-3">

                    <div>
                        <p className="font-display text-3xl text-power">01</p>

                        <h3 className="mt-2 font-medium text-paper">
                            Kies je trainingsschema
                        </h3>

                        <p className="mt-1 text-sm text-mute">
                            Kies een schema dat aansluit bij jouw niveau en
                            trainingsdoelen. Bouw een sterke basis of werk toe
                            naar geavanceerde calisthenics-skills.
                        </p>
                    </div>

                    <div>
                        <p className="font-display text-3xl text-power">02</p>

                        <h3 className="mt-2 font-medium text-paper">
                            Volg je planning
                        </h3>

                        <p className="mt-1 text-sm text-mute">
                            Bekijk in je agenda welke workout er vandaag gepland
                            staat. Start je training en houd bij wat je daadwerkelijk
                            hebt uitgevoerd.
                        </p>
                    </div>

                    <div>
                        <p className="font-display text-3xl text-power">03</p>

                        <h3 className="mt-2 font-medium text-paper">
                            Bekijk je progressie
                        </h3>

                        <p className="mt-1 text-sm text-mute">
                            Elke afgeronde workout wordt opgeslagen in je
                            geschiedenis. Vergelijk je planning met je resultaat
                            en krijg inzicht in je ontwikkeling.
                        </p>
                    </div>

                </div>
            </section>
        </div>
    )
}
