import React, { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import StatCard from '../components/Card/StatCard'
import useRealtimeCollection from '../hooks/useRealtimeCollection'
import { FaBoxOpen, FaExclamationCircle, FaUsers, FaBell } from 'react-icons/fa'
import Layout from '../components/Layout/Layout'
import { fmtDate } from '../utils/helpers'
import Loader from '../components/Loader/Loader'

export default function Dashboard(){
  const navigate = useNavigate()
  const { data: lost = [], loading: loadingLost } = useRealtimeCollection('lost_found_items')
  const { data: complaints = [], loading: loadingComplaints } = useRealtimeCollection('complaints')
  const { data: vols = [], loading: loadingVols } = useRealtimeCollection('volunteers')
  const { data: notifications = [], loading: loadingNotifications } = useRealtimeCollection('notifications')

  const loading = loadingLost || loadingComplaints || loadingVols || loadingNotifications

  const recentActivity = useMemo(() => {
    const merged = [
      ...lost.map(item => ({ id:item.id, label:item.title, type:'Lost/Found', detail:`${item.type} • ${item.status || 'Pending'}`, date: item.createdAt })),
      ...complaints.map(item => ({ id:item.id, label:item.category, type:'Complaint', detail:item.status, date:item.createdAt })),
      ...vols.map(item => ({ id:item.id, label:item.name, type:'Volunteer', detail:item.event, date:item.createdAt })),
      ...notifications.map(item => ({ id:item.id, label:item.message, type:'Notification', detail:item.read ? 'Read' : 'Unread', date:item.createdAt }))
    ]
    return merged
      .map(item => ({ ...item, date: item.date && item.date.toDate ? item.date.toDate() : (item.date? new Date(item.date) : new Date()) }))
      .sort((a,b)=>b.date - a.date)
      .slice(0,6)
  }, [lost, complaints, vols, notifications])

  const stats = [
    { title:'Total Lost Items', value: lost.length, icon: <FaBoxOpen size={28} color="var(--green)" /> },
    { title:'Total Complaints', value: complaints.length, icon: <FaExclamationCircle size={28} color="#ff7a00" /> },
    { title:'Volunteer Registrations', value: vols.length, icon: <FaUsers size={28} color="var(--blue)" /> },
    { title:'Notifications', value: notifications.length, icon: <FaBell size={28} color="#666" /> }
  ]

  return (
    <Layout>
      <div className="row g-3 mb-4">
        {stats.map(stat => (
          <div className="col-6 col-md-3" key={stat.title}>
            <StatCard title={stat.title} value={stat.value} icon={stat.icon} />
          </div>
        ))}
      </div>

      <div className="row g-4">
        <div className="col-12 col-xl-8">
          <div className="card card-custom p-4 rounded-16">
            <div className="d-flex justify-content-between align-items-start gap-3 mb-3 flex-wrap">
              <div>
                <h5 className="mb-1 fw-bold">Recent Activity</h5>
                <p className="text-muted small mb-0">Latest updates from reports, registrations, and notifications.</p>
              </div>
              <button className="btn btn-outline-primary" onClick={()=>navigate('/notifications')}>View all notifications</button>
            </div>
            {loading ? (
              <Loader />
            ) : recentActivity.length === 0 ? (
              <div className="empty-state">No recent activity yet. Everything will appear here as users interact with the portal.</div>
            ) : (
              <div className="list-group">
                {recentActivity.map(item => (
                  <div key={item.id} className="list-group-item d-flex justify-content-between align-items-start gap-3">
                    <div>
                      <div className="fw-bold">{item.label}</div>
                      <div className="small text-muted">{item.type} • {item.detail}</div>
                    </div>
                    <div className="small text-muted text-nowrap">{fmtDate(item.date)}</div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        <div className="col-12 col-xl-4">
          <div className="card card-custom p-4 rounded-16 h-100">
            <h5 className="mb-3 fw-bold">Quick Actions</h5>
            <div className="d-grid gap-3">
              <button className="btn btn-outline-success" onClick={()=>navigate('/lost-found')}>Report Lost/Found</button>
              <button className="btn btn-outline-primary" onClick={()=>navigate('/complaints')}>Submit a Complaint</button>
              <button className="btn btn-outline-primary" onClick={()=>navigate('/volunteer')}>Register to Volunteer</button>
              <button className="btn btn-outline-primary" onClick={()=>navigate('/admin')}>Open Admin Panel</button>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  )
}
