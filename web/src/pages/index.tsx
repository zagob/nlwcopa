import { GetServerSideProps, GetStaticProps } from "next";
import { signIn, useSession } from "next-auth/react";
import Image from "next/image";
import { FormEvent, useState } from "react";
import nlwPreview from "../assets/app-nlw-copa-preview.png";
import logoImg from "../assets/logo.svg";
import userAvatarImg from "../assets/users-avatar-example.png";
import { Divider } from "../components/Divider";
import { ShowUtilities } from "../components/ShowUtilities";
import { api } from "../services/axios";

interface HomeProps {
  poolCount: number;
  guessCount: number;
  userCount: number;
}

export default function Home({ guessCount, poolCount, userCount }: HomeProps) {
  const { data: session, status } = useSession();
  const [poolTitle, setPoolTitle] = useState("");

  console.log("d", session);

  async function handleCreatePool(event: FormEvent) {
    event.preventDefault();

    try {
      const response = await api.post("/pools", {
        title: poolTitle,
      });

      const { code } = response.data;

      navigator.clipboard.writeText(code);

      alert(
        "Bolão criado com sucesso, o código foi copiado para a área de transferência"
      );
      setPoolTitle("");
    } catch (err) {
      console.log(err);
      alert("Falha ao criar o bolão, tente novamente!");
    }
  }

  return (
    <div className="max-w-[1124px] h-screen mx-auto grid grid-cols-2 items-center gap-28">
      <main>
        <Image src={logoImg} quality={100} alt="NLW Copa" />

        <h1 className="mt-14 text-white text-5xl font-bold leading-tight">
          Crie seu próprio botão da copa e compartilhe entre amigos!
        </h1>
        <div className="mt-10 flex items-center gap-2">
          <Image src={userAvatarImg} quality={100} alt="" />

          <strong className="text-gray-100 text-xl">
            <span className="text-ignite-500">+{userCount} </span>
            pessoas já estão usando
          </strong>
        </div>

        <form
          onSubmit={handleCreatePool}
          className="mt-10 flex items-center gap-2"
        >
          <input
            type="text"
            required
            placeholder="Qual nome do seu bolão?"
            onChange={(event) => setPoolTitle(event.target.value)}
            value={poolTitle}
            className="flex-1 px-6 py-4 rounded text-gray-100 bg-gray-800 border border-gray-600 text-sm"
          />
          <button
            type="submit"
            className="bg-yellow-500 px-6 py-4 rounded font-bold uppercase text-gray-900 text-sm hover:bg-yellowHover-700"
          >
            Criar meu bolão
          </button>
          <button type="button" onClick={() => signIn()}>
            Login com Google
          </button>
        </form>
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

      <Image
        src={nlwPreview}
        quality={100}
        alt="Dois celulares exibindo uma pŕevida da aplicação"
      />
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
