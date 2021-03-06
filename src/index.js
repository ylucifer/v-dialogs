/**
 * v-dialogs
 */
import vDialog from './DialogContainer';

const Plugin = {
    install(Vue, options = {}){
        const Dialog = Vue.component(vDialog.name, vDialog), dlg = new Dialog();
        document.body.appendChild(dlg.$mount().$el);
        dlg.$store = options.$store;

        const mergeParams = (p)=>{
            const params = {};
            params.language = typeof(options.language) === 'string' ? options.language : 'cn';
            if(typeof(options.dialogCloseButton) === 'boolean') params.dialogCloseButton = options.dialogCloseButton;
            if(typeof(options.dialogMaxButton) === 'boolean') params.dialogMaxButton = options.dialogMaxButton;
            return Object.assign({}, params, p);
        }, paramSet = args => {
			let params = {};

			if(args.length === 3 && typeof args[2] === 'object') params = args[2];
            if(args.length === 2 && typeof args[1] === 'object') params = args[1];
			if(typeof args[1] === 'function') params.callback = args[1];

			params = mergeParams(params);
			params.message = typeof args[0] === 'string' ? args[0] : '';
			return params;
		}, instanceName = options.instanceName ? options.instanceName : '$dlg';

        function innerQuick(rawParam, type){
            if(!rawParam.length || !rawParam[0]) return;

            const params = [];
            params[0] = rawParam[0];

            if(rawParam.length >= 2){
                params[1] = rawParam[1];
            }else{
                params[1] = null;
            }

            if(rawParam.length >= 3){
                params[2] = rawParam[2];
                params[2].messageType = type;
            }else{
                rawParam[2] = { messageType: type };
            }

            console.log(params);

            return dlg.addAlert(paramSet(params));
        }

        Vue.prototype[instanceName] = {
            modal(component, params = {}){
                if(!component) return;
                params = mergeParams(params);
                params.component = component;
                return dlg.addModal(params);
            },
			/**
			 * Open a Alert dialog
			 *
			 * @param message[string](required)
			 * @param callback[function](optional)
			 * @param params[object](optional)
			 * @returns dialog key[string]
			 *
			 * //open a information type Alert dialog
			 * this.$dlg.alert('some message...')
			 * //open a information type Alert dialog and do something after dialog close
			 * this.$dlg.alert('some message...', ()=>{ do something... })
			 * //open a Alert dialog with options
			 * this.$dlg.alert('some message...', { messageType: 'error' })
			 * //open a Alert dialog with callback and options
			 * this.$dlg.alert('some message...', ()=>{ do something... }, { messageType: 'error' })
			 */
            alert(){
                if(!arguments.length || !arguments[0]) return;
                return dlg.addAlert(paramSet(arguments));
            },
            error() {
                return innerQuick(arguments, "error");
            },
            success(){
               return innerQuick(arguments, "success");
            },
            confirm(){
                return innerQuick(arguments, "confirm");
            },
            mask(){
                return dlg.addMask(paramSet(arguments));
            },
            toast(){
				if(!arguments.length || !arguments[0]) return;
                return dlg.addToast(paramSet(arguments));
            },
            close(key){
                dlg.close(key);
            },
            closeAll(callback){
                dlg.closeAll(callback);
            },
        };
    }
};

export default Plugin;
