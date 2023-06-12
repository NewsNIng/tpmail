import Image from 'next/image'
import { useEffect, useState } from 'react'
import dayjs from 'dayjs'

import { api } from '@/utils/api'
import { getBrowserId } from '@/helper/fingerprint'

export default function Page() {
  return (
    <div className='bg-red-200 min-h-[100vh]'>
      <Image
        className='z-0 blur-[3px] fixed inset-0'
        src='/home_bg.png'
        alt='bg'
        fill
        style={{
          objectFit: 'cover',
        }}
      />
      <div className='relative z-10 px-4 py-20 min-h-[78vh] overflow-y-auto flex flex-col items-center justify-center'>
        <h1 className='text-white text-5xl leading-[60px] lg:text-[64px] lg:leading-[84px]'>
          Get Your <span className=''>Temporary</span>{' '}
          <span
            className='font-bold'
            style={{
              // 彩色 渐变
              background: 'linear-gradient(45deg, #03a9f4 30%, #ffeb3b 90%)',
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
            }}
          >
            Email
          </span>
        </h1>
        <p
          className='mt-4 text-gray-100 text-lg'
          style={{
            textShadow: '4px 4px 8px #000000',
          }}
        >
          This is a temporary email service. You can use it to sign up to
          websites.
        </p>

        <GetEmail />
        <EmailBox />
      </div>
    </div>
  )
}

function Loading({ className }: { className?: string }) {
  return (
    <div className={className}>
      <div className='animate-pulse space-y-1'>
        <div className='h-4 w-1/2 rounded bg-gray-500' />
        <div className='h-4 w-2/3 rounded bg-gray-500' />
        <div className='h-4 w-1/3 rounded bg-gray-500' />
      </div>
    </div>
  )
}

function useDeviceId() {
  const [deviceId, setDeviceId] = useState<string>('')
  useEffect(() => {
    getBrowserId().then((id) => {
      setDeviceId(id)
    })
  }, [])

  return deviceId
}

function GetEmail() {
  const deviceId = useDeviceId()
  // list emails
  const { data: emails, refetch } = api.tempmail.anonymousList.useQuery(
    {
      deviceId,
    },
    {
      enabled: Boolean(deviceId),
    },
  )

  const email = emails?.[0]?.email
  const hasEmail = Boolean(email)

  // create email
  const createApi = api.tempmail.anonymousCreate.useMutation({
    onSettled() {
      refetch()
    },
  })

  const onGetEmail = async () => {
    if (hasEmail) {
      alert('You already have an email')
    } else {
      createApi.mutate({
        deviceId,
      })
    }
  }

  // email generating
  const isLoading = createApi.isLoading

  return (
    <div className='mt-12'>
      <button
        className={`
        rounded bg-blue-500 px-8 py-2 text-xl font-bold text-white hover:bg-blue-700
        ${isLoading ? 'opacity-50 cursor-not-allowed' : ''}
        `}
        onClick={onGetEmail}
      >
        Get Now
      </button>
    </div>
  )
}

function EmailBox() {
  const deviceId = useDeviceId()
  // list emails
  const { data: emails, refetch } = api.tempmail.anonymousList.useQuery(
    {
      deviceId,
    },
    {
      enabled: Boolean(deviceId),
    },
  )

  const email = emails?.[0]?.email ?? ''
  const hasEmail = Boolean(email)

  if (!hasEmail) {
    return null
  }

  return (
    <>
      <TempEmail email={email} />
      <InboxEmail email={email} />
    </>
  )
}

function TempEmail({ email = '' }: { email?: string }) {
  const hasEmail = Boolean(email)

  const [copied, setCopied] = useState(false)

  const onCopy = async () => {
    await navigator.clipboard.writeText(email)
    setCopied(true)
    setTimeout(() => {
      setCopied(false)
    }, 3000)
  }

  if (!hasEmail) {
    return null
  }

  return (
    <>
      <div
        className='mt-12 w-full max-w-2xl rounded'
        style={{
          background: 'rgba(255,255,255,0.7)',
        }}
      >
        <div className='px-4 py-3 space-y-2'>
          <div className='w-full text-2xl break-all'>{email}</div>
          <div>
            <button
              className='rounded bg-green-500 py-1 font-bold text-white hover:bg-green-700 w-20 text-sm'
              onClick={onCopy}
            >
              {copied ? 'Copied!' : 'Copy'}
            </button>
          </div>
        </div>
      </div>
    </>
  )
}

function InboxEmail({ email = '' }: { email?: string }) {
  const deviceId = useDeviceId()
  const {
    data,
    refetch,
    isLoading: inboxLoading,
  } = api.tempmail.anonymousInbox.useQuery(
    { deviceId, email },
    {
      enabled: !!deviceId && !!email,
    },
  )

  const inboxRefresh = api.tempmail.anonymousInboxRefresh.useMutation({
    onSuccess() {
      refetch()
    },
  })

  const onRefresh = () => {
    inboxRefresh.mutate({
      deviceId,
      email,
    })
  }

  const isLoading = inboxLoading || inboxRefresh.isLoading

  return (
    <>
      <div
        className='mt-4 max-w-2xl text-sm text-white'
        style={{
          textShadow: '0 1px red, 1px 0 red, -1px 0 red, 0 -1px red',
        }}
      >
        Before clicking the refresh button, please make sure that an email has
        been sent to this mailbox.
      </div>
      <div
        className='mt-4 w-full max-w-2xl rounded'
        style={{
          background: 'rgba(255,255,255,0.7)',
        }}
      >
        <div className='p-4'>
          <button
            onClick={onRefresh}
            className='rounded bg-yellow-500 py-1 text-sm font-bold text-white w-20 hover:bg-yellow-700'
          >
            Refresh
          </button>
          <div>
            <div className='mt-2 rounded border border-gray-500 px-2 py-1 bg-white'>
              {isLoading ? (
                <Loading className='mt-1' />
              ) : (
                <>
                  {data && data.length > 0 ? (
                    <ul className='px-2'>
                      {data?.map((item, index) => {
                        return (
                          <li
                            key={index}
                            className='border-b py-2 last:border-none'
                          >
                            <div className='flex items-center justify-between space-x-1'>
                              <div className=' text-blue-400 hover:underline'>
                                {item.from}
                              </div>
                              <div className='text-xs text-gray-400'>
                                {dayjs(item.created_at).format(
                                  'YYYY-MM-DD HH:mm:ss',
                                )}
                              </div>
                            </div>

                            <details className='mt-1'>
                              <summary>{item.subject}</summary>
                              {item.body_html && (
                                <div
                                  className='py-2'
                                  dangerouslySetInnerHTML={{
                                    __html: item.body_html,
                                  }}
                                />
                              )}
                              {!item.body_html && item.body_text && (
                                <pre className='w-full overflow-x-auto'>
                                  {item.body_text}
                                </pre>
                              )}
                            </details>
                          </li>
                        )
                      })}
                    </ul>
                  ) : (
                    <div className='text-sm text-gray-700 h-14'>empty</div>
                  )}
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </>
  )
}
