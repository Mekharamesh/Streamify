import { useMutation, useQueryClient } from "@tanstack/react-query";
import { login } from "../pages/lib/api";
import { useNavigate } from "react-router-dom";

const useLogin = () => {
  const queryClient = useQueryClient();
  const navigate = useNavigate();

  const {
    mutate,          // ✅ this is the correct name
    isPending,
    error,
  } = useMutation({
    mutationFn: login,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
      navigate("/");
    },
  });

  return {
    loginMutation: mutate,   // ✅ map correctly
    isPending,
    error,
  };
};

export default useLogin;