import {
    useCurrentAccount,
    useSuiClient,
    useSignAndExecuteTransaction,
  } from "@mysten/dapp-kit";
  import { Transaction } from "@mysten/sui/transactions";
  import { useMutation, useQueryClient } from "@tanstack/react-query";
  import { toast } from "sonner";
  
  import { queryKeyOwnedPet } from "./useQueryOwnedPet";
  import { MODULE_NAME, PACKAGE_ID } from "@/constants/contract";
  
  const mutateKeyKillPet = ["mutate", "kill-pet"];
  
  type UseMutateKillPetParams = {
    petId: string;
  };
  
  export function useMutateKillPet() {
    const currentAccount = useCurrentAccount();
    const { mutateAsync: signAndExecute } = useSignAndExecuteTransaction();
    const suiClient = useSuiClient();
    const queryClient = useQueryClient();
  
    return useMutation({
      mutationKey: mutateKeyKillPet,
      mutationFn: async ({ petId }: UseMutateKillPetParams) => {
        if (!currentAccount) throw new Error("No connected account");
  
        const tx = new Transaction();
        tx.moveCall({
          target: `${PACKAGE_ID}::${MODULE_NAME}::kill_pet`,
          arguments: [tx.object(petId)],
        });
  
        const { digest } = await signAndExecute({ transaction: tx });
        const response = await suiClient.waitForTransaction({
          digest,
          options: { showEffects: true, showEvents: true },
        });
        if (response?.effects?.status.status === "failure")
          throw new Error(response.effects.status.error);
  
        return response;
      },
      onSuccess: (response) => {
        toast.success(`Pet kill successfully! Tx: ${response.digest}`);
  
        queryClient.invalidateQueries({ queryKey: queryKeyOwnedPet() });
      },
      onError: (error) => {
        console.error("Error kill pet:", error);
        toast.error(`Error kill pet: ${error.message}`);
      },
    });
  }
  