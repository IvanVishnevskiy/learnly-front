export default async (path = '', params = {}, shouldDropWithoutSession = true ) => {
  const session = localStorage.getItem('session')
  if(!session && shouldDropWithoutSession) return { error: 100, errorname: 'Нет сессии' }
  const { body = {} } = params
  if(typeof body === 'string') throw new Error('Body should be an object, not a string.')
  if(!path) throw new Error('You should provide authFetch with path to fetch from.')

  const req = await fetch('https://forgetable.ru/api/' + path, {
    ...params, 
    credentials: 'include',
    method: 'POST',
    body: JSON.stringify({
      ...body,
      _session: session
    })
  })
  
  return await req.json()
}