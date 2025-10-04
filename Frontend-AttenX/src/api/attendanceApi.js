import { useAuthenticatedApi } from './axios'

export const useAttendanceApi = () => {
  const api = useAuthenticatedApi()

  const uploadFile = async (file) => {
    const formData = new FormData()
    formData.append('file', file)
    
    const response = await api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
    return response.data
  }

  const processData = async () => {
    const response = await api.post('/process')
    return response.data
  }

  const getReports = async () => {
    const response = await api.get('/report')
    return response.data
  }

  const getAnomalies = async () => {
    const response = await api.get('/anomalies')
    return response.data
  }

  const downloadReport = async (reportType) => {
    const response = await api.get(`/report/download/${reportType}`, {
      responseType: 'blob',
    })
    return response.data
  }

  return {
    uploadFile,
    processData,
    getReports,
    getAnomalies,
    downloadReport,
  }
}