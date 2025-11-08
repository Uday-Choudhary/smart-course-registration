import {apiClient} from './client'
// auth true =only admin has access
export const getAllCourses= async ()=> {
  const response= await apiClient.get('/api/course', { auth: true })
  return response.data 
}

export const getCourseById= async (id)=> {
  const response = await apiClient.get(`/api/course/${id}`, {auth:true })
  return response.data
}

export const createCourse= async(courseData)=> {
  const response= await apiClient.post('/api/course/create',courseData, {auth:true })
  return response.data
}

export const updateCourse=async(id,courseData)=>{
  const response =await apiClient.put(`/api/course/${id}`,courseData, {auth:true })
  return response.data
}

export const deleteCourse=async(id)=>{
  const response=await apiClient.delete(`/api/course/${id}`, {auth:true })
  return response.data
}
