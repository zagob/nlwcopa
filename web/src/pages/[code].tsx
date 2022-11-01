import { GetServerSideProps } from "next";
import { ParsedUrlQuery } from "querystring";
import { api } from "../services/axios";

interface CodeSuccessProps {
  code: string;
}

export default function CodeSuccess({ code }: CodeSuccessProps) {
  return <h1 className="text-gray-100">Codigo valido: {code} </h1>;
}

export const getServerSideProps: GetServerSideProps = async ({
  req,
  params,
}) => {
  const { code } = params as ParsedUrlQuery;
  const response = await api.get(`/pools/existCode/${code}`);

  if (!Boolean(response.data?.responsePoolExist)) {
    return {
      props: {},
      redirect: {
        destination: "/",
      },
    };
  }
  return {
    props: {
      code: response.data.responsePoolExist,
    },
  };
};
