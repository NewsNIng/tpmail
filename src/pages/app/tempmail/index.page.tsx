import { api } from "@/utils/api";
import { useRouter } from "next/router";

export default function TempMailApp() {
  const router = useRouter();
  const { data, isLoading, refetch } = api.tempmail.list.useQuery();

  const createApi = api.tempmail.create.useMutation({
    onSuccess() {
      refetch();
    },
  });

  const onCreate = () => {
    createApi.mutate();
  };

  const onEmailClick = (item: NonNullable<typeof data>[0]) => {
    router.push(`/app/tempmail/${item.email}`);
  };

  return (
    <>
      <h1>Temp Mail</h1>
      <button onClick={onCreate}>Create</button>
      <ul className="">
        {data?.map((item) => {
          return (
            <li
              className=""
              key={item.id}
              onClick={() => onEmailClick(item)}
            >
              <div className="">
              {item.email}
              </div>
              
            </li>
          );
        })}
      </ul>
    </>
  );
}
