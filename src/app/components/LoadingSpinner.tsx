import { CSSProperties } from "react";
import { PuffLoader } from "react-spinners";

const override: CSSProperties = {
    position: "absolute",
    top: "50%",
    left: "50%",
};

export default function LoadingSpinner() {
    return (
        <PuffLoader
            cssOverride={override}
            color="#6D28D9"
            size={60}
            loading={true}
        />
    );
}
