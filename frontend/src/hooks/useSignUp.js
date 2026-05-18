import { useMutation, useQueryClient } from '@tanstack/react-query';
import { signup } from "../pages/lib/api"; // ✅ correct import
import { useNavigate } from "react-router-dom";

const useSignUp = () => {
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    const {
        mutate,
        isPending,
        error,
    } = useMutation({
        mutationFn: signup, // ✅ correct function
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ["authUser"] });
            navigate("/"); // ✅ redirect after signup
        },
    });

    return {
        signupMutation: mutate, // ✅ correct name
        isPending,
        error,
    };
};

export default useSignUp;