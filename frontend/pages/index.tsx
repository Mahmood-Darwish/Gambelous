import Head from "next/head"
import Image from "next/image"
import { Inter } from "@next/font/google"
import styles from "@/styles/Home.module.css"
import Header from "../components/Header"
import Table from "../components/Table"

const inter = Inter({ subsets: ["latin"] })

export default function Home() {
    return (
        <div>
            <Head>
                <title>Gambling Game</title>
                <meta
                    name="Gambling Game"
                    content="Smart contract gambling game"
                />
                <link rel="icon" href="/favicon.ico" />
            </Head>
            <Header />
            <Table />
        </div>
    )
}
