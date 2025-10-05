import { auth } from '@/auth'
import { redirect } from 'next/navigation'

const me = async () => {
  const session = await auth()
  if (!session) {
    return redirect('/signIn')
  } else {
    const user = session.user
    return redirect(`/journals/${user?.id}`)
  }
}

export default me