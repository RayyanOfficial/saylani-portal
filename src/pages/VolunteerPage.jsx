import React, { useMemo, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useRealtimeCollection from '../hooks/useRealtimeCollection'
import Layout from '../components/Layout/Layout'
import Modal from '../components/Modal/Modal'
import ConfirmModal from '../components/ConfirmModal/ConfirmModal'
import { createVolunteer, updateVolunteer, deleteVolunteer } from '../services/volunteersService'
import { fmtDate } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

export default function VolunteerPage(){
  const { user } = useAuth()
  const { addToast } = useToast()
  const { data: list = [], loading: loadingVolunteers } = useRealtimeCollection('volunteers')
  const { data: mine = [] } = useRealtimeCollection('volunteers', user ? { whereClause: { field:'userId', op:'==', value:user.uid }} : undefined)
  const [form,setForm] = useState({ name:'', phone:'', event:'', availability:'', reason:'' })
  const [search,setSearch] = useState('')
  const [selected, setSelected] = useState(null)
  const [saving, setSaving] = useState(false)
  const [confirm, setConfirm] = useState({ show:false, id:null })

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (list || []).filter(item => {
      if(!term) return true
      return item.name?.toLowerCase().includes(term)
        || item.event?.toLowerCase().includes(term)
        || item.availability?.toLowerCase().includes(term)
    })
  }, [list, search])

  const submit = async e => {
    e.preventDefault()
    if(!form.name.trim() || !form.event.trim()){
      addToast('Name and event are required', 'danger')
      return
    }
    try{
      setSaving(true)
      await createVolunteer({ ...form, userId: user.uid, email: user.email, createdAt: new Date() })
      addToast('Volunteer registration successful', 'success')
      setForm({ name:'', phone:'', event:'', availability:'', reason:'' })
    }catch(err){
      console.error(err)
      addToast('Registration failed', 'danger')
    }finally{setSaving(false)}
  }

  const openEdit = item => setSelected(item)
  const closeEdit = () => setSelected(null)

  const saveEdit = async () => {
    if(!selected.name.trim() || !selected.event.trim()){
      addToast('Name and event are required', 'danger')
      return
    }
    try{
      setSaving(true)
      await updateVolunteer(selected.id, {
        name: selected.name.trim(),
        phone: selected.phone.trim(),
        event: selected.event.trim(),
        availability: selected.availability.trim(),
        reason: selected.reason.trim()
      })
      addToast('Registration updated', 'success')
      closeEdit()
    }catch(err){
      console.error(err)
      addToast('Update failed', 'danger')
    }finally{setSaving(false)}
  }

  const confirmDelete = id => setConfirm({ show:true, id })
  const doDelete = async () => {
    try{
      await deleteVolunteer(confirm.id)
      addToast('Registration deleted', 'success')
    }catch(err){
      console.error(err)
      addToast('Delete failed', 'danger')
    }finally{
      setConfirm({ show:false, id:null })
    }
  }

  return (
    <Layout>
      <div className="row gy-4">
        <div className="col-12 col-xl-4">
          <div className="card card-custom p-4 rounded-16">
            <h5 className="mb-1 fw-bold">Volunteer Registration</h5>
            <p className="text-muted small mb-3">Join community initiatives and help make events successful.</p>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Name</label>
                <input className="form-control" value={form.name} onChange={e=>setForm({...form,name:e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input className="form-control" value={form.phone} onChange={e=>setForm({...form,phone:e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Event</label>
                <input className="form-control" value={form.event} onChange={e=>setForm({...form,event:e.target.value})} required />
              </div>
              <div className="mb-3">
                <label className="form-label">Availability</label>
                <input className="form-control" value={form.availability} onChange={e=>setForm({...form,availability:e.target.value})} />
              </div>
              <div className="mb-3">
                <label className="form-label">Reason for volunteering</label>
                <textarea className="form-control" rows={3} value={form.reason} onChange={e=>setForm({...form,reason:e.target.value})} />
              </div>
              <button className="btn btn-primary w-100" type="submit" disabled={saving}>{saving ? 'Registering...' : 'Register'}</button>
            </form>
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <div className="card card-custom p-4 rounded-16 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h5 className="mb-1 fw-bold">Volunteer Registrations</h5>
                <p className="text-muted small mb-0">Manage sign-ups and keep the volunteer roster up to date.</p>
              </div>
              <div className="d-flex gap-2 w-100 w-md-auto">
                <input className="form-control search-input" placeholder="Search name or event" value={search} onChange={e=>setSearch(e.target.value)} />
                <button className="btn btn-outline-primary" type="button" onClick={()=>setSearch('')}>Clear</button>
              </div>
            </div>
          </div>

          {loadingVolunteers ? (
            <div className="row g-3">
              {[...Array(4)].map((_, idx)=>(<div className="col-12 col-md-6" key={idx}><div className="skeleton" style={{height:160}} /></div>))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No volunteer registrations found yet.</div>
          ) : (
            <div className="row g-3">
              {filtered.map(item => (
                <div className="col-12 col-md-6" key={item.id}>
                  <div className="card card-custom p-3 rounded-16 h-100">
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <div className="fw-bold">{item.name}</div>
                        <div className="small text-muted">{item.event} • {item.availability}</div>
                      </div>
                      <span className={`badge ${item.approved ? 'bg-success' : 'bg-secondary'}`}>{item.approved ? 'Approved' : 'Pending'}</span>
                    </div>
                    <div className="small text-muted mb-3">{fmtDate(item.createdAt)}</div>
                    <div className="d-flex justify-content-between gap-2 flex-wrap">
                      <button className="btn btn-sm btn-outline-primary" onClick={()=>openEdit(item)}>Edit</button>
                      <button className="btn btn-sm btn-outline-danger" onClick={()=>confirmDelete(item.id)}>Delete</button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          <div className="mt-4">
            <h6>My Registrations</h6>
            {mine.length === 0 ? (
              <div className="empty-state">You haven't registered for any volunteer event yet.</div>
            ) : (
              <div className="row g-3">
                {mine.map(item => (
                  <div className="col-12" key={item.id}>
                    <div className="card card-custom p-3 rounded-16 d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div>
                        <div className="fw-bold">{item.event}</div>
                        <div className="small text-muted mt-1">{item.availability}</div>
                        <div className="small text-muted mt-1">{fmtDate(item.createdAt)}</div>
                      </div>
                      <div className="d-flex gap-2 flex-wrap justify-content-end">
                        <button className="btn btn-sm btn-outline-secondary" onClick={()=>openEdit(item)}>Edit</button>
                        <button className="btn btn-sm btn-outline-danger" onClick={()=>confirmDelete(item.id)}>Delete</button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      <Modal
        show={!!selected}
        title="Update Registration"
        onClose={closeEdit}
        footer={
          <>
            <button className="btn btn-secondary" onClick={closeEdit}>Cancel</button>
            <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </>
        }
      >
        {selected && (
          <div>
            <div className="mb-3">
              <label className="form-label">Name</label>
              <input className="form-control" value={selected.name} onChange={e=>setSelected({...selected,name:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Phone</label>
              <input className="form-control" value={selected.phone} onChange={e=>setSelected({...selected,phone:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Event</label>
              <input className="form-control" value={selected.event} onChange={e=>setSelected({...selected,event:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Availability</label>
              <input className="form-control" value={selected.availability} onChange={e=>setSelected({...selected,availability:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Reason</label>
              <textarea className="form-control" rows={3} value={selected.reason} onChange={e=>setSelected({...selected,reason:e.target.value})} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal show={confirm.show} title="Delete Registration" body="Delete this volunteer registration?" onConfirm={doDelete} onCancel={()=>setConfirm({show:false,id:null})} />
    </Layout>
  )
}
