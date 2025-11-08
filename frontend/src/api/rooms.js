import {apiClient} from './client'
// auth true =only admin has access
export const getAllRooms= async ()=> {
  const response= await apiClient.get('/api/room', { auth: true })
  return response.data 
}

export const getRoomById= async (id)=> {
  const response = await apiClient.get(`/api/room/${id}`, {auth:true })
  return response.data
}

export const createRoom= async(roomData)=> {
  const response= await apiClient.post('/api/room/create',roomData, {auth:true })
  return response.data
}

export const updateRoom=async(id,roomData)=>{
  const response =await apiClient.put(`/api/room/${id}`,roomData, {auth:true })
  return response.data
}

export const deleteRoom=async(id)=>{
  const response=await apiClient.delete(`/api/room/${id}`, {auth:true })
  return response.data
}

