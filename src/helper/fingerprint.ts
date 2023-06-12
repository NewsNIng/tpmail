import Fingerprint2 from 'fingerprintjs2'

async function createFingerprint() {
  return new Promise<string>((resolve) => {
    Fingerprint2.get((components) => {
      const values = components.map((component) => component.value)
      const murmur = Fingerprint2.x64hash128(values.join(''), 31)
      resolve(murmur)
    })
  })
}

let browserId = ''

async function loadBrowserId() {
  browserId = localStorage.getItem('browserId') || ''
  if (!browserId) {
    browserId = await createFingerprint()
  }
}

export const getBrowserId = async () => {
  if (!browserId) {
    await loadBrowserId()
  }
  return browserId
}
