import { useCallback, useEffect, useState } from "react";
import { VStack, Icon, useToast, FlatList } from "native-base";
import { Octicons } from "@expo/vector-icons";
import { useNavigation } from "@react-navigation/native";
import { useFocusEffect } from "@react-navigation/native";
import { api } from "../services/api";

import { Button } from "../components/Button";
import { Header } from "../components/Header";
import { PoolCard, ṔoolCardProps } from "../components/PoolCard";
import { Loading } from "../components/Loading";
import { EmptyPoolList } from "../components/EmptyPoolList";

export function Polls() {
  const { navigate } = useNavigation();
  const toast = useToast();

  const [isLoading, setIsLoading] = useState(true);
  const [polls, setPolls] = useState<ṔoolCardProps[]>([]);

  async function fetchPolls() {
    try {
      setIsLoading(true);
      const { data: responsePolls } = await api.get("/pools");

      setPolls(responsePolls.pools);
    } catch (err) {
      toast.show({
        title: "Não foi possivel carregar os bolões",
        placement: "top",
        bgColor: "red.500",
      });
    } finally {
      setIsLoading(false);
    }
  }

  useFocusEffect(
    useCallback(() => {
      fetchPolls();
    }, [])
  );

  return (
    <VStack flex={1} bgColor="gray.900">
      <Header title="Meus bolões" />

      <VStack
        mt={6}
        mx={5}
        borderBottomWidth={1}
        borderBottomColor="gray.600"
        pb={4}
        mb={4}
      >
        <Button
          title="Buscar bolão por código"
          leftIcon={
            <Icon as={Octicons} name="search" size="md" color="black" />
          }
          onPress={() => navigate("find")}
        />
      </VStack>

      {isLoading ? (
        <Loading />
      ) : (
        <FlatList
          data={polls}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => (
            <PoolCard
              data={item}
              onPress={() =>
                navigate("details", {
                  id: item.id,
                })
              }
            />
          )}
          px={5}
          showsVerticalScrollIndicator={false}
          _contentContainerStyle={{ pb: 10 }}
          ListEmptyComponent={() => <EmptyPoolList />}
        />
      )}
    </VStack>
  );
}
