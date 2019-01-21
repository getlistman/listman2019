// todo: create npm module
// todo: auto reconnect
// todo: delete completed job func

class WebSocketPromise extends WebSocket {
  
  constructor (url, protocols) {
    
    super(url, protocols)
    
    this.job_id = 0
    this.jobs = []
    
    super.onmessage = event => {
      const data = JSON.parse(event.data)
      
      console.log('[WebSocketPromise.js onmessage]')
      console.dir(data)
      
      if (data.message) {
        this.jobs[data.job_id](data.message)
      } else if (data.resolve) {
        this.jobs[data.job_id].resolve(data.resolve)
      } else if (data.reject) {
        this.jobs[data.job_id].reject(data.reject)
      }
    }
  }
  
  send (data) {
    this.job_id++
    
    super.send(JSON.stringify({
      job_id: this.job_id,
      data: data
    }))
    
    return new Promise((resolve, reject) => {
      this.jobs[this.job_id] = {
        resolve: resolve,
        reject: reject
      }
    })
  }
  
  setJob (job_id, cb) {
    this.jobs[job_id] = cb
  }
  
}

export default WebSocketPromise
