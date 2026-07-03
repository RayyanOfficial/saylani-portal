import React, { useMemo, useState } from 'react'
import useRealtimeCollection from '../hooks/useRealtimeCollection'
import Layout from '../components/Layout/Layout'
import SimpleTable from '../components/Table/SimpleTable'
import Modal from '../components/Modal/Modal'
import ConfirmModal from '../components/ConfirmModal/ConfirmModal'
import { updateItem, deleteItem } from '../services/lostFoundService'
import { updateComplaint, deleteComplaint } from '../services/complaintsService'
import { updateVolunteer, deleteVolunteer } from '../services/volunteersService'
import { fmtDate } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

export default function AdminPage(){
  const { addToast } = useToast()
  const { data: users = [] } = useRealtimeCollection('users')
  const { data: lost = [] } = useRealtimeCollection('lost_found_items')
  const { data: complaints = [] } = useRealtimeCollection('complaints')
  const { data: vols = [] } = useRealtimeCollection('volunteers')
  const { data: notifications = [] } = useRealtimeCollection('notifications')

  const [searchUsers, setSearchUsers] = useState('')
  const [searchLost, setSearchLost] = useState('')
  const [searchComplaints, setSearchComplaints] = useState('')
  const [searchVols, setSearchVols] = useState('')
  const [confirm, setConfirm] = useState({ show:false, type:'', id:null })
  const [deleteTarget, setDeleteTarget] = useState(null)

  const filteredUsers = useMemo(() => {
    const term = searchUsers.trim().toLowerCase()
    return (users || []).filter(u => !term || u.name?.toLowerCase().includes(term) || u.email?.toLowerCase().includes(term) || u.role?.toLowerCase().includes(term))
  }, [users, searchUsers])

  const filteredLost = useMemo(() => {
    const term = searchLost.trim().toLowerCase()
    return (lost || []).filter(item => !term || item.title?.toLowerCase().includes(term) || item.type?.toLowerCase().includes(term) || item.status?.toLowerCase().includes(term))
  }, [lost, searchLost])

  const filteredComplaints = useMemo(() => {
    const term = searchComplaints.trim().toLowerCase()
    return (complaints || []).filter(item => !term || item.category?.toLowerCase().includes(term) || item.status?.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term))
  }, [complaints, searchComplaints])

  const filteredVols = useMemo(() => {
    const term = searchVols.trim().toLowerCase()
    return (vols || []).filter(item => !term || item.name?.toLowerCase().includes(term) || item.event?.toLowerCase().includes(term) || item.email?.toLowerCase().includes(term))
  }, [vols, searchVols])

  const performDelete = async () => {
    try{
      if(deleteTarget?.type === 'lost') await deleteItem(deleteTarget.id)
      if(deleteTarget?.type === 'complaint') await deleteComplaint(deleteTarget.id)
      if(deleteTarget?.type === 'volunteer') await deleteVolunteer(deleteTarget.id)
      addToast('Record removed successfully', 'success')
    }catch(err){
      console.error(err)
      addToast('Delete action failed', 'danger')
    }finally{
      setConfirm({ show:false, type:'', id:null })
      setDeleteTarget(null)
    }
  }

  const requestDelete = (type, id) => {
    setDeleteTarget({ type, id })
    setConfirm({ show:true, type, id })
  }

  const handleLostAction = async (id, status) => {
    try{
      await updateItem(id, { status })
      addToast('Lost/found status updated', 'success')
    }catch(err){
      console.error(err)
      addToast('Unable to update status', 'danger')
    }
  }

  const handleComplaintAction = async (id, status) => {
    try{
      await updateComplaint(id, { status })
      addToast('Complaint status updated', 'success')
    }catch(err){
      console.error(err)
      addToast('Unable to update complaint', 'danger')
    }
  }

  const handleVolunteerApprove = async id => {
    try{
      await updateVolunteer(id, { approved:true })
      addToast('Volunteer approved', 'success')
    }catch(err){
      console.error(err)
      addToast('Approval failed', 'danger')
    }
  }

  return (
    <Layout>
      <div className="mb-4">
        <h4 className="fw-bold">Admin Dashboard</h4>
        <p className="text-muted small mb-0">Manage users, reports, lost items, and volunteer registrations in one place.</p>
      </div>

      <div className="row g-3 mb-4">
        <div className="col-6 col-md-3">
          <div className="card card-custom p-3 rounded-16">
            <div className="text-muted small fw-semibold">Users</div>
            <div className="h4 mt-2 fw-bold">{users.length}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-custom p-3 rounded-16">
            <div className="text-muted small fw-semibold">Lost & Found</div>
            <div className="h4 mt-2 fw-bold">{lost.length}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-custom p-3 rounded-16">
            <div className="text-muted small fw-semibold">Complaints</div>
            <div className="h4 mt-2 fw-bold">{complaints.length}</div>
          </div>
        </div>
        <div className="col-6 col-md-3">
          <div className="card card-custom p-3 rounded-16">
            <div className="text-muted small fw-semibold">Volunteer signups</div>
            <div className="h4 mt-2 fw-bold">{vols.length}</div>
          </div>
        </div>
      </div>

      <div className="row gy-4">
        <div className="col-12">
          <div className="card card-custom p-4 rounded-16">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
              <div>
                <h5 className="mb-1">Users</h5>
                <p className="text-muted small mb-0">Registered students and staff profiles.</p>
              </div>
              <div className="d-flex gap-2 w-100 w-md-auto">
                <input className="form-control search-input" placeholder="Search users" value={searchUsers} onChange={e=>setSearchUsers(e.target.value)} />
              </div>
            </div>
            <SimpleTable columns={[{key:'name',label:'Name'},{key:'email',label:'Email'},{key:'role',label:'Role'},{key:'createdAt',label:'Created'}]} rows={filteredUsers.map(u=>({ id: u.uid || u.id, name:u.name, email:u.email, role:u.role || 'student', createdAt: u.createdAt && u.createdAt.toDate ? u.createdAt.toDate().toLocaleString() : (u.createdAt ? new Date(u.createdAt).toLocaleString() : '') }))} />
          </div>
        </div>

        <div className="col-12">
          <div className="card card-custom p-4 rounded-16">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
              <div>
                <h5 className="mb-1">Lost & Found</h5>
                <p className="text-muted small mb-0">Manage item statuses and remove outdated records.</p>
              </div>
              <div className="d-flex gap-2 w-100 w-md-auto">
                <input className="form-control search-input" placeholder="Search lost items" value={searchLost} onChange={e=>setSearchLost(e.target.value)} />
              </div>
            </div>
            <SimpleTable columns={[{key:'title',label:'Title'},{key:'type',label:'Type'},{key:'status',label:'Status'},{key:'createdAt',label:'Created'}]} rows={filteredLost.map(item=>({ id:item.id, title:item.title, type:item.type, status:item.status, createdAt: item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : (item.createdAt ? new Date(item.createdAt).toLocaleString() : '') }))} actions={[{ label:'Mark Found', onClick: r=>handleLostAction(r.id, 'Found') }, { label:'Delete', onClick: r=>requestDelete('lost', r.id) }]} />
          </div>
        </div>

        <div className="col-12">
          <div className="card card-custom p-4 rounded-16">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
              <div>
                <h5 className="mb-1">Complaints</h5>
                <p className="text-muted small mb-0">Track and resolve student service requests.</p>
              </div>
              <div className="d-flex gap-2 w-100 w-md-auto">
                <input className="form-control search-input" placeholder="Search complaints" value={searchComplaints} onChange={e=>setSearchComplaints(e.target.value)} />
              </div>
            </div>
            <SimpleTable columns={[{key:'category',label:'Category'},{key:'status',label:'Status'},{key:'createdAt',label:'Created'}]} rows={filteredComplaints.map(item=>({ id:item.id, category:item.category, status:item.status, createdAt: item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : (item.createdAt ? new Date(item.createdAt).toLocaleString() : '') }))} actions={[{ label:'In Progress', onClick: r=>handleComplaintAction(r.id, 'In Progress') }, { label:'Resolve', onClick: r=>handleComplaintAction(r.id, 'Resolved') }, { label:'Delete', onClick: r=>requestDelete('complaint', r.id) }]} />
          </div>
        </div>

        <div className="col-12">
          <div className="card card-custom p-4 rounded-16">
            <div className="d-flex flex-column flex-md-row justify-content-between align-items-start align-items-md-center gap-3 mb-3">
              <div>
                <h5 className="mb-1">Volunteers</h5>
                <p className="text-muted small mb-0">Approve registrations and keep volunteer records clean.</p>
              </div>
              <div className="d-flex gap-2 w-100 w-md-auto">
                <input className="form-control search-input" placeholder="Search volunteers" value={searchVols} onChange={e=>setSearchVols(e.target.value)} />
              </div>
            </div>
            <SimpleTable columns={[{key:'name',label:'Name'},{key:'event',label:'Event'},{key:'createdAt',label:'Created'}]} rows={filteredVols.map(item=>({ id:item.id, name:item.name, event:item.event, createdAt: item.createdAt && item.createdAt.toDate ? item.createdAt.toDate().toLocaleString() : (item.createdAt ? new Date(item.createdAt).toLocaleString() : '') }))} actions={[{ label:'Approve', onClick: r=>handleVolunteerApprove(r.id) }, { label:'Delete', onClick: r=>requestDelete('volunteer', r.id) }]} />
          </div>
        </div>

        <div className="col-12">
          <div className="card card-custom p-4 rounded-16">
            <h5 className="mb-2">Notifications</h5>
            <p className="text-muted small">Recent activity and alerts across the app.</p>
            <div className="list-group">
              {notifications.length === 0 ? <div className="text-muted small p-3">No notifications yet.</div> : notifications.slice(0,5).map(note => (
                <div key={note.id} className="list-group-item">
                  <div>{note.message}</div>
                  <div className="small text-muted">{fmtDate(note.createdAt)}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <ConfirmModal show={confirm.show} title="Confirm Delete" body="This action is permanent. Continue?" onConfirm={performDelete} onCancel={()=>setConfirm({show:false,type:'',id:null})} />
    </Layout>
  )
}
