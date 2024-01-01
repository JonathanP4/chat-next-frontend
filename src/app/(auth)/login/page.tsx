"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { v4 as uuid } from "uuid";

import "material-symbols";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { socket } from "@/util/socket";
import { local } from "@/util/axios";
import Loading from "./loading";

type Inputs = {
    email: string;
    password: string;
};

export default function page() {
    const [visible, setVisibility] = useState(false);
    const [errorMessages, setErrorMessages] = useState<Errors[]>();

    const router = useRouter();

    const {
        register,
        formState: { errors },
        handleSubmit,
    } = useForm<Inputs>({ reValidateMode: "onChange" });

    const submitHandler: SubmitHandler<Inputs> = async (formData) => {
        const { data } = await local.post("/login", formData);

        if (data.status >= 400) {
            return setErrorMessages(data.message);
        }

        socket.auth = {
            userId: data.userId,
        };

        router.push("/chat");
    };

    return (
        <Suspense fallback={<Loading />}>
            <main className="grid place-content-center">
                {errorMessages && (
                    <ul className="mb-4">
                        {errorMessages.map((err) => (
                            <li
                                key={uuid()}
                                className="list-disc text-destructive"
                            >
                                {err.msg}
                            </li>
                        ))}
                    </ul>
                )}
                <form
                    onChange={() => setErrorMessages([])}
                    onSubmit={handleSubmit(submitHandler)}
                    className="min-w-[25rem] space-y-4"
                    noValidate
                >
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            {...register("email", {
                                pattern: {
                                    value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                                    message: "Invalid email",
                                },
                                required: {
                                    value: true,
                                    message: "Email required",
                                },
                            })}
                            type="email"
                            name="email"
                            id="email"
                        />
                        <p className="text-destructive text-sm">
                            {errors.email?.message}
                        </p>
                    </div>
                    <div>
                        <Label htmlFor="email">Password</Label>
                        <div className="flex items-start gap-4">
                            <div className="w-full">
                                <Input
                                    {...register("password", {
                                        required: {
                                            value: true,
                                            message: "Password required",
                                        },
                                        minLength: {
                                            value: 6,
                                            message:
                                                "Should be at least 6 characters long",
                                        },
                                    })}
                                    type={visible ? "text" : "password"}
                                    name="password"
                                    id="password"
                                />
                                <p className="text-destructive text-sm">
                                    {errors.password?.message}
                                </p>
                            </div>
                            <span
                                onClick={() => setVisibility((state) => !state)}
                                className="material-symbols-outlined bg-primary py-2 px-4 rounded-md cursor-pointer"
                            >
                                visibility
                            </span>
                        </div>
                    </div>
                    <div className="flex justify-between items-end">
                        <Button type="submit">Submit</Button>
                        <span className="text-xs text-center">
                            Don't have an account yet?{" "}
                            <Link
                                className="text-primary underline"
                                href={"/signup"}
                            >
                                Sign Up
                            </Link>
                        </span>
                    </div>
                </form>
            </main>
        </Suspense>
    );
}
