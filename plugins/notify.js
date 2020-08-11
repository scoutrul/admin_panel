export default (ctx, inject) => {

    const notify = {
        error: responce => {
            let msg = (responce && responce.data && responce.data.message) ? responce.data.message : 'Что-то пошло не так'
            
            if(typeof msg === 'object'){
                for(let i in msg){
                    ctx.app.$toast.error(msg[i])
                }
            } else{
                ctx.app.$toast.error(msg)
            }
        },
        success: msg => {
            ctx.app.$toast.success((msg) ? msg : 'Успешно')
        }
    }


    inject('notify', notify)
    
}