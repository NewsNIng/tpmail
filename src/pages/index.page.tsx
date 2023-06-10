import { api } from "@/utils/api";
import dayjs from "dayjs";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";

function useHistoryEmail() {
  const [email, _setEmail] = useState("");

  const setEmail = (email: string) => {
    window.localStorage.setItem("tpmail", email);
    _setEmail(email);
  };

  useEffect(() => {
    const email = window.localStorage.getItem("tpmail");
    if (email) {
      _setEmail(email);
    }
  }, []);

  return {
    email,
    setEmail,
  };
}

export default function Page() {
  const router = useRouter();
  const { data: session, status } = useSession();
  const { email: historyEmail, setEmail: setHistoryEmail } = useHistoryEmail();

  const createApi = api.tempmail.create.useMutation({
    onSuccess(data) {
      if (data?.email) {
        setHistoryEmail(data.email);
      }
    },
  });

  const onGetEmail = () => {
    if (historyEmail) {
      alert("You already have an email");
    } else {
      createApi.mutate();
    }
  };

  const onLogin = () => {
    router.push("/api/auth/signin");
  };

  return (
    <div className="mx-auto max-w-3xl p-4">
      <h1 className="text-3xl font-bold">Temp Mail</h1>
      <p className="my-2 text-gray-600">
        This is a temporary email service. You can use it to sign up to
        websites.
      </p>

      {status === "unauthenticated" && (
        <>
          <div className="space-y-1">
            <button
              className="
        rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700
            "
              onClick={onLogin}
            >
              Login
            </button>
            <div>
              it{"'"}s <span className="font-bold text-green-600">free</span>
            </div>
          </div>
        </>
      )}

      {status === "authenticated" && (
        <>
          <button
            className="
        rounded bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700
      "
            onClick={onGetEmail}
          >
            Get a temp email
          </button>

          {createApi.isLoading && (
            <div className="mt-4">
              <div className="animate-pulse space-y-1">
                <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                <div className="h-4 w-2/3 rounded bg-gray-300"></div>
                <div className="h-4 w-1/3 rounded bg-gray-300"></div>
              </div>
            </div>
          )}

          {historyEmail && (
            <>
              <Emails />
              <Inbox />
            </>
          )}
        </>
      )}
    </div>
  );
}

function Emails() {
  // const { data, isLoading, refetch } = api.tempmail.list.useQuery();

  const { email } = useHistoryEmail();
  const [copied, setCopied] = useState(false);

  const onCopy = async () => {
    await navigator.clipboard.writeText(email);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 3000);
  };

  return (
    <div className="mt-8">
      <div className="text-xl">Email: </div>
      <div className="mt-1 inline-flex items-center space-x-2 rounded border p-4">
        <div className="text-sm md:text-xl">{email}</div>
        <div className="inline-flex space-x-2">
          <button
            className="rounded bg-green-500 px-2 py-1 text-xs font-bold text-white hover:bg-green-700 md:px-3 md:text-sm"
            onClick={onCopy}
          >
            {copied ? "Copied!" : "Copy"}
          </button>

          {/* <button className="rounded bg-blue-500 px-3 py-1 font-bold text-white hover:bg-blue-700">
            Inbox
          </button> */}
        </div>
      </div>
    </div>
  );
}

function Inbox() {
  const { email: historyEmail } = useHistoryEmail();

  const {
    data,
    refetch,
    isLoading: inboxLoading,
  } = api.tempmail.inbox.useQuery(
    {
      email: historyEmail,
    },
    {
      enabled: !!historyEmail,
    }
  );

  const inboxRefresh = api.tempmail.inboxRefresh.useMutation({
    onSuccess() {
      refetch();
    },
  });

  const onRefresh = () => {
    inboxRefresh.mutate({
      email: historyEmail,
    });
  };

  const isLoading = inboxLoading || inboxRefresh.isLoading;

  return (
    <div className="mt-8">
      <div className="inline-block text-sm text-red-400">
        Before clicking the refresh button, please make sure that an email has
        been sent to this mailbox.
      </div>
      <div className="mt-4 flex space-x-1">
        <span className="text-xl">Inbox:</span>

        <button
          onClick={onRefresh}
          className="rounded bg-yellow-500 px-2 py-1 text-sm font-bold text-white hover:bg-yellow-700"
        >
          Refresh
        </button>
      </div>
      <div className="mt-2 rounded border px-2 py-1">
        {isLoading ? (
          <>
            <div className="mt-1">
              <div className="animate-pulse space-y-1">
                <div className="h-4 w-1/2 rounded bg-gray-300"></div>
                <div className="h-4 w-2/3 rounded bg-gray-300"></div>
                <div className="h-4 w-1/3 rounded bg-gray-300"></div>
              </div>
            </div>
          </>
        ) : (
          <>
            {data && data.length > 0 ? (
              <ul className="px-2">
                {data?.map((item, index) => {
                  return (
                    <li
                      key={index}
                      className="
         border-b py-2 last:border-none
        "
                    >
                      <div className="flex items-center justify-between space-x-1">
                        <div className=" text-blue-400 hover:underline">
                          {item.from}
                        </div>
                        <div className="text-xs text-gray-400">
                          {dayjs(item.created_at).format("YYYY-MM-DD HH:mm:ss")}
                        </div>
                      </div>

                      <details className="mt-1">
                        <summary>{item.subject}</summary>
                        {item.body_html && (
                          <div
                            className="py-2"
                            dangerouslySetInnerHTML={{ __html: item.body_html }}
                          />
                        )}
                        {!item.body_html && item.body_text && (
                          <pre className="w-full overflow-x-auto">
                            {item.body_text}
                          </pre>
                        )}
                      </details>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <div className="text-sm text-gray-500">empty</div>
            )}
          </>
        )}
      </div>
    </div>
  );
}
