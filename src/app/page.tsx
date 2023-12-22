import { buttonVariants } from "@/components/ui/button";
import Link from "next/link";

export default function Home() {
    return (
        <main className="grid place-content-center">
            <h1 className="text-4xl">
                Welcome to{" "}
                <span
                    className={`font-bold text-primary transition-colors duration-300`}
                >
                    ChatNext
                </span>
                !
            </h1>
            <p className="mt-4">
                Talk with your friends and family, meet new people and have fun.
                All in one place!
            </p>
            <Link
                href="/signup"
                className={`${buttonVariants({
                    variant: "default",
                })} p-4 bg-primary mt-4 justify-self-start`}
            >
                Signup
            </Link>
        </main>
    );
}
