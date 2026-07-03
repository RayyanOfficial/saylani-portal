import React, { useMemo, useState } from 'react'
import useAuth from '../hooks/useAuth'
import useRealtimeCollection from '../hooks/useRealtimeCollection'
import Layout from '../components/Layout/Layout'
import StatusBadge from '../components/StatusBadge/StatusBadge'
import Modal from '../components/Modal/Modal'
import ConfirmModal from '../components/ConfirmModal/ConfirmModal'
import { createItem, updateItem, deleteItem } from '../services/lostFoundService'
import { uploadImage } from '../services/storageService'
import { fmtDate, matchTitles } from '../utils/helpers'
import { useToast } from '../context/ToastContext'

const statusOptions = ['Pending','Found']
const typeOptions = ['Lost','Found']

export default function LostFoundPage(){
  const { user } = useAuth()
  const { addToast } = useToast()
  const { data: items = [], loading: loadingItems } = useRealtimeCollection('lost_found_items')
  const { data: mine = [] } = useRealtimeCollection('lost_found_items', user ? { whereClause: { field:'userId', op:'==', value:user.uid }} : undefined)
  const [form,setForm] = useState({ title:'', description:'', type:'Lost', imageFile:null })
  const [search,setSearch] = useState('')
  const [typeFilter,setTypeFilter] = useState('All')
  const [statusFilter,setStatusFilter] = useState('All')
  const [uploading,setUploading] = useState(false)
  const [confirm, setConfirm] = useState({ show:false, itemId:null })
  const [editItem, setEditItem] = useState(null)

  const filteredItems = useMemo(() => {
    const term = search.trim().toLowerCase()
    return items.filter(item => {
      if(typeFilter !== 'All' && item.type !== typeFilter) return false
      if(statusFilter !== 'All' && item.status !== statusFilter) return false
      if(term && !(item.title?.toLowerCase().includes(term) || item.description?.toLowerCase().includes(term))) return false
      return true
    })
  }, [items, typeFilter, statusFilter, search])

  const handleFileChange = (field, file) => {
    setForm(prev => ({ ...prev, [field]: file }))
  }

  const submit = async e => {
    e.preventDefault()
    if(!form.title.trim() || !form.description.trim()){
      addToast('Please complete item title and description', 'danger')
      return
    }
    try{
      setUploading(true)
      let imageURL = null
      if(form.imageFile){
        imageURL = await uploadImage(form.imageFile, `lost_found/${Date.now()}_${form.imageFile.name}`)
      }
      await createItem({ title: form.title.trim(), description: form.description.trim(), type: form.type, imageURL, userId: user.uid })
      addToast('Lost/Found item successfully submitted', 'success')
      setForm({ title:'', description:'', type:'Lost', imageFile:null })
      setSearch('')
    }catch(err){
      console.error(err)
      addToast('Unable to submit item. Try again.', 'danger')
    }finally{setUploading(false)}
  }

  const openEdit = item => {
    setEditItem({ ...item, imageFile: null })
  }

  const closeEdit = () => setEditItem(null)

  const saveEdit = async () => {
    if(!editItem.title.trim() || !editItem.description.trim()){
      addToast('Title and description are required', 'danger')
      return
    }
    try{
      setUploading(true)
      const updatePayload = {
        title: editItem.title.trim(),
        description: editItem.description.trim(),
        type: editItem.type,
        status: editItem.status
      }
      if(editItem.imageFile){
        const imageURL = await uploadImage(editItem.imageFile, `lost_found/${Date.now()}_${editItem.imageFile.name}`)
        updatePayload.imageURL = imageURL
      }
      await updateItem(editItem.id, updatePayload)
      addToast('Item updated successfully', 'success')
      closeEdit()
    }catch(err){
      console.error(err)
      addToast('Update failed. Please try again.', 'danger')
    }finally{setUploading(false)}
  }

  const confirmDelete = id => setConfirm({ show:true, itemId:id })
  const doDelete = async () => {
    try{
      await deleteItem(confirm.itemId)
      addToast('Lost/Found item deleted', 'success')
    }catch(err){
      console.error(err)
      addToast('Delete failed. Please try again.', 'danger')
    }finally{
      setConfirm({ show:false, itemId:null })
    }
  }

  const findMatches = item => items.filter(other => other.id !== item.id && matchTitles(item.title, other.title))

  return (
    <Layout>
      <div className="row gy-4">
        <div className="col-12 col-xl-4">
          <div className="card card-custom p-4 rounded-16">
            <h5 className="mb-3">Report Lost / Found</h5>
            <form onSubmit={submit}>
              <div className="mb-3">
                <label className="form-label">Title</label>
                <input className="form-control" value={form.title} onChange={e=>setForm({...form,title:e.target.value})} placeholder="Item title" required />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea className="form-control" rows={4} value={form.description} onChange={e=>setForm({...form,description:e.target.value})} placeholder="Describe the item" required />
              </div>
              <div className="row g-3 mb-3">
                <div className="col-6">
                  <label className="form-label">Type</label>
                  <select className="form-select" value={form.type} onChange={e=>setForm({...form,type:e.target.value})}>
                    {typeOptions.map(type => <option key={type} value={type}>{type}</option>)}
                  </select>
                </div>
                <div className="col-6">
                  <label className="form-label">Image</label>
                  <input type="file" className="form-control" accept="image/*" onChange={e=>handleFileChange('imageFile', e.target.files[0]||null)} />
                </div>
              </div>
              <button type="submit" className="btn btn-primary w-100" disabled={uploading}>{uploading ? 'Saving...' : 'Submit Item'}</button>
            </form>
          </div>
        </div>

        <div className="col-12 col-xl-8">
          <div className="card card-custom p-4 rounded-16 mb-4">
            <div className="d-flex flex-column flex-md-row gap-3 align-items-start align-items-md-center justify-content-between">
              <div>
                <h5 className="mb-1">Lost & Found Catalog</h5>
                <p className="text-muted small mb-0">Search, filter, and manage recent records in real time.</p>
              </div>
              <div className="d-flex flex-wrap gap-2 w-100 w-md-auto">
                <input className="form-control search-input" placeholder="Search items" value={search} onChange={e=>setSearch(e.target.value)} />
                <button className="btn btn-outline-primary" type="button" onClick={()=>setSearch('')}>Reset</button>
              </div>
            </div>
            <div className="row g-3 mt-3">
              <div className="col-6 col-md-3">
                <select className="form-select" value={typeFilter} onChange={e=>setTypeFilter(e.target.value)}>
                  <option>All</option>
                  {typeOptions.map(type=> <option key={type}>{type}</option>)}
                </select>
              </div>
              <div className="col-6 col-md-3">
                <select className="form-select" value={statusFilter} onChange={e=>setStatusFilter(e.target.value)}>
                  <option>All</option>
                  {statusOptions.map(status=> <option key={status}>{status}</option>)}
                </select>
              </div>
            </div>
          </div>

          {loadingItems ? (
            <div className="row g-3">
              {[...Array(4)].map((_, idx)=>(
                <div className="col-12 col-md-6" key={idx}><div className="skeleton" style={{height:180}} /></div>
              ))}
            </div>
          ) : filteredItems.length === 0 ? (
            <div className="empty-state">No lost & found items match your filters yet.</div>
          ) : (
            <div className="row g-3">
              {filteredItems.map(item => (
                <div className="col-12 col-md-6" key={item.id}>
                  <div className="card card-custom p-3 rounded-16 h-100">
                    {item.imageURL && <img src={item.imageURL} alt={item.title} className="img-fluid rounded mb-3" style={{maxHeight:220, width:'100%', objectFit:'cover'}} />}
                    <div className="d-flex justify-content-between align-items-start mb-2">
                      <div>
                        <h6 className="mb-1">{item.title}</h6>
                        <div className="text-muted small">{item.type} • {fmtDate(item.createdAt)}</div>
                      </div>
                      <StatusBadge status={item.status || 'Pending'} />
                    </div>
                    <p className="text-muted small mb-2">{item.description}</p>
                    <div className="d-flex justify-content-between align-items-center">
                      <button className="btn btn-sm btn-outline-primary" onClick={()=>openEdit(item)}>Edit</button>
                      {findMatches(item).length > 0 && <span className="badge bg-warning text-dark">Match found</span>}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <Modal
        show={!!editItem}
        title="Edit Lost / Found Item"
        onClose={closeEdit}
        footer={
          <>
            <button className="btn btn-secondary" onClick={closeEdit}>Cancel</button>
            <button className="btn btn-primary" onClick={saveEdit} disabled={uploading}>{uploading ? 'Updating...' : 'Save changes'}</button>
          </>
        }
      >
        {editItem && (
          <div>
            <div className="mb-3">
              <label className="form-label">Title</label>
              <input className="form-control" value={editItem.title} onChange={e=>setEditItem({...editItem,title:e.target.value})} />
            </div>
            <div className="mb-3">
              <label className="form-label">Description</label>
              <textarea className="form-control" rows={4} value={editItem.description} onChange={e=>setEditItem({...editItem,description:e.target.value})} />
            </div>
            <div className="row g-3 mb-3">
              <div className="col-6">
                <label className="form-label">Type</label>
                <select className="form-select" value={editItem.type} onChange={e=>setEditItem({...editItem,type:e.target.value})}>
                  {typeOptions.map(type=> <option key={type} value={type}>{type}</option>)}
                </select>
              </div>
              <div className="col-6">
                <label className="form-label">Status</label>
                <select className="form-select" value={editItem.status} onChange={e=>setEditItem({...editItem,status:e.target.value})}>
                  {statusOptions.map(status=> <option key={status} value={status}>{status}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-3">
              <label className="form-label">Replace image</label>
              <input type="file" className="form-control" accept="image/*" onChange={e=>setEditItem({...editItem,imageFile:e.target.files[0]||null})} />
            </div>
            {editItem.imageURL && <div className="mb-3"><img src={editItem.imageURL} alt="preview" className="img-fluid rounded" /></div>}
          </div>
        )}
      </Modal>

      <ConfirmModal show={confirm.show} title="Delete Item" body="Are you sure you want to delete this item?" onConfirm={doDelete} onCancel={()=>setConfirm({show:false,itemId:null})} />
    </Layout>
  )
}
