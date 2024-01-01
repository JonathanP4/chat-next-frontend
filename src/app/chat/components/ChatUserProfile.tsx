import { useContext } from "react";
import { SelectedUserContext } from "../screen/ChatScreen";

type Props = {
    showDialog: boolean;
    hideDialogFn: () => void;
};

export default function ChatUserProfile({ showDialog, hideDialogFn }: Props) {
    const user = useContext(SelectedUserContext);

    return (
        <>
            {showDialog && (
                <div
                    onClick={hideDialogFn}
                    className="absolute top-0 left-0 w-screen h-screen z-20 bg-black/50"
                ></div>
            )}
            <dialog
                open={showDialog}
                className="top-1/2 -translate-y-1/2 z-40 rounded-md p-8 bg-secondary/60 text-white/80 max-w-[30rem] backdrop-blur-sm border border-primary/50"
            >
                <img
                    width={150}
                    className="rounded-full m-auto mb-2"
                    src={user?.image}
                    alt={user?.name + "-picture"}
                />

                <section>
                    <h1 className="text-center text-xl font-bold mb-4 text-primary">
                        {user?.name}
                    </h1>
                    <div className="max-h-[220px] overflow-auto">
                        <p className="m-auto">{user?.status}</p>
                    </div>
                </section>
            </dialog>
        </>
    );
}
