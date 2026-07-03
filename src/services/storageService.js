import { ref, uploadBytesResumable, getDownloadURL } from 'firebase/storage'
import { storage } from '../firebase/firebaseConfig'

export function uploadImage(file, path){
  return new Promise((resolve,reject)=>{
    if(!file) return resolve(null)
    const storageRef = ref(storage, path)
    const uploadTask = uploadBytesResumable(storageRef, file)
    uploadTask.on('state_changed',
      ()=>{},
      err=>reject(err),
      async ()=>{
        const url = await getDownloadURL(uploadTask.snapshot.ref)
        resolve(url)
      }
    )
  })
}
