import shopmaxApi from "./axiosApi";

// 상품 등록
export const createItem = async (itemData) => {
    try {
        const config = {
           headers: {
              'Content-Type': 'multipart/form-data', // 파일 전송시 반드시 지정
           },
        }
        const response = await shopmaxApi.post('/item', itemData, config)
        return response
    } catch (error) {
        console.error(`API Request 오류: ${error.message}`)
        throw error
    }
}