import React from 'react'
import api from '../services/api'

export default function Billing(){
  async function subscribe(plan){
    const { data } = await api.post('/api/billing/checkout', { plan })
    if(data?.url) window.location.href = data.url
    else alert(data?.error || 'Erro no checkout')
  }
  return (
    <div className="card">
      <h2>Assinaturas</h2>
      <div className="row">
        <button className="btn" onClick={()=>subscribe('starter')}>Starter</button>
        <button className="btn" onClick={()=>subscribe('pro')}>Pro</button>
        <button className="btn" onClick={()=>subscribe('agency')}>Agency</button>
      </div>
    </div>
  )
}
