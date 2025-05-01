'use client'

import { useState, useEffect } from 'react'

interface Coupon {
  id: number
  code: string
  end_date: string
}

export default function CouponAdmin() {
  const [coupons, setCoupons] = useState<Coupon[]>([])
  const [newCoupon, setNewCoupon] = useState<Partial<Coupon>>({})
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    fetchCoupons()
  }, [])

  const fetchCoupons = async () => {
    try {
      const response = await fetch('/api/admin/coupons')
      const data = await response.json()
      setCoupons(data)
    } catch (error) {
      console.error('Failed to fetch coupons:', error)
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)

    try {
      const response = await fetch('/api/admin/coupons', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          code: newCoupon.code,
          title: '쿠폰',
          description: '게임 내 쿠폰 입력창에서 등록해주세요.',
          start_date: new Date().toISOString().split('T')[0],
          end_date: newCoupon.end_date
        }),
      })

      if (response.ok) {
        setNewCoupon({})
        fetchCoupons()
      }
    } catch (error) {
      console.error('Failed to create coupon:', error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('정말로 이 쿠폰을 삭제하시겠습니까?')) return

    try {
      const response = await fetch(`/api/admin/coupons/${id}`, {
        method: 'DELETE',
      })

      if (response.ok) {
        fetchCoupons()
      }
    } catch (error) {
      console.error('Failed to delete coupon:', error)
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">쿠폰 관리</h1>
      
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium mb-1">쿠폰 코드</label>
            <input
              type="text"
              value={newCoupon.code || ''}
              onChange={(e) => setNewCoupon({ ...newCoupon, code: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium mb-1">종료일</label>
            <input
              type="date"
              value={newCoupon.end_date || ''}
              onChange={(e) => setNewCoupon({ ...newCoupon, end_date: e.target.value })}
              className="w-full p-2 border rounded"
              required
            />
          </div>
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {isLoading ? '추가 중...' : '쿠폰 추가'}
        </button>
      </form>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-transparent">
          <thead>
            <tr>
              <th className="px-6 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">코드</th>
              <th className="px-6 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">종료일</th>
              <th className="px-6 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">상태</th>
              <th className="px-6 py-3 border-b-2 border-gray-700 text-left text-xs font-semibold text-gray-300 uppercase tracking-wider">관리</th>
            </tr>
          </thead>
          <tbody>
            {coupons
              .sort((a, b) => new Date(a.end_date).getTime() - new Date(b.end_date).getTime())
              .map((coupon) => (
              <tr key={coupon.id}>
                <td className="px-6 py-4 border-b border-gray-700 text-gray-200 whitespace-nowrap overflow-hidden text-ellipsis max-w-[300px]">{coupon.code}</td>
                <td className="px-6 py-4 border-b border-gray-700 text-gray-200">{coupon.end_date}</td>
                <td className="px-6 py-4 border-b border-gray-700 text-gray-200">
                  {new Date(coupon.end_date) < new Date() ? '만료' : '활성'}
                </td>
                <td className="px-6 py-4 border-b border-gray-700">
                  <button
                    onClick={() => handleDelete(coupon.id)}
                    className="text-red-500 hover:text-red-700"
                  >
                    삭제
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  )
} 