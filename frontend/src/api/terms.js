import {apiClient} from './client'
// auth true =only admin has access
export const getAllTerms= async ()=> {
  const response= await apiClient.get('/api/term', { auth: true })
  return response.data 
}

export const getTermById= async (id)=> {
  const response = await apiClient.get(`/api/term/${id}`, {auth:true })
  return response.data
}

export const createTerm= async(termData)=> {
  const response= await apiClient.post('/api/term/create',termData, {auth:true })
  return response.data
}

export const updateTerm=async(id,termData)=>{
  const response =await apiClient.put(`/api/term/${id}`,termData, {auth:true })
  return response.data
}

export const deleteTerm=async(id)=>{
  const response=await apiClient.delete(`/api/term/${id}`, {auth:true })
  return response.data
}
