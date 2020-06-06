interface Payload {
    method?: string;
    url: string;
}

const API_URL = 'http://localhost:3000';

const api = async (payload: Payload) => {
    const result = await fetch(
        API_URL + payload.url
    ).then(async (res: Response) => {
        const json = res.json();
        return await json.then(
            (data: any) => {
                return data;
            }).catch((error: any) => {
                throw error;
            })
        }
    ).catch((error: any) => {
        throw error;
    });

    return result;
}

export default api;