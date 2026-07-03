import React, { useMemo, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useRealtimeCollection from '../hooks/useRealtimeCollection'
import Layout from '../components/Layout/Layout'
import SimpleTable from '../components/Table/SimpleTable'
import StatusBadge from '../components/StatusBadge/StatusBadge'
import Modal from '../components/Modal/Modal'
import ConfirmModal from '../components/ConfirmModal/ConfirmModal'
import { createComplaint, updateComplaint, deleteComplaint } from '../services/complaintsService'
import { fmtDate } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

const categories = ['Internet','Electricity','Water','Maintenance','Cleaning','Security','Other']
const statusOptions = ['Submitted','In Progress','Resolved']

export default function ComplaintsPage(){
  const { user } = useAuth()
  const { addToast } = useToast()
  const { data: complaints = [], loading: loadingComplaints } = useRealtimeCollection('complaints')
  const { data: mine = [] } = useRealtimeCollection('complaints', user ? { whereClause: { field:'userId', op:'==', value:user.uid }} : undefined)
  const [form,setForm] = useState({ category:'Internet', description:'' })
  const [search,setSearch] = useState('')
  const [catFilter,setCatFilter] = useState('All')
  const [statusFilter,setStatusFilter] = useState('All')
  const [confirm,setConfirm] = useState({ show:false, id:null })
  const [selectedComplaint, setSelectedComplaint] = useState(null)
  const [saving, setSaving] = useState(false)

  const filtered = useMemo(() => {
    const term = search.trim().toLowerCase()
    return (complaints || []).filter(c => {
      if(catFilter !== 'All' && c.category !== catFilter) return false
      if(statusFilter !== 'All' && c.status !== statusFilter) return false
      if(term && !(c.description?.toLowerCase().includes(term) || c.category?.toLowerCase().includes(term))) return false
      return true
    })
  }, [complaints, catFilter, statusFilter, search])

  const submit = async e => {
    e.preventDefault()
    if(!form.description.trim()){
      addToast('Description is required', 'danger')
      return
    }
    try{
      setSaving(true)
      await createComplaint({ category: form.category, description: form.description.trim(), userId: user.uid })
      addToast('Complaint submitted', 'success')
      setForm({ category:'Internet', description:'' })
      setSearch('')
    }catch(err){
      console.error(err)
      addToast('Failed to submit complaint', 'danger')
    }finally{setSaving(false)}
  }

  const confirmDelete = id => setConfirm({ show:true, id })
  const doDelete = async () => {
    try{
      await deleteComplaint(confirm.id)
      addToast('Complaint deleted', 'success')
    }catch(err){
      console.error(err)
      addToast('Delete failed', 'danger')
    }finally{
      setConfirm({ show:false, id:null })
    }
  }

  const openEdit = complaint => setSelectedComplaint(complaint)
  const closeEdit = () => setSelectedComplaint(null)
  const saveEdit = async () => {
    if(!selectedComplaint?.description?.trim()){
      addToast('Description is required', 'danger')
      return
    }
    try{
      setSaving(true)
      await updateComplaint(selectedComplaint.id, { status: selectedComplaint.status, category: selectedComplaint.category, description: selectedComplaint.description.trim() })
      addToast('Complaint updated', 'success')
      closeEdit()
    }catch(err){
      console.error(err)
      addToast('Update failed', 'danger')
    }finally{setSaving(false)}
  }

  return (
    <Layout>
      <div className="row gy-4">
        <div className="col-12 col-xl-4">
          <div className="card card-custom p-4 rounded-16">
            <h5 className="mb-1 fw-bold">Submit a Complaint</h5>
            <p className="text-muted small mb-3">Report facilities or service issues quickly and keep track of progress.</p>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label fw-semibold">Category</label>
                <select className="form-select" value={form.category} onChange={e=>setForm({...form,category:e.target.value})}>
                  {categories.map(category => <option key={category} value={category}>{category}</option>)}
                </select>
              </div>
              <div className="mb-3">
                <label className="form-label fw-semibold">Description</label>
                <textarea className="form-control" rows={5} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the issue" required />
              </div>
              <button className="btn btn-primary w-100" disabled={saving}>{saving ? 'Sending...' : 'Submit Complaint'}</button>
            </form>
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <div className="card card-custom p-4 rounded-16 mb-4">
            <div className="d-flex flex-column flex-md-row align-items-start align-items-md-center justify-content-between gap-3">
              <div>
                <h5 className="mb-1 fw-bold">Complaints</h5>
                <p className="text-muted small mb-0">Realtime complaints report with filters and management tools.</p>
              </div>
              <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
                <input className="form-control search-input" placeholder="Search complaints" value={search} onChange={e=>setSearch(e.target.value)} />
                <button className="btn btn-outline-primary" type="button" onClick={()=>setSearch('')}>Clear</button>
              </div>
            </div>
            <div className="row g-3 mt-3">
              <div className="col-6 col-md-4">
                <select className="form-select" value={catFilter} onChange={e=>setCatFilter(e.target.value)}>
                  <option>All</option>
                  {categories.map(category => <option key={category}>{category}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-4">
                <select className="form-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                  <option>All</option>
                  {statusOptions.map(status => <option key={status}>{status}</option>)}
                </select>
              </div>
            </div>
          </div>

          {loadingComplaints ? (
            <div className="row g-3">
              {[...Array(3)].map((_, idx)=>(<div className="col-12" key={idx}><div className="skeleton" style={{height:120}} /></div>))}
            </div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">No complaints found. Submit a complaint to begin tracking progress.</div>
          ) : (
            <SimpleTable
              columns={[{key:'category',label:'Category'},{key:'status',label:'Status'},{key:'createdAt',label:'Created'}]}
              rows={filtered.map(item=>({ ...item, createdAt: fmtDate(item.createdAt) }))}
              actions={[{ label:'Edit', onClick: r=>openEdit(r) }, { label:'Delete', onClick: r=>confirmDelete(r.id) }]}
            />
          )}

          <div className="mt-4">
            <h6>My Complaints</h6>
            {mine.length === 0 ? (
              <div className="empty-state">You have not submitted any complaints yet.</div>
            ) : (
              <div className="row g-3">
                {mine.map(c => (
                  <div className="col-12" key={c.id}>
                    <div className="card card-custom p-3 rounded-16 d-flex flex-column flex-md-row justify-content-between gap-3">
                      <div>
                        <div className="fw-bold">{c.category}</div>
                        <div className="small text-muted mt-1">{c.description}</div>
                        <div className="small text-muted mt-2">{fmtDate(c.createdAt)}</div>
                      </div>
                      <div className="text-end">
                        <StatusBadge status={c.status} />
                        <div className="mt-3 d-flex justify-content-end flex-wrap gap-2">
                          <button className="btn btn-sm btn-outline-secondary" onClick={()=>updateComplaint(c.id,{status:'In Progress'})}>In Progress</button>
                          <button className="btn btn-sm btn-outline-success" onClick={()=>updateComplaint(c.id,{status:'Resolved'})}>Resolve</button>
                          <button className="btn btn-sm btn-outline-danger" onClick={()=>confirmDelete(c.id)}>Delete</button>
                        </div>
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
        show={!!selectedComplaint}
        title="Edit Complaint"
        onClose={closeEdit}
        footer={
          <>
            <button className="btn btn-secondary" onClick={closeEdit}>Cancel</button>
            <button className="btn btn-primary" onClick={saveEdit} disabled={saving}>{saving ? 'Saving...' : 'Save Changes'}</button>
          </>
        }
      >
        {selectedComplaint && (
          <div>
            <div className="mb-3">
              <label className="form-label">Category</label>
              <select className="form-select" value={selectedComplaint.category} onChange={e=>setSelectedComplaint({...selectedComplaint,category:e.target.value})}>
                {categories.map(cat => <option key={cat}>{cat}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Status</label>
              <select className="form-select" value={selectedComplaint.status} onChange={e=>setSelectedComplaint({...selectedComplaint,status:e.target.value})}>
                {statusOptions.map(status => <option key={status}>{status}</option>)}
              </select>
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={5} value={selectedComplaint.description} onChange={e=>setSelectedComplaint({...selectedComplaint,description:e.target.value})} />
            </div>
          </div>
        )}
      </Modal>

      <ConfirmModal show={confirm.show} title="Delete Complaint" body="Delete this complaint permanently?" onConfirm={doDelete} onCancel={()=>setConfirm({show:false,id:null})} />
    </Layout>
  )
}
