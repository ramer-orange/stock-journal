import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const me = async () => {
  const session = await auth()
  if (!session) {
    return redirect('/signIn')
  } else {
    return redirect(`/journals`)
  }
}

export default me