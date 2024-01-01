"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Suspense, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { local } from "@/util/axios";

import "material-symbols";
import { useRouter } from "next/navigation";
import Loading from "./loading";

type Inputs = {
    email: string;
    name: string;
    password: string;
};

export default function page() {
    const [visible, setVisibility] = useState(false);
    const [errorMessages, setErrorMessages] = useState<Errors[]>();

    const router = useRouter();

    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm<Inputs>({
        reValidateMode: "onChange",
    });

    const submitHandler: SubmitHandler<Inputs> = async (formData) => {
        const { data } = await local.post("/signup", formData);

        if (data.status >= 400) {
            return setErrorMessages(data.message);
        }

        router.push("/login");
    };

    return (
        <Suspense fallback={<Loading />}>
            <main className="grid place-content-center">
                {errorMessages && (
                    <ul className="mb-4">
                        {errorMessages.map((err) => (
                            <li
                                key={crypto.randomUUID()}
                                className="list-disc text-destructive"
                            >
                                {err.msg}
                            </li>
                        ))}
                    </ul>
                )}
                <form
                    noValidate
                    onChange={() => setErrorMessages([])}
                    onSubmit={handleSubmit(submitHandler)}
                    className="min-w-[25rem] space-y-4"
                >
                    <div>
                        <Label htmlFor="email">Email</Label>
                        <Input
                            {...register("email", {
                                required: {
                                    value: true,
                                    message: "Email required",
                                },
                                pattern: {
                                    value: /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/,
                                    message: "Invalid email",
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
                        <Label htmlFor="email">Name</Label>
                        <Input
                            {...register("name", {
                                required: {
                                    value: true,
                                    message: "Name required",
                                },
                            })}
                            type="text"
                            name="name"
                            id="name"
                        />
                        <p className="text-destructive text-sm">
                            {errors.name?.message}
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
                    <Button type="submit">Submit</Button>
                </form>
            </main>
        </Suspense>
    );
}
