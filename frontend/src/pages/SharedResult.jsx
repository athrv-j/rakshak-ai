import { useEffect, useState } from 'react'
import { useParams } from 'react-router-dom'
import axios from 'axios'
import TrustPassport from './TrustPassport'

const API = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function SharedResult() {
  const { id } = useParams()
  const [data, setData] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    axios.get(`${API}/result/${id}`)
      .then(r => { setData(r.data); setLoading(false) })
      .catch(() => setLoading(false))
  }, [id])

  if (loading) return (
    <div className="min-h-screen flex items-center justify-center text-stone-600 bg-[#faf8f5] font-medium">
      Loading shared report…
    </div>
  )
  if (!data) return (
    <div className="min-h-screen flex items-center justify-center text-stone-500 bg-[#faf8f5]">
      Shared report not found.
    </div>
  )
  return <TrustPassport />
}
