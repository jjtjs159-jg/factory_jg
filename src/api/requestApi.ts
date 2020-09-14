interface Payload {
    method?: string;
    url: string;
}

// const API_URL = 'http://localhost:3000';

const api = async (payload: Payload) => {
    console.log(process.env.API_URL);
    const result = await fetch(
        'http://localhost:3000' + payload.url
    ).then(async (res: Response) => {
        const json = res.json();
        return await json.then(
            (data) => {
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