import { useMutation, useQueryClient } from '@tanstack/react-query'; // ✅ FIX
import { logout } from '../pages/lib/api';

const useLogout = () => {
  const queryClient = useQueryClient();

  const { mutate: logoutMutation, isPending, error } = useMutation({
    mutationFn: logout,
    onSuccess: () => {
      queryClient.setQueryData(["authUser"], null); // ✅ clear user immediately
      queryClient.invalidateQueries({ queryKey: ["authUser"] });
    },
  });

  return {
    logoutMutation,
    isPending,
    error,
  };
};

export default useLogout;