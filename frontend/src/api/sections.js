import {apiClient} from './client'
// auth true =only admin has access
export const getAllSections= async ()=> {
  const response= await apiClient.get('/api/section', { auth: true })
  return response.data 
}

export const getSectionById= async (id)=> {
  const response = await apiClient.get(`/api/section/${id}`, {auth:true })
  return response.data
}

export const createSection= async(sectionData)=> {
  const response= await apiClient.post('/api/section/create',sectionData, {auth:true })
  return response.data
}

export const updateSection=async(id,sectionData)=>{
  const response =await apiClient.put(`/api/section/${id}`,sectionData, {auth:true })
  return response.data
}

export const deleteSection=async(id)=>{
  const response=await apiClient.delete(`/api/section/${id}`, {auth:true })
  return response.data
}

