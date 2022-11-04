import { useRoute } from "@react-navigation/native";
import { HStack, useToast, VStack } from "native-base";
import { Share } from "react-native";
import { useEffect, useState } from "react";

import { api } from "../services/api";

import { Header } from "../components/Header";
import { Loading } from "../components/Loading";
import { ṔoolCardProps } from "../components/PoolCard";
import { PoolHeader } from "../components/PoolHeader";
import { EmptyMyPoolList } from "../components/EmptyMyPoolList";
import { Option } from "../components/Option";
import { Guesses } from "../components/Guesses";

interface RouteParams {
  id: string;
}

export function Details() {
  const routes = useRoute();
  const toast = useToast();
  const [optionSelected, setOptionSelected] = useState<"guesses" | "racking">(
    "guesses"
  );
  const [isLoading, setIsLoading] = useState(true);
  const [pollDetail, setPollDetail] = useState<ṔoolCardProps>(
    {} as ṔoolCardProps
  );

  const { id } = routes.params as RouteParams;

  async function fetchPollDetails() {
    try {
      setIsLoading(true);

      const { data: responsePoll } = await api.get(`/pools/${id}`);
      setPollDetail(responsePoll.pool);
    } catch (err) {
      toast.show({
        title: "Não foi possível carregar os detalhes do bolão.",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(true);
    }
  }

  async function handleCodeShare() {
    await Share.share({
      message: pollDetail.code,
    });
  }

  useEffect(() => {
    fetchPollDetails();
  }, [id]);

  if (isLoading) {
    return <Loading />;
  }

  return (
    <VStack flex={1} bg="gray.900">
      <Header
        title={pollDetail.title}
        showBackButton
        showShareButton
        onShare={handleCodeShare}
      />

      {pollDetail._count?.participants > 0 ? (
        <VStack px={5} flex={1}>
          <PoolHeader data={pollDetail} />

          <HStack bgColor="gray.800" p={1} rounded="sm" mb={5}>
            <Option
              title="Seus palpites"
              isSelected={optionSelected === "guesses"}
              onPress={() => setOptionSelected("guesses")}
            />
            <Option
              title="Ranking do grupo"
              isSelected={optionSelected === "racking"}
              onPress={() => setOptionSelected("racking")}
            />
          </HStack>

          <Guesses poolId={pollDetail.id} code={pollDetail.code} />
        </VStack>
      ) : (
        <EmptyMyPoolList code={pollDetail.code} />
      )}
    </VStack>
  );
}
