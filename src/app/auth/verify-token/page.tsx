import VerifyToken from '@/components/verifyToken'
import { Suspense } from 'react'


export const dynamic = 'force-dynamic'
export const revalidate = 0

export default function Page () {
  return (
    <Suspense>
      <VerifyToken />
    </Suspense>
  )
}
