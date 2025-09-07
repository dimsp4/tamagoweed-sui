import { useQueryOwnedPet } from "@/hooks/useQueryOwnedPet";
import { useCurrentAccount } from "@mysten/dapp-kit";
import AdoptComponent from "./AdoptComponent";
import PetComponent from "./PetComponent";
import Header from "@/components/Header";
import { useQueryEquippedAccessory } from "@/hooks/useQueryEquippedAccessory";
import PrismaticBurst from "@/components/PrismaticBurst";
import { useEffect, useState } from "react";

export default function HomePage() {
  const currentAccount = useCurrentAccount();
  const { data: ownedPet, isPending: isOwnedPetLoading } = useQueryOwnedPet();
  const { data: equippedAccessory, isLoading: isLoadingEquipped } =
    useQueryEquippedAccessory({ petId: ownedPet?.id });

  const [showPrismatic, setShowPrismatic] = useState(equippedAccessory && !isLoadingEquipped)

  useEffect(() => {
    if (equippedAccessory) {
      !isLoadingEquipped && setShowPrismatic(true)
    } else {
      setShowPrismatic(false)
    }
  }, [equippedAccessory, isLoadingEquipped])

  return (
    <div className="min-h-screen flex flex-col relative">
      {/* Background */}
      {showPrismatic ? (
        <div className="absolute inset-0 z-0">
          <PrismaticBurst
            animationType="rotate3d"
            intensity={2}
            speed={0.5}
            distort={0}
            paused={false}
            offset={{ x: 0, y: 0 }}
            hoverDampness={0.25}
            rayCount={0}
            mixBlendMode="lighten"
            colors={["#6715ff", "#10FFE2", "#8AFF00", "#FB14BA", "#C401DB"]}
          />
        </div>
      ) : (
        <div
          className="absolute inset-0 z-0 bg-bottom"
          style={{
            backgroundImage: "url('../../../src/assets/bgimage.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
          }}
        />
      )}

      {/* Content */}
      <div className="relative z-10 h-screen w-full flex justify-center items-center">
        <Header />
        <main className="flex-grow flex items-center justify-center p-4">
          {!currentAccount ? (
            <div className="text-center p-8 border-4 border-primary bg-background shadow-[8px_8px_0px_#000]">
              <h2 className="text-4xl uppercase">Please Connect Wallet</h2>
            </div>
          ) : isOwnedPetLoading ? (
            <div className="text-center p-8 border-4 border-primary bg-background shadow-[8px_8px_0px_#000]">
              <h2 className="text-4xl uppercase">Loading Pet...</h2>
            </div>
          ) : ownedPet ? (
            <PetComponent pet={ownedPet} handleKill={() => setShowPrismatic(false)} />
          ) : (
            <AdoptComponent />
          )}
        </main>
      </div>
    </div>
  );
}
