import { api } from "@/utils/api";
import { useRouter } from "next/router";

export default function TempMailDetail() {
  const router = useRouter();
  const { email } = router.query as { email: string };

  const { data, refetch } = api.tempmail.inbox.useQuery(
    {
      email,
    },
    {
      enabled: !!email,
    }
  );

  const inboxRefetch = api.tempmail.inboxRefresh.useMutation({
    onSuccess() {
      refetch();
    },
  });
  return (
    <div>
      <button onClick={() => router.back()}>back</button>
      <h1>{email}</h1>
      <p>Inbox</p>
      <button
        onClick={() =>
          inboxRefetch.mutate({
            email,
          })
        }
      >
        refresh
      </button>
      <ul>
        {data?.map((item, index) => {
          return (
            <li key={index}>
              <pre>{JSON.stringify(item, null, 2)}</pre>
              <div>{item.body_text}</div>
              <div>from: {item.from}</div>
            </li>
          );
        })}
      </ul>
    </div>
  );
}
