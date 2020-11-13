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
