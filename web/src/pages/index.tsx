import { GetServerSideProps, GetStaticProps } from "next";
import { getSession, signIn, signOut, useSession } from "next-auth/react";
import Image from "next/image";
import { Toaster, toast } from "react-hot-toast";
import nlwPreview from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import userAvatarImg from "../assets/users-avatar-example.png";
import { Divider } from "../components/Divider";
import { ShowUtilities } from "../components/ShowUtilities";
import { api } from "../services/axios";
import { GoogleLogo, Power } from "phosphor-react";
import { Menu } from "../components/Menu";
import { useAuth } from "../hooks/useAuth";
import { usePool } from "../hooks/usePool";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ guessCount, poolCount, userCount }: HomeProps) {
  const { handleSignInWithGoogle, handleSignOut } = useAuth();
  const { handleCreatePool, poolTitle, changePoolTitle } = usePool();
  const { data: session, status } = useSession();

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <Toaster />
      <main>
        <Image src={logoImg} quality={100} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio bolão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarImg} quality={100} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount} </span>
            pessoas já estão usando
          </strong>
        </div>

        {!!session?.user ? (
          <form
            onSubmit={handleCreatePool}
            className="mt-10 flex items-center gap-2"
          >
            <input
              type="text"
              required
              placeholder="Qual nome do seu bolão?"
              onChange={(event) => changePoolTitle(event.target.value)}
              value={poolTitle}
              className="flex-1 px-6 py-4 rounded text-gray-100 bg-gray-800 border border-gray-600 text-sm"
            />
            <button
              type="submit"
              className="bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellowHover-700"
            >
              Criar meu bolão
            </button>
          </form>
        ) : (
          <button
            type="button"
            onClick={() => handleSignInWithGoogle()}
            className="text-gray-100 mt-10 font-bold rounded px-6 py-3 bg-red-500 hover:bg-red-400 transition-all flex items-center gap-2"
          >
            <GoogleLogo size={28} weight="bold" />
            Fazer login com Google
          </button>
        )}

        <p className="mt-4 text-sm text-gray-300 leading-relaxed">
          Após criar seu bolão, você receberá um código único que poderá usar
          para convidar outras pessoas.
        </p>

        <div className="mt-10 pt-10 border-t border-gray-600 text-gray-100 flex justify-between items-center">
          <ShowUtilities counts={poolCount} title="Bolões criados" />
          <Divider />
          <ShowUtilities counts={guessCount} title="Palpites enviados" />
        </div>
      </main>

      <div className="h-full py-14 flex flex-col gap-4">
        {status === "unauthenticated" && (
          <Image
            src={nlwPreview}
            quality={100}
            alt="Dois celulares exibindo uma pŕevida da aplicação"
          />
        )}
        {status === "authenticated" && (
          <>
            <div className="flex justify-between items-center">
              <h3 className="text-gray-200 flex items-center gap-2 text-lg">
                Bem vindo(a)
                <strong className="text-md ">{session?.user?.name}</strong>
              </h3>
              <div
                className="flex items-center gap-2 hover:opacity-60 transition-all hover:cursor-pointer"
                onClick={handleSignOut}
              >
                <Power size={28} className="text-gray-200" />
                <span className="text-gray-200">Deslogar</span>
              </div>
            </div>
            <Menu />
          </>
        )}
      </div>
    </div>
  );
}

export const getStaticProps: GetStaticProps = async () => {
  const [poolCountResponse, guessCountResponse] = await Promise.all([
    api.get("/pools/count"),
    api.get("/guesses/count"),
    // api.get("/users/count"),
  ]);

  return {
    props: {
      poolCount: poolCountResponse.data.count,
      guessCount: guessCountResponse.data.count,
      userCount: 1,
    },
    revalidate: 60,
  };
};
