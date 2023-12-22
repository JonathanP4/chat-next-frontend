"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useEffect, useState } from "react";
import { useForm, SubmitHandler } from "react-hook-form";

import "material-symbols";
import { api, local } from "@/util/axios";

type Inputs = {
    image: string;
    name: string;
    status: string;
};

export default function page() {
    const [user, setUser] = useState<UserData>();
    const [error, setError] = useState("");

    const [success, setSucces] = useState("");
    const [errorMessages, setErrorMessages] = useState<Errors[]>();

    const {
        formState: { errors },
        register,
        handleSubmit,
    } = useForm<Inputs>({
        reValidateMode: "onChange",
    });

    useEffect(() => {
        setTimeout(() => setSucces(""), 2000);
    }, [success]);

    useEffect(() => {
        (async function getProfile() {
            const userId = sessionStorage.getItem("userId");

            const { data } = await local.get(`/${userId}`);
            if (!data.user) {
                setError(data.message);
            }
            setUser(data.user);
        })();
    }, []);

    const submitHandler: SubmitHandler<Inputs> = async (formData) => {
        const { data } = await local.patch("/update-profile", formData);

        if (!data.user) {
            return setError(data.message);
        }

        setUser(data.user);
        setSucces(data.message);
    };

    return (
        <main className="grid place-content-center">
            <h1 className="text-primary mb-4">{success}</h1>
            <pre className="text-destructive text-lg mb-4">{error}</pre>
            {user && !error && (
                <>
                    <img
                        className="rounded-full mb-4 mx-auto aspect-square"
                        width={150}
                        height={150}
                        src={user?.image}
                        alt="profile image"
                    />
                    <form
                        noValidate
                        onSubmit={handleSubmit(submitHandler)}
                        className="min-w-[25rem] space-y-4"
                    >
                        <div>
                            <Label htmlFor="image">Image URL</Label>
                            <div className="flex items-start gap-4">
                                <Input
                                    {...register("image")}
                                    type="text"
                                    name="image"
                                    id="image"
                                    defaultValue={user?.image}
                                />
                            </div>
                        </div>
                        <div>
                            <Label htmlFor="status">Status</Label>
                            <Input
                                {...register("status")}
                                type="text"
                                name="status"
                                id="status"
                                defaultValue={user?.status}
                            />
                        </div>
                        <div>
                            <Label htmlFor="email">Name</Label>
                            <Input
                                {...register("name")}
                                type="text"
                                name="name"
                                id="name"
                                defaultValue={user?.name}
                            />
                        </div>
                        <Button type="submit">Submit</Button>
                    </form>
                </>
            )}
        </main>
    );
}
