/* 二次处理模态框交互 */
export function showModal(showModalObj) {
	return new Promise((resolve, reject) => {
		uni.showModal({
			title: showModalObj.title || "友情提示",
			content: showModalObj.content,
			cancelText: showModalObj.cancelText || "取消",
			cancelColor: showModalObj.cancelColor || "#000000",
			confirmText: showModalObj.confirmText || "确认",
			confirmColor: showModalObj.confirmColor || "#0E92F8",
			showCancel: typeof(showModalObj.showCancel) == 'boolean' ? showModalObj.showCancel : true,
			success: res => {
				if (res.confirm) {
					resolve(res)
				} else if (res.cancel) {
					reject(res)
				}
			}
		})
	})
}

/* 二次处理提示交互 */
export function showToast(showToastObj) {
	return new Promise((resolve) => {
		let dataType = typeof(showToastObj) == 'object'	//判断数据类型
		uni.showToast({
			title: dataType ? showToastObj.title || "提示内容" : showToastObj,
			icon: dataType ? showToastObj.icon || "success" : 'none',
			image: showToastObj.image || "",
			mask: showToastObj.mask || true,
			duration: showToastObj.duration || 1500,
			success: res => {
				setTimeout(() => {
					resolve()
				},showToastObj.duration || 1500)
			}
		})
	})
}